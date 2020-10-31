//go:generate rice embed-go

package controllers

import (
	"path/filepath"
	"strings"

	rice "github.com/GeertJohan/go.rice"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func StaticFile(c *gin.Context) {
	conf := rice.Config{
		LocateOrder: []rice.LocateMethod{rice.LocateEmbedded, rice.LocateAppended, rice.LocateFS},
	}

	box, err := conf.FindBox("../../web/elm/public")

	if err != nil {
		logrus.Fatalf("error opening rice.Box: %s\n", err)
	}

	var l string
	if c.Request.URL.Path == "/" {

		l = "index.html"
		c.Writer.Header().Set("Content-Type", "text/html")
	}
	p := c.Request.URL.Path[1:]

	logrus.Info("Trying to load ", p)
	if strings.HasSuffix(p, "dist/elm.compiled.js") {
		l = filepath.Base(p)
		//		l = filepath.Base("dist/elm.compiled.js")
		c.Writer.Header().Set("Content-Type", "text/javascript")
		contentString, err := box.String("dist/elm.compiled.js")
		if err != nil {
			logrus.Error(err)
			c.String(404, "not found")
			return
		}
		c.String(200, contentString)
		return
	}

	if strings.HasSuffix(p, "main.js") {
		c.Writer.Header().Set("Content-Type", "text/javascript")
		contentString, err := box.String(p)
		if err != nil {
			c.String(404, "not found")
			return
		}
		c.String(200, contentString)
		return
	}

	if strings.HasSuffix(p, ".css") {
		//l = filepath.Base(p)
		l = filepath.Base("style.css")
		c.Writer.Header().Set("Content-Type", "text/css")
	}

	if l == "" {
		c.String(404, "not found")
		return
	}

	logrus.Info("Trying to load ", l)

	contentString, err := box.String(l)
	if err != nil {
		logrus.Errorf("could not read file contents as string: %s\n", err)
		c.String(404, "not found")
		return
	}

	c.String(200, contentString)

	//appG := app.Gin{C: c}
	//appG.Response(http.StatusOK, e.ERROR_AUTH_TOKEN, nil)
}
