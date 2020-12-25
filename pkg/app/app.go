package app

import (
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

	logger := logrus.New()
	log := logger.WithField("process", "operator")

	// Run the operator built-in
	operator := operator.Operator{}
	go operator.Run(log)

	// Run the router
	routersInit := routers.InitRouter()
	return routersInit

}
