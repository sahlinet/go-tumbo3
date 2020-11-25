package controllers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"syscall"

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

func ServiceStateHandler(c echo.Context) error {
	projectID := c.Param("projectId")
	serviceID := strings.TrimLeft(c.Param("serviceId"), "/")

	var state string
	switch state = c.Request().Method; state {
	case http.MethodPut:
		state = "Start"
	case http.MethodDelete:
		state = "Stop"
	}

	if state == "" {
		return c.NoContent(http.StatusInternalServerError)
	}
	projectIDInt, err := strconv.Atoi(projectID)
	serviceIDInt, err := strconv.Atoi(serviceID)
	err = ChangeServiceState(projectIDInt, serviceIDInt, state)
	if err != nil && err == ErrNotFound {
		return c.NoContent(http.StatusNotFound)

	}
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}
	return nil
}

var ErrNotFound = errors.New("not found")

func ChangeServiceState(projectID, serviceID int, state string) error {
	service, err, runnable, store, err2, done := GetSimpleRunnable(projectID, serviceID)
	if done {
		return err2
	}

	// Start
	if state == "Start" {

		err = runnable.Build(store)
		if err != nil {
			log.Error(err)
			return err
		}

		// Run
		endpoint, err := runnable.Run(store)

		if err != nil {
			log.Error(err)
			return err
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
			return err
		}

	}

	// Stop
	if state == "Stop" {
		r := models.Runner{}
		err = models.GetRunner(&r, service)
		if err != nil {
			log.Error(err)
			return err
		}

		var runnable runner.SimpleRunnable
		err = runnable.Attach(r.Endpoint, r.Pid)
		if err != nil {
			log.Error(err)
			return err
		}

		err = runnable.Stop()
		if err != nil {
			log.Error(err)
			return err
		}
	}

	return nil
}

func GetRunner(service models.Service) (*runner.SimpleRunnable, error) {
	r := &models.Runner{}
	err := models.GetRunner(r, service)
	if err != nil {
		log.Error(err)
		return nil, err
	}

	runnable := runner.SimpleRunnable{}
	err = runnable.Attach(r.Endpoint, r.Pid)
	if err != nil {
		log.Error(err)
		return &runnable, err
	}
	return &runnable, nil
}

func GetSimpleRunnable(projectID int, serviceID int) (models.Service, error, runner.SimpleRunnable, runner.ExecutableStoreFilesystem, error, bool) {
	service := models.Service{}
	err := models.GetService(&service, uint(projectID), uint(serviceID))
	if err != nil {
		return models.Service{}, nil, runner.SimpleRunnable{}, runner.ExecutableStoreFilesystem{}, err, true
	}

	repo := models.GitRepository{}
	err = models.GetRepositoryForProject(&repo, uint(projectID))
	if err != nil {
		return models.Service{}, nil, runner.SimpleRunnable{}, runner.ExecutableStoreFilesystem{}, ErrNotFound, true
	}

	// Get Runnable
	runnable, err := runner.GetRunnableForProject(&service, &repo)
	if err != nil {
		return models.Service{}, nil, runner.SimpleRunnable{}, runner.ExecutableStoreFilesystem{}, err, true
	}

	store := runner.ExecutableStoreFilesystem{
		Root: "/tmp",
	}
	return service, err, runnable, store, nil, false
}

func DeleteRunnerForService(service *models.Service) error {
	r := models.Runner{}
	err := models.GetRunner(&r, *service)
	if err != nil {
		return err
	}
	err = syscall.Kill(r.Pid, 9)
	if err != nil {
		log.Infof("not running anymore: %s", err)
	}

	m := models.DeleteRunner(r.ID)
	return m
}
