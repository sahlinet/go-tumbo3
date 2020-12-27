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
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/sahlinet/go-tumbo3/pkg/client"
	"github.com/sahlinet/go-tumbo3/pkg/models"
)

var db *sql.DB
var err error
var app App

func init() {
	db := models.InitTestDB("server")

	app = App{
		Repository: models.Repository{
			Db: db,
		},
		Store: models.ExecutableStoreDb{},
	}

	//LoadTestData(db)

}

func TestServerNew(t *testing.T) {
	defer models.DestroyTestDB("server")

	tests := []struct {
		name               string
		project            models.Project
		expectedHTTPStatus int
		expectedStarting   bool
	}{
		{
			expectedStarting:   true,
			expectedHTTPStatus: http.StatusOK,
			project: models.Project{
				Name:        "working-project",
				Description: "huhu",
				GitRepository: &models.GitRepository{
					Url: "../../examples/example-plugin-go-grpc",
				},
			},
		},
		/*		{
				expectedStarting:   false,
				expectedHTTPStatus: http.StatusOK,
				project: models.Project{
					Name:        "failing-project",
					Description: "huhu",
					GitRepository: &models.GitRepository{
						Url: "../../examples/example-plugin-go-grpc-fail",
					},
				},
			},*/
	}

	ts := httptest.NewServer(app.Run())

	// Shut down the server and block until all requests have gone through
	defer ts.Close()

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			loginURL := fmt.Sprintf("%s%s", ts.URL, "/auth")
			token, err := client.Auth(loginURL, "user1", "password")
			if err != nil {
				t.Error(err)
			}

			url := fmt.Sprintf(ts.URL)

			// Create
			err = client.CreateProject(url, token, &tt.project)
			assert.Nil(t, err)

			//projects, err := client.GetProjects(url, token)
			//assert.Len(t, projects, 1)

			// Start
			if tt.expectedStarting {
				err = client.StartProject(url, token, &tt.project)
				assert.Nil(t, err)
				assert.Equal(t, "Running", tt.project.State)
				assert.NotEmpty(t, tt.project.GitRepository.Version)

				// Access

				// Stop
				client.StopProject(url, token, &tt.project)

				assert.Equal(t, "Stopped", tt.project.State)
			}

			// Delete
			//client.Delete

		})
	}

}

func pretty(b []byte) []byte {

	var prettyJSON bytes.Buffer
	err := json.Indent(&prettyJSON, b, "", "  ")
	s := string(b)
	log.Print(s)
	if err != nil {
		log.Fatal(err)
	}

	r, err := ioutil.ReadAll(&prettyJSON)
	if err != nil {
		log.Print("Parsing error: ", prettyJSON)
		log.Fatal(err)
	}
	return r
}
