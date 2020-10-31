package routers

import (
	"github.com/gin-gonic/gin"

	"github.com/sahlinet/go-tumbo3/pkg/controllers"
)

func CustomRouter(c *gin.Context) {
	if c.Params.ByName("projectId") != "" {

		// /projects/:projectId/services/*serviceI
		if c.Params.ByName("serviceId") != "" {
			controllers.GetService(c)
			return
		}

		// /projects/:projectId/services

		controllers.GetServices(c)
		return

	}

}
