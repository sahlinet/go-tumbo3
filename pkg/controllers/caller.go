package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/sahlinet/go-tumbo3/pkg/models"
)

func ServiceCaller(c *gin.Context) {

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

}
