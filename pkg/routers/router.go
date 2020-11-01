package routers

import (
	"github.com/gin-gonic/gin"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/swaggo/gin-swagger/swaggerFiles"

	_ "github.com/sahlinet/go-tumbo3/docs"
	"github.com/sahlinet/go-tumbo3/internal/middleware/jwt"
	"github.com/sahlinet/go-tumbo3/pkg/controllers"
	"github.com/sahlinet/go-tumbo3/pkg/routers/api"
	v1 "github.com/sahlinet/go-tumbo3/pkg/routers/api/v1"
)

// InitRouter initialize routing information
func InitRouter() *gin.Engine {

	r := gin.New()
	r.Use(gin.Logger())

	r.POST("/auth", api.GetAuth)
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/", controllers.StaticFile)
	r.GET("/style.css", controllers.StaticFile)
	r.GET("/main.js", controllers.StaticFile)
	r.GET("/dist/elm.compiled.js", controllers.StaticFile)
	r.GET("/version", controllers.Version)

	apiv1 := r.Group("/api/v1")
	apiv1.Use(jwt.JWT())
	{

		apiv1.GET("/projects/:projectId", v1.GetProject)
		apiv1.GET("/projects/:projectId/services/*serviceId", CustomRouter)
		apiv1.PUT("/projects/:projectId/services/:serviceId/run", controllers.ServiceState)
		apiv1.DELETE("/projects/:projectId/services/:serviceId/run", controllers.ServiceState)
		apiv1.GET("/projects", v1.Getprojects)

		//		apiv1.GET("/projects/:projectId/services", controllers.GetServices)
		apiv1.POST("/projects", v1.AddProject)

		//apiv1.PUT("/projects/:id", v1.EditProject)
		//apiv1.DELETE("/projects/:id", v1.DeleteProject)

	}

	r.Use(gin.Recovery())

	return r
}
