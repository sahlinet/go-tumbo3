package app

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
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
		/*		{
				url:                "/api/v1/projects",
				method:             "GET",
				expectedHTTPStatus: http.StatusOK,
				expectedMessage:    `{"Message":"Worker huhu started"}`,
			},*/

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
				resp, err = client.Do(req)
				if err != nil {
					t.Error("client.Do err", err)
				}

			}

			if resp.StatusCode != tt.expectedHTTPStatus {
				t.Errorf("Did not get expected HTTP status code %b, got %b", tt.expectedHTTPStatus, resp.StatusCode)
			}

			assert.Nil(t, err)

		})
	}

}
