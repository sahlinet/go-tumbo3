package routers

import (
	rice "github.com/GeertJohan/go.rice"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/swaggo/gin-swagger/swaggerFiles"

	_ "github.com/sahlinet/go-tumbo/docs"

	"github.com/sahlinet/go-tumbo/middleware/jwt"
	"github.com/sahlinet/go-tumbo/routers/api"
	v1 "github.com/sahlinet/go-tumbo/routers/api/v1"
)

func StaticFile(c *gin.Context) {
	conf := rice.Config{
		LocateOrder: []rice.LocateMethod{rice.LocateEmbedded, rice.LocateAppended, rice.LocateFS},
	}

	box, err := conf.FindBox("../web")

	if err != nil {
		log.Fatalf("error opening rice.Box: %s\n", err)
	}

	contentString, err := box.String("index.html")
	if err != nil {
		log.Fatalf("could not read file contents as string: %s\n", err)
	}

	c.Writer.Header().Set("Content-Type", "text/html")
	c.String(200, contentString)

	//appG := app.Gin{C: c}
	//appG.Response(http.StatusOK, e.ERROR_AUTH_TOKEN, nil)
}

// InitRouter initialize routing information
func InitRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	//r.Use(static.Serve("/index.html", static.LocalFile("./static", true)))

	r.POST("/auth", api.GetAuth)
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/index.html", StaticFile)

	apiv1 := r.Group("/api/v1")
	apiv1.Use(jwt.JWT())
	{
		//获取标签列表
		//获取文章列表
		apiv1.GET("/projects", v1.Getprojects)
		//获取指定文章
		apiv1.GET("/projects/:id", v1.GetProject)
		//新建文章
		apiv1.POST("/projects", v1.AddArticle)
		//更新指定文章
		apiv1.PUT("/projects/:id", v1.EditArticle)
		//删除指定文章
		apiv1.DELETE("/projects/:id", v1.DeleteArticle)
	}

	return r
}
