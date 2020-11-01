package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/runner"
)

func GetServices(c *gin.Context) {
	projectId := c.Params.ByName("projectId")

	//var services []models.Service
	services := make([]models.Service, 0)
	projectIdInt, err := strconv.Atoi(projectId)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
	}
	err = models.GetAllServicesForProject(&services, uint(projectIdInt))
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, services)
	}

}

func GetService(c *gin.Context) {
	if strings.HasSuffix("c.Request.RequestURI", "services") {
		GetServices(c)
		return
	}

	projectId := c.Params.ByName("projectId")
	serviceId := strings.TrimLeft(c.Params.ByName("serviceId"), "/")

	//var services []models.Service
	service := models.Service{}
	projectIdInt, err := strconv.Atoi(projectId)
	serviceIdInt, err := strconv.Atoi(serviceId)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
	}
	err = models.GetService(&service, uint(projectIdInt), uint(serviceIdInt))
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, service)
	}

}

func ServiceState(c *gin.Context) {
	projectId := c.Params.ByName("projectId")
	serviceId := strings.TrimLeft(c.Params.ByName("serviceId"), "/")

	service := models.Service{}
	projectIdInt, err := strconv.Atoi(projectId)
	serviceIdInt, err := strconv.Atoi(serviceId)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
	}
	err = models.GetService(&service, uint(projectIdInt), uint(serviceIdInt))
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	}

	// Get Runnable
	runnable, err := runner.GetRunnableForProject(&service)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
	}

	store := runner.ExecutableStoreFilesystem{
		Root: "/tmp",
	}

	// Start
	if c.Request.Method == http.MethodPut {

		err = runnable.Build(store)
		if err != nil {
			log.Error(err)
			c.AbortWithStatus(http.StatusInternalServerError)
		}

		// Run
		endpoint, err := runnable.Run(store)
		log.Info(endpoint)

		if err != nil {
			log.Error(err)
			c.AbortWithStatus(http.StatusInternalServerError)
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
			c.AbortWithStatus(http.StatusInternalServerError)
		}

	}

	// Stop
	if c.Request.Method == http.MethodDelete {
		r := models.Runner{}
		err = models.GetRunner(&r, service)
		if err != nil {
			log.Error(err)
			c.AbortWithStatus(http.StatusInternalServerError)
		}

		var runnable runner.SimpleRunnable
		err = runnable.Attach(r.Endpoint, r.Pid)
		if err != nil {
			log.Error(err)
			c.AbortWithStatus(http.StatusInternalServerError)
		}

		err = runnable.Stop()
		if err != nil {
			log.Error(err)
			c.AbortWithStatus(http.StatusInternalServerError)
		}
	}

}
