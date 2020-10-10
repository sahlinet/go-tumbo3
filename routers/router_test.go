package routers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/DATA-DOG/go-sqlmock"
	log "github.com/sirupsen/logrus"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"net/http"
	"net/http/httptest"
	"net/url"
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

var mock sqlmock.Sqlmock
var db *sql.DB
var err error

func init() {
	db, mock, err = sqlmock.New() // mock sql.DB
	if err != nil {
		log.Fatal(err)
	}

	dialector := postgres.New(postgres.Config{
		DSN:                  "sqlmock_db_0",
		DriverName:           "postgres",
		Conn:                 db,
		PreferSimpleProtocol: true,
	})

	gdb, err := gorm.Open(dialector, &gorm.Config{}) // open gorm db
	if err != nil {
		log.Fatal(err)
	}

	repository := &models.Repository{Db: gdb}
	models.Setup(repository)

	//	rows := mock.NewRows([]string{"a"})

	//mock.ExpectExec(`INSERT INTO .*`)//.WithArgs("{Name: Ordinal:1 Value:User}", "{Name: Ordinal:2 Value:Pw}")
	//mock.ExpectExec(`INSERT INTO .*`).WithArgs("User", "Pw")
	userRow := sqlmock.NewRows([]string{"id", "username", "password"}).
		AddRow(1, "user1", "password")
	log.Info(userRow)

	// SELECT "id" FROM "auths" WHERE "auths"."username" = $1 AND "auths"."password" = $2 ORDER BY "auths"."id" LIMIT 1' with args [{Name: Ordinal:1 Value:user1} {Name: Ordinal:2 Value:password}]
	// SELECT "id" FROM "auths" WHERE "auths"."username" = 'user1' AND "auths"."password" = 'password' ORDER BY "auths"."id" LIMIT 1
	mock.ExpectQuery("^SELECT (.+) FROM (.*)").WillReturnRows(userRow)
	//prep := mock.ExpectPrepare(`INSERT INTO \"auths.*`)
	//prep.ExpectExec() //.WithArgs("{Name: Ordinal:1 Value:User}", "{Name: Ordinal:2 Value:Pw}").WillReturnResult(sqlmock.NewResult(1, 1))

	//	err = createUser(gdb)
	//	if err != nil {
	//		panic(err)
	//	}

}

func createUser(db *gorm.DB) error {
	user := models.Auth{
		ID:       0,
		Username: "User",
		Password: "Pw",
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
				},
				{
					url:                "/index.html",
					method:             "GET",
					expectedHTTPStatus: http.StatusOK,
					expectedMessage:    `<html>...`,
				},*/
		{
			url:                "/auth",
			method:             "POST",
			body:               []string{"user1", "password"},
			expectedHTTPStatus: http.StatusOK,
			expectedMessage:    `<html>...`,
			isForm:             true,
		},
	}

	ts := httptest.NewServer(InitRouter())

	// Shut down the server and block until all requests have gone through
	defer ts.Close()
	fmt.Println(ts.URL)

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

		/*if strings.TrimRight(w.Body.String(), "\n") != tt.expectedMessage {
			t.Error("Did not get expected message, got", w.Body.String())
		}
		*/

		err = mock.ExpectationsWereMet()
		assert.Nil(t, err)
	}

}
