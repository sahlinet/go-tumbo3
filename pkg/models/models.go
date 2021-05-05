package models

import (
	"fmt"
	"os"

	log "github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

type Repository struct {
	Db *gorm.DB
}

type Model struct {
	ModelNonId

	ID uint `gorm:"primary_key" json:"id"`
}

type ModelNonId struct {
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

	err = db.Table("projects").AutoMigrate(&Project{})
	if err != nil {
		log.Fatal(err)
	}

	err = db.Table("git_repositories").AutoMigrate(&GitRepository{})
	if err != nil {
		log.Fatal(err)
	}

	err = db.Table("project_state").AutoMigrate(&ProjectState{})
	if err != nil {
		log.Fatal(err)
	}
	err = db.Table("auths").AutoMigrate(&Auth{})
	if err != nil {
		log.Fatal(err)
	}
	err = db.Table("runners").AutoMigrate(&Runner{})
	if err != nil {
		log.Fatal(err)
	}

	err = db.Table("executable_store_db_items").AutoMigrate(&ExecutableStoreDbItem{})
	if err != nil {
		log.Fatal(err)
	}

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

var Repo *Repository

func InitTestDB(name string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(fmt.Sprintf("gorm-%s.db", name)), &gorm.Config{
		//Logger:                                   logger.Default.LogMode(logger.Info),
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Fatal(err)
	}

	Repo = &Repository{Db: db}
	Setup(Repo)

	err = CreateUser(db)
	if err != nil {
		log.Fatal("could not create user", err)
	}

	return db

}

func DestroyTestDB(name string) {
	err := os.Remove(fmt.Sprintf("gorm-%s.db", name))
	if err != nil {
		log.Error(err)
	}
}
