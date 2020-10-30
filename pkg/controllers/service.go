package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/sahlinet/go-tumbo3/pkg/models"
)

type ServiceController struct {
	Services models.Service
}

func (sc *ServiceController) GetServices(c *gin.Context) {
	projectId := c.Params.ByName("id")

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
