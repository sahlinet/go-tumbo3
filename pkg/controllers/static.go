//go:generate rice embed-go -v

package controllers

import (
	"net/http"
	"path/filepath"
	"strings"

	rice "github.com/GeertJohan/go.rice"
	"github.com/labstack/echo"
	"github.com/sirupsen/logrus"
)

func StaticFile(c echo.Context) error {
	conf := rice.Config{
		//LocateOrder: []rice.LocateMethod{rice.LocateEmbedded, rice.LocateAppended, rice.LocateFS},
		LocateOrder: []rice.LocateMethod{rice.LocateEmbedded},
	}

	box, err := conf.FindBox("../../web/elm/public")
	distBox, err := conf.FindBox("../../web/elm/public/dist")

	if err != nil {
		logrus.Fatalf("error opening rice.Box: %s\n", err)
	}

	var l string
	if c.Request().URL.Path == "/" {

		l = "index.html"
		c.Response().Header().Set("Content-Type", "text/html")
	}
	p := c.Request().URL.Path[1:]

	//logrus.Info("Trying to load ", p)
	if strings.HasSuffix(p, "dist/elm.compiled.js") {
		l = filepath.Base(p)
		//		l = filepath.Base("dist/elm.compiled.js")
		c.Response().Header().Set("Content-Type", "text/javascript")
		contentString, err := distBox.String("elm.compiled.js")
		if err != nil {
			logrus.Error(err)
			return c.String(404, "not found")
		}
		return c.String(200, contentString)
	}

	if strings.HasSuffix(p, "main.js") {
		c.Response().Header().Set("Content-Type", "text/javascript")
		contentString, err := box.String(p)
		if err != nil {
			return c.String(404, "not found")
		}
		return c.String(200, contentString)
	}

	if strings.HasSuffix(p, ".css") {
		//l = filepath.Base(p)
		l = filepath.Base("style.css")
		c.Response().Header().Set("Content-Type", "text/css")
	}

	// catch all and redirect to top
	if l == "" {
		return c.Redirect(http.StatusMovedPermanently, "/")
	}

	logrus.Info("Trying to load ", l)

	contentString, err := box.String(l)
	if err != nil {
		logrus.Errorf("could not read file contents as string: %s\n", err)
		return c.String(404, "not found")
	}

	return c.String(200, contentString)

}
