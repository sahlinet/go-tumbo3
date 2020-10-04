package routers

import (
	"github.com/gin-gonic/gin"

	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/swaggo/gin-swagger/swaggerFiles"

	_ "github.com/sahlinet/go-tumbo/docs"

	"github.com/sahlinet/go-tumbo/middleware/jwt"
	"github.com/sahlinet/go-tumbo/routers/api"
	v1 "github.com/sahlinet/go-tumbo/routers/api/v1"
)

// InitRouter initialize routing information
func InitRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.POST("/auth", api.GetAuth)
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

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
