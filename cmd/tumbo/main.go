package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"

	"gorm.io/gorm"

	"github.com/sahlinet/go-tumbo3/internal/setting"
	"github.com/sahlinet/go-tumbo3/internal/util"
	"github.com/sahlinet/go-tumbo3/pkg/app"
	"github.com/sahlinet/go-tumbo3/pkg/models"
)

func init() {

	setting.Setup()
	util.Setup()
}

// @title Golang Gin API
// @version 1.0
// @description Tumbo
// @termsOfService https://github.com/sahlinet/go-tumbo
// @license.name MIT
// @license.url https://github.com/sahlinet/go-tumbo3/blob/master/LICENSE
func main() {
	var err error
	dsn := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=%s TimeZone=Europe/Zurich",
		setting.DatabaseSetting.User,
		setting.DatabaseSetting.Password,
		setting.DatabaseSetting.Name,
		setting.DatabaseSetting.Host,
		setting.DatabaseSetting.Port,
		setting.DatabaseSetting.SslMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	if err != nil {
		log.Fatalf("models.Setup err: %v", err)
	}

	repository := &models.Repository{Db: db}

	app1 := app.App{
		Repository: models.Repository{Db: db},
	}

	err = models.CreateUser(db)
	if err != nil {
		log.Fatal(err)
	}

	app.TestData(db)

	models.Setup(repository)

	err = app1.Run().Start(":8000")
	if err != nil {
		log.Fatal(err)
	}

	// If you want Graceful Restart, you need a Unix system and download github.com/fvbock/endless
	//endless.DefaultReadTimeOut = readTimeout
	//endless.DefaultWriteTimeOut = writeTimeout
	//endless.DefaultMaxHeaderBytes = maxHeaderBytes
	//server := endless.NewServer(endPoint, routersInit)
	//server.BeforeBegin = func(add string) {
	//	log.Printf("Actual pid is %d", syscall.Getpid())
	//}
	//
	//err := server.ListenAndServe()
	//if err != nil {
	//	log.Printf("Server err: %v", err)
	//}
}
