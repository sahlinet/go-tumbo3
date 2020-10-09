package routers

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/sahlinet/go-tumbo/models"
	"gorm.io/gorm"
)

/*func init() {
	setting.Setup()
	models.Setup()
	logging.Setup()
	gredis.Setup()
	util.Setup()
}
*/

var db *gorm.DB

func init() {
	db = models.Setup()

	createUser(db)

}

func createUser(db *gorm.DB) error {
	user := models.Auth{
		ID:       0,
		Username: "User",
		Password: "Pw",
	}
	if err := db.Create(&user).Error; err != nil {
		return err
	}

	return nil
}

func TestServer(t *testing.T) {

	tests := []struct {
		url                string
		method             string
		expectedHTTPStatus int
		expectedMessage    string
	}{
		{
			url:                "/api/v1/projects",
			method:             "GET",
			expectedHTTPStatus: http.StatusOK,
			expectedMessage:    `{"Message":"Worker huhu started"}`,
		},
		{
			url:                "/index.html",
			method:             "GET",
			expectedHTTPStatus: http.StatusOK,
			expectedMessage:    `<html>...`,
		},
	}

	ts := httptest.NewServer(InitRouter())
	// Shut down the server and block until all requests have gone through
	defer ts.Close()
	fmt.Println(ts.URL)

	for _, tt := range tests {

		req, err := http.NewRequest(tt.method, fmt.Sprintf("%s%s", ts.URL, tt.url), nil)
		if err != nil {
			t.Error("http.NewRequest err", err)
		}
		client := http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			t.Error("client.Do err", err)
		}

		if resp.StatusCode != tt.expectedHTTPStatus {
			t.Error("Did not get expected HTTP status code, got", resp.StatusCode)
		}

		/*if strings.TrimRight(w.Body.String(), "\n") != tt.expectedMessage {
			t.Error("Did not get expected message, got", w.Body.String())
		}
		*/

	}
}
