//go:generate pkger

package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/markbates/pkger"
	"log"
	"net/http"

	"github.com/sahlinet/go-tumbo/models"
	"github.com/sahlinet/go-tumbo/pkg/gredis"
	"github.com/sahlinet/go-tumbo/pkg/logging"
	"github.com/sahlinet/go-tumbo/pkg/setting"
	"github.com/sahlinet/go-tumbo/pkg/util"
	"github.com/sahlinet/go-tumbo/routers"
)

func init() {
	setting.Setup()
	models.Setup()
	logging.Setup()
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

	pkger.Include("/web")

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
