package controllers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo"
	log "github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/runner"
)

func ServiceCaller(c echo.Context) error {

	projectId := c.Param("projectId")
	serviceId := c.Param("serviceId")

	service := models.Service{}

	projectIdInt, err := strconv.Atoi(projectId)
	serviceIdInt, err := strconv.Atoi(serviceId)

	err = models.GetService(&service, uint(projectIdInt), uint(serviceIdInt))
	if err != nil {
		return c.NoContent(http.StatusNotFound)
	}

	r := models.Runner{}
	err = models.GetRunner(&r, service)
	if err != nil {
		log.Error(err)
		return c.String(http.StatusInternalServerError, err.Error())
	}

	var runnable runner.SimpleRunnable
	err = runnable.Attach(r.Endpoint, r.Pid)
	if err != nil {
		log.Error(err)
		return c.String(http.StatusInternalServerError, err.Error())
	}

	resp, err := runnable.Execute("hello")
	if err != nil {
		log.Error(err)
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.String(200, resp)

}
