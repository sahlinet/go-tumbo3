package app

import (
	"github.com/gin-gonic/gin"

	"github.com/sahlinet/go-tumbo3/internal/setting"
	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/routers"
)

type App struct {
	Api        *gin.Engine
	Repository models.Repository
}

func (a *App) Run() *gin.Engine {

	gin.SetMode(setting.ServerSetting.RunMode)

	routersInit := routers.InitRouter()
	return routersInit
	/*readTimeout := setting.ServerSetting.ReadTimeout
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

	*/

}
