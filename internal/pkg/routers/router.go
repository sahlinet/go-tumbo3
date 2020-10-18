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

	_ "github.com/sahlinet/go-tumbo/docs"
	"github.com/sahlinet/go-tumbo/pkg/version"

	"github.com/sahlinet/go-tumbo/internal/middleware/jwt"
	"github.com/sahlinet/go-tumbo/internal/pkg/routers/api"
	v1 "github.com/sahlinet/go-tumbo/internal/pkg/routers/api/v1"
)

func StaticFile(c *gin.Context) {
	conf := rice.Config{
		LocateOrder: []rice.LocateMethod{rice.LocateEmbedded, rice.LocateAppended, rice.LocateFS},
	}

	box, err := conf.FindBox("../../../web/static")

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
	if strings.HasPrefix(p, "static") {
		//l = filepath.Base(p)
		l = filepath.Base("app.js")
		c.Writer.Header().Set("Content-Type", "text/javascript")
	}

	if l == "" {
		c.String(404, "not found")
	}

	log.Info("Trying to load ", l)

	contentString, err := box.String(l)
	if err != nil {
		log.Fatalf("could not read file contents as string: %s\n", err)
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
	r := gin.New()
	r.Use(gin.Logger())

	//r.Use(static.Serve("/index.html", static.LocalFile("./static", true)))

	r.POST("/auth", api.GetAuth)
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/", StaticFile)
	r.GET("/static/*js", StaticFile)
	r.GET("/version", Version)

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

	r.Use(gin.Recovery())

	return r
}
