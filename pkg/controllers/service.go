package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo"
	log "github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/runner"
)

func GetServices(c echo.Context) error {
	projectId := c.Param("projectId")

	//var services []models.Service
	services := make([]models.Service, 0)
	projectIdInt, err := strconv.Atoi(projectId)
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}
	err = models.GetAllServicesForProject(&services, uint(projectIdInt))
	if err != nil {
		return c.NoContent(http.StatusNotFound)

	}
	return c.JSONPretty(http.StatusOK, services, " ")

}

func GetService(c echo.Context) error {
	if strings.HasSuffix("c.Request.RequestURI", "services") {
		return GetServices(c)
	}

	projectId := c.Param("projectId")
	serviceId := strings.TrimLeft(c.Param("serviceId"), "/")

	//var services []models.Service
	service := models.Service{}
	projectIdInt, err := strconv.Atoi(projectId)
	serviceIdInt, err := strconv.Atoi(serviceId)
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}
	err = models.GetService(&service, uint(projectIdInt), uint(serviceIdInt))
	if err != nil {
		return c.NoContent(http.StatusNotFound)
	}

	return c.JSONPretty(http.StatusOK, service, " ")

}

func ServiceState(c echo.Context) error {
	projectId := c.Param("projectId")
	serviceId := strings.TrimLeft(c.Param("serviceId"), "/")

	service := models.Service{}
	projectIdInt, err := strconv.Atoi(projectId)
	serviceIdInt, err := strconv.Atoi(serviceId)
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}
	err = models.GetService(&service, uint(projectIdInt), uint(serviceIdInt))
	if err != nil {
		return c.NoContent(http.StatusNotFound)
	}

	// Get Runnable
	runnable, err := runner.GetRunnableForProject(&service)
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}

	store := runner.ExecutableStoreFilesystem{
		Root: "/tmp",
	}

	// Start
	if c.Request().Method == http.MethodPut {

		err = runnable.Build(store)
		if err != nil {
			log.Error(err)
			return c.NoContent(http.StatusInternalServerError)
		}

		// Run
		endpoint, err := runnable.Run(store)
		log.Info(endpoint)

		if err != nil {
			log.Error(err)
			return c.NoContent(http.StatusInternalServerError)
		}

		// Store informations to reconnect later with reAttachConfig
		runner := models.Runner{
			Endpoint:  endpoint.Addr.String(),
			Pid:       endpoint.Pid,
			ServiceID: service.ID,
		}
		log.Debug(runner)

		err = models.CreateRunner(&runner, service)
		if err != nil {
			log.Error(err)
			return c.NoContent(http.StatusInternalServerError)
		}

	}

	// Stop
	if c.Request().Method == http.MethodDelete {
		r := models.Runner{}
		err = models.GetRunner(&r, service)
		if err != nil {
			log.Error(err)
			return c.NoContent(http.StatusInternalServerError)
		}

		var runnable runner.SimpleRunnable
		err = runnable.Attach(r.Endpoint, r.Pid)
		if err != nil {
			log.Error(err)
			return c.NoContent(http.StatusInternalServerError)
		}

		err = runnable.Stop()
		if err != nil {
			log.Error(err)
			return c.NoContent(http.StatusInternalServerError)
		}
	}

	return nil
}
