package routers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	log "github.com/sirupsen/logrus"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"

	"gorm.io/gorm"

	"github.com/sahlinet/go-tumbo/models"
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

func init() {

	db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	repository := &models.Repository{Db: db}
	models.Setup(repository)

	err = createUser(db)
	if err != nil {
		log.Fatal("could not create user", err)
	}

}

func createUser(db *gorm.DB) error {
	user := models.Auth{
		ID:       0,
		Username: "user1",
		Password: "password",
	}

	tx := db.Create(&user)
	if tx.Error != nil {
		return tx.Error
	}

	log.Info(tx.Row())

	return nil
}

func TestServer(t *testing.T) {

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
			expectedMessage:    `<html>...`,
			isForm:             true,
		},
		{
			url:                "/",
			method:             "GET",
			expectedHTTPStatus: http.StatusOK,
			expectedMessage:    `<html>...`,
			body:               nil,
			isForm:             false,
		},
	}

	ts := httptest.NewServer(InitRouter())

	// Shut down the server and block until all requests have gone through
	defer ts.Close()

	for _, tt := range tests {

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
			t.Error("Did not get expected HTTP status code, got", resp.StatusCode)
		}

		assert.Nil(t, err)
	}

}
