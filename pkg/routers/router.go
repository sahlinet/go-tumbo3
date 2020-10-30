//go:generate rice embed-go

package routers

import (
	"path/filepath"
	"strings"

	rice "github.com/GeertJohan/go.rice"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/swaggo/gin-swagger/swaggerFiles"

	_ "github.com/sahlinet/go-tumbo3/docs"
	"github.com/sahlinet/go-tumbo3/pkg/controllers"
	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/version"

	"github.com/sahlinet/go-tumbo3/internal/middleware/jwt"
	"github.com/sahlinet/go-tumbo3/pkg/routers/api"
	v1 "github.com/sahlinet/go-tumbo3/pkg/routers/api/v1"
)

func StaticFile(c *gin.Context) {
	conf := rice.Config{
		LocateOrder: []rice.LocateMethod{rice.LocateEmbedded, rice.LocateAppended, rice.LocateFS},
	}

	box, err := conf.FindBox("../../web/elm/public")

	if err != nil {
		log.Fatalf("error opening rice.Box: %s\n", err)
	}

	var l string
	if c.Request.URL.Path == "/" {

		l = "index.html"
		c.Writer.Header().Set("Content-Type", "text/html")
	}
	p := c.Request.URL.Path[1:]

	log.Info("Trying to load ", p)
	if strings.HasSuffix(p, "dist/elm.compiled.js") {
		l = filepath.Base(p)
		//		l = filepath.Base("dist/elm.compiled.js")
		c.Writer.Header().Set("Content-Type", "text/javascript")
		contentString, err := box.String("dist/elm.compiled.js")
		if err != nil {
			log.Error(err)
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

	log.Info("Trying to load ", l)

	contentString, err := box.String(l)
	if err != nil {
		log.Errorf("could not read file contents as string: %s\n", err)
		c.String(404, "not found")
		return
	}

	c.String(200, contentString)

	//appG := app.Gin{C: c}
	//appG.Response(http.StatusOK, e.ERROR_AUTH_TOKEN, nil)
}

func Version(c *gin.Context) {
	c.String(200, version.BuildVersion)

}

// InitRouter initialize routing information
func InitRouter() *gin.Engine {

	serviceController := controllers.ServiceController{
		Services: models.Service{}, //DI your stuff here
	}

	r := gin.New()
	r.Use(gin.Logger())

	r.POST("/auth", api.GetAuth)
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/", StaticFile)
	r.GET("/style.css", StaticFile)
	r.GET("/main.js", StaticFile)
	r.GET("/dist/elm.compiled.js", StaticFile)
	r.GET("/version", Version)

	apiv1 := r.Group("/api/v1")
	apiv1.Use(jwt.JWT())
	{
		apiv1.GET("/projects", v1.Getprojects)
		apiv1.GET("/projects/:id", v1.GetProject)
		apiv1.GET("/projects/:id/services", serviceController.GetServices)
		//apiv1.GET("/projects/:id/services/:id", v1.GetService)
		apiv1.POST("/projects", v1.AddProject)
		apiv1.PUT("/projects/:id", v1.EditProject)
		apiv1.DELETE("/projects/:id", v1.DeleteProject)
	}

	r.Use(gin.Recovery())

	return r
}
