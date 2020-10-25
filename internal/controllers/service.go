package controllers

import (
	"net/http"

	"github.com/astaxie/beego/validation"
	"github.com/gin-gonic/gin"
	"github.com/unknwon/com"

	"github.com/sahlinet/go-tumbo3/internal/app"
	"github.com/sahlinet/go-tumbo3/internal/e"
	"github.com/sahlinet/go-tumbo3/internal/pkg/models"
	"github.com/sahlinet/go-tumbo3/internal/service/project_service"
)

type ServiceController struct {
	Services models.Service
}

func (sc *ServiceController) GetServices(c *gin.Context) {

	appG := app.Gin{C: c}
	id := com.StrTo(c.Param("id")).MustInt()
	valid := validation.Validation{}
	valid.Min(id, 1, "id")

	if valid.HasErrors() {
		app.MarkErrors(valid.Errors)
		appG.Response(http.StatusBadRequest, e.INVALID_PARAMS, nil)
		return
	}

	projectservice := project_service.Project{ID: id}
	exists, err := projectservice.ExistByID()
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_CHECK_EXIST_ARTICLE_FAIL, nil)
		return
	}
	if !exists {
		appG.Response(http.StatusOK, e.ERROR_NOT_EXIST_PROJECT, nil)
		return
	}

	project, err := projectservice.Get()
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_GET_ARTICLE_FAIL, nil)
		return
	}

	appG.Response(http.StatusOK, e.SUCCESS, project)
}
