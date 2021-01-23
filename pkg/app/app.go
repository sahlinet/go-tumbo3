package app

import (
	"flag"

	"github.com/labstack/echo"
	"github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/operator"
	"github.com/sahlinet/go-tumbo3/pkg/routers"
	"github.com/sahlinet/go-tumbo3/pkg/runner"
)

type App struct {
	Api        *echo.Echo
	Repository models.Repository
	Store      runner.ExecutableStore
}

func (a *App) Run() *echo.Echo {

	// Run the operator built-in

	if flag.Lookup("test.v") == nil {

		operator := operator.Operator{}
		logger := logrus.New()
		log := logger.WithField("process", "operator")
		go operator.Run(log)
	}

	//log = logger.WithField("process", "operator2")
	//go operator.Run(log)

	// Run the router
	routersInit := routers.InitRouter()
	return routersInit

}
