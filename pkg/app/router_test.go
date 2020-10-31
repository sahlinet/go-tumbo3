package app

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/sahlinet/go-tumbo3/pkg/models"
)

/*func init() {
	setting.Setup()
	models.Setup()
	logging.Setup()
	gredis.Setup()
	util.Setup()
}
*/

var db *sql.DB
var err error
var app App

func init() {
	db := models.InitTestDB("server")
	app = App{
		Repository: models.Repository{
			Db: db,
		},
	}

	db.Create(&models.Project{
		Name:          "the-project",
		Description:   "a project to test",
		State:         0,
		GitRepository: nil,
		Services: []models.Service{{
			Name: "service-A",
		}},
	})

}

func TestServer(t *testing.T) {
	defer models.DestroyTestDB("server")

	tests := []struct {
		url                string
		method             string
		body               []string
		expectedHTTPStatus int
		expectedMessage    string
		isForm             bool
	}{
		{
			url:                "/api/v1/projects",
			method:             "GET",
			expectedHTTPStatus: http.StatusOK,
			expectedMessage:    `{"code":200,"msg":"ok","data":{"lists":[{"created_on":0,"modified_on":0,"deleted_on":0,"id":1,"Name":"the-project","description":"a project to test","created_by":"","modified_by":"","state":0,"GitRepository":null,"Services":null}]}}`,
		},

		{
			url:                "/auth",
			method:             "POST",
			body:               []string{"user1", "password"},
			expectedHTTPStatus: http.StatusOK,
			isForm:             true,
		},
		{
			url:                "/",
			method:             "GET",
			expectedHTTPStatus: http.StatusOK,
			body:               nil,
			isForm:             false,
		},
		{
			url:                "/dist/elm.compiled.js",
			method:             "GET",
			expectedHTTPStatus: http.StatusOK,
			body:               nil,
			isForm:             false,
		},
	}

	ts := httptest.NewServer(app.Run())

	// Shut down the server and block until all requests have gone through
	defer ts.Close()

	for _, tt := range tests {
		t.Run(tt.url, func(t *testing.T) {

			loginUrl := fmt.Sprintf("%s%s", ts.URL, "/auth")
			token, err := Auth(loginUrl, "user1", "password")
			if err != nil {
				t.Error(err)
			}

			reqBody, err := json.Marshal(tt.body)
			if err != nil {
				print(err)
			}

			var resp *http.Response

			if tt.isForm {

				resp, err = http.PostForm(fmt.Sprintf("%s%s", ts.URL, tt.url), url.Values{
					"username": {"user1"},
					"password": {"password"}})

				//okay, moving on...
				if err != nil {
					t.Fatal(err, resp)
				}

			}

			if !tt.isForm {

				req, err := http.NewRequest(tt.method, fmt.Sprintf("%s%s", ts.URL, tt.url), bytes.NewBuffer(reqBody))
				if err != nil {
					t.Error("http.NewRequest err", err)
				}
				client := http.Client{}
				req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
				resp, err = client.Do(req)
				if err != nil {
					t.Error("client.Do err", err)
				}

			}

			if resp.StatusCode != tt.expectedHTTPStatus {
				t.Errorf("Did not get expected HTTP status code %d, got %d", tt.expectedHTTPStatus, resp.StatusCode)
			}

			if tt.expectedMessage != "" {

				bodyBytes, err := ioutil.ReadAll(resp.Body)
				if err != nil {
					log.Fatal(err)
				}
				bodyString := string(bodyBytes)
				assert.Equal(t, bodyString, tt.expectedMessage)
			}

			assert.Nil(t, err)

		})
	}

}

type Response struct {
	Data Token `json:"data"`
}

type Token struct {
	Token string `json:"token"`
}

func Auth(u, username, password string) (string, error) {
	resp, err := http.PostForm(u, url.Values{
		"username": {username},
		"password": {password}})
	if err != nil {
		return "", err
	}

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	//bodyString := string(bodyBytes)
	respJson := &Response{}
	err = json.Unmarshal(bodyBytes, respJson)
	if err != nil {
		return "", err
	}
	return respJson.Data.Token, nil

}
