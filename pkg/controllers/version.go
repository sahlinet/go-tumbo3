package controllers

import (
	"github.com/labstack/echo"

	"github.com/sahlinet/go-tumbo3/pkg/version"
)

func Version(c echo.Context) error {
	return c.String(200, version.BuildVersion)

}
