package routers

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	_ "github.com/sahlinet/go-tumbo3/docs"
	"github.com/sahlinet/go-tumbo3/pkg/controllers"
	"github.com/sahlinet/go-tumbo3/pkg/routers/api"
	v1 "github.com/sahlinet/go-tumbo3/pkg/routers/api/v1"
)

// InitRouter initialize routing information
func InitRouter() *echo.Echo {

	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		//AllowOrigins: []string{"https://labstack.com", "https://labstack.net"},
		AllowOrigins: []string{"*"},
		//AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	e.POST("/auth", api.GetAuth)
	//e.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	e.GET("/", controllers.StaticFile)
	e.GET("/style.css", controllers.StaticFile)
	e.GET("/main.js", controllers.StaticFile)
	e.GET("/dist/elm.compiled.js", controllers.StaticFile)
	e.GET("/version", controllers.Version)

	publicv1 := e.Group("/public/v1")
	publicv1.GET("/projects/:projectId", controllers.ServiceCaller)

	apiv1 := e.Group("/api/v1")
	apiv1.Use(middleware.JWT([]byte("secret")))
	{

		apiv1.GET("/projects", v1.Getprojects)
		apiv1.GET("/projects/:projectId", v1.GetProject)

		apiv1.PUT("/projects/:projectId/run", controllers.ProjectStateHandler)
		apiv1.DELETE("/projects/:projectId/run", controllers.ProjectStateHandler)

		apiv1.GET("/projects/:projectId/call", controllers.ServiceCaller)

		//		apiv1.GET("/projects/:projectId/services", controllers.GetServices)
		apiv1.POST("/projects", v1.CreateProject)

		//apiv1.PUT("/projects/:id", v1.EditProject)
		//apiv1.DELETE("/projects/:id", v1.DeleteProject)

	}

	e.GET("/*", controllers.StaticFile)
	//r.Use(gin.Recovery())

	return e
}
