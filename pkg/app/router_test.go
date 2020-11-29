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

	"github.com/sahlinet/go-tumbo3/pkg/client"
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

	LoadTestData(db)

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
			expectedMessage: `[
 {
  "created_on": 0,
  "modified_on": 0,
  "deleted_on": 0,
  "id": 1,
  "name": "the-project",
  "description": "a project to test",
  "created_by": "",
  "modified_by": "",
  "state": "not started",
  "errormsg": "",
  "GitRepository": null,
  "Services": null
 }
]
`,
		},
		{
			url:                "/api/v1/projects/1/services",
			method:             "GET",
			expectedHTTPStatus: http.StatusOK,
			expectedMessage: `[
 {
  "created_on": 0,
  "modified_on": 0,
  "deleted_on": 0,
  "id": 1,
  "Name": "service-A",
  "ProjectID": 1,
  "Runners": null
 }
]
`,
		},
		{
			url:                "/api/v1/projects/1/services/1",
			method:             "GET",
			expectedHTTPStatus: http.StatusOK,
			expectedMessage: `{
 "created_on": 0,
 "modified_on": 0,
 "deleted_on": 0,
 "id": 1,
 "Name": "service-A",
 "ProjectID": 1,
 "Runners": null
}
`,
		},
		{
			url:                "/api/v1/projects/1/services/1/run",
			method:             "PUT",
			expectedHTTPStatus: http.StatusOK,
			expectedMessage:    "",
		},
		{
			url:                "/api/v1/projects/1/services/1/call",
			method:             "GET",
			expectedHTTPStatus: http.StatusOK,
			expectedMessage:    "Hello hello",
		},
		{
			url:                "/api/v1/projects/1/services/1/run",
			method:             "DELETE",
			expectedHTTPStatus: http.StatusOK,
			expectedMessage:    "",
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
			token, err := client.Auth(loginUrl, "user1", "password")
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
				assert.Equal(t, tt.expectedMessage, bodyString)
			}

			assert.Nil(t, err)

		})
	}

}
