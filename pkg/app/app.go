package app

import (
	"github.com/labstack/echo"
	"github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/operator"
	"github.com/sahlinet/go-tumbo3/pkg/routers"
)

type App struct {
	Api        *echo.Echo
	Repository models.Repository
}

func (a *App) Run() *echo.Echo {

	//gin.SetMode(setting.ServerSetting.RunMode)

	logger := logrus.New()
	log := logger.WithField("process", "operator")

	operator := operator.Operator{}
	go operator.Run(log)

	routersInit := routers.InitRouter()
	return routersInit

	// Start server

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
