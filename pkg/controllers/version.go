package controllers

import (
	"github.com/gin-gonic/gin"

	"github.com/sahlinet/go-tumbo3/pkg/version"
)

func Version(c *gin.Context) {
	c.String(200, version.BuildVersion)

}
