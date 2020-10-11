package main

import (
	"fmt"
	"gorm.io/driver/postgres"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/sahlinet/go-tumbo/models"
	"github.com/sahlinet/go-tumbo/pkg/gredis"
	"github.com/sahlinet/go-tumbo/pkg/setting"
	"github.com/sahlinet/go-tumbo/pkg/util"
	"github.com/sahlinet/go-tumbo/routers"
)


func init() {

	var err error
	dsn := "user=postgres password=mysecretpassword dbname=postgres host=localhost port=5432 sslmode=disable TimeZone=Europe/Zurich"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalf("models.Setup err: %v", err)
	}

	repository := &models.Repository{Db: db}

	setting.Setup()
	models.Setup(repository)
	//	logging.Setup()
	gredis.Setup()
	util.Setup()
}

// @title Golang Gin API
// @version 1.0
// @description Tumbo
// @termsOfService https://github.com/sahlinet/go-tumbo
// @license.name MIT
// @license.url https://github.com/sahlinet/go-tumbo/blob/master/LICENSE
func main() {

	gin.SetMode(setting.ServerSetting.RunMode)

	routersInit := routers.InitRouter()
	readTimeout := setting.ServerSetting.ReadTimeout
	writeTimeout := setting.ServerSetting.WriteTimeout
	endPoint := fmt.Sprintf(":%d", setting.ServerSetting.HttpPort)
	maxHeaderBytes := 1 << 20

	server := &http.Server{
		Addr:           endPoint,
		Handler:        routersInit,
		ReadTimeout:    readTimeout,
		WriteTimeout:   writeTimeout,
		MaxHeaderBytes: maxHeaderBytes,
	}

	log.Printf("[info] start http server listening %s", endPoint)

	server.ListenAndServe()

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
