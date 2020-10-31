package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/sahlinet/go-tumbo3/pkg/models"
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
	serviceId := c.Params.ByName("serviceId")

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
