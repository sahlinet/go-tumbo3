package models

import (
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	log "github.com/sirupsen/logrus"
)

var db *gorm.DB

type Repository struct {
	Db *gorm.DB
}

type Model struct {
	ID         int `gorm:"primary_key" json:"id"`
	CreatedOn  int `json:"created_on"`
	ModifiedOn int `json:"modified_on"`
	DeletedOn  int `json:"deleted_on"`
}

// Setup initializes the database instance
func Setup(repository *Repository) *gorm.DB {
	var err error
	//dsn := fmt.Sprintf("user=postgres password=mysecretpassword dbname=postgres host=localhost port=5432 sslmode=disable TimeZone=Europe/Zurich")

	db = repository.Db

	if err != nil {
		log.Fatalf("models.Setup err: %v", err)
	}

	db.Table("projects").AutoMigrate(&Project{})
	db.Table("git_repositories").AutoMigrate(&GitRepository{})
	db.Table("auths").AutoMigrate(&Auth{})
	db.Table("services").AutoMigrate(&Service{})

	//	gorm.DefaultTableNameHandler = func(db *gorm.DB, defaultTableName string) string {
	//		return setting.DatabaseSetting.TablePrefix + defaultTableName
	//	}

	//	db.SingularTable(true)
	//	db.Callback().Create().Replace("gorm:update_time_stamp", updateTimeStampForCreateCallback)
	//	db.Callback().Update().Replace("gorm:update_time_stamp", updateTimeStampForUpdateCallback)
	//	db.Callback().Delete().Replace("gorm:delete", deleteCallback)
	//		db.DB().SetMaxIdleConns(10)
	//	db.DB().SetMaxOpenConns(100)

	return db
}

// CloseDB closes database connection (unnecessary)
func CloseDB() {
	//	defer db.Close()
}

// updateTimeStampForCreateCallback will set `CreatedOn`, `ModifiedOn` when creating
/*func updateTimeStampForCreateCallback(scope *gorm.Scope) {
	if !scope.HasError() {
		nowTime := time.Now().Unix()
		if createTimeField, ok := scope.FieldByName("CreatedOn"); ok {
			if createTimeField.IsBlank {
				createTimeField.Set(nowTime)
			}
		}

		if modifyTimeField, ok := scope.FieldByName("ModifiedOn"); ok {
			if modifyTimeField.IsBlank {
				modifyTimeField.Set(nowTime)
			}
		}
	}
}*/

/*// updateTimeStampForUpdateCallback will set `ModifiedOn` when updating
func updateTimeStampForUpdateCallback(scope *gorm.Scope) {
	if _, ok := scope.Get("gorm:update_column"); !ok {
		scope.SetColumn("ModifiedOn", time.Now().Unix())
	}
}

// deleteCallback will set `DeletedOn` where deleting
func deleteCallback(scope *gorm.Scope) {
	if !scope.HasError() {
		var extraOption string
		if str, ok := scope.Get("gorm:delete_option"); ok {
			extraOption = fmt.Sprint(str)
		}

		deletedOnField, hasDeletedOnField := scope.FieldByName("DeletedOn")

		if !scope.Search.Unscoped && hasDeletedOnField {
			scope.Raw(fmt.Sprintf(
				"UPDATE %v SET %v=%v%v%v",
				scope.QuotedTableName(),
				scope.Quote(deletedOnField.DBName),
				scope.AddToVars(time.Now().Unix()),
				addExtraSpaceIfExist(scope.CombinedConditionSql()),
				addExtraSpaceIfExist(extraOption),
			)).Exec()
		} else {
			scope.Raw(fmt.Sprintf(
				"DELETE FROM %v%v%v",
				scope.QuotedTableName(),
				addExtraSpaceIfExist(scope.CombinedConditionSql()),
				addExtraSpaceIfExist(extraOption),
			)).Exec()
		}
	}
}
*/
// addExtraSpaceIfExist adds a separator
func addExtraSpaceIfExist(str string) string {
	if str != "" {
		return " " + str
	}
	return ""
}

func InitTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal(err)
	}

	repository := &Repository{Db: db}
	Setup(repository)

	err = createUser(db)
	if err != nil {
		log.Fatal("could not create user", err)
	}

	return db

}

func DestroyTestDB() {
	os.Remove("gorm.db")
}

func createUser(db *gorm.DB) error {
	user := Auth{
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
