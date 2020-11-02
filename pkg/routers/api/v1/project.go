package v1

import (
	"fmt"
	"net/http"

	"github.com/astaxie/beego/validation"
	"github.com/labstack/echo"
	"github.com/unknwon/com"

	"github.com/sahlinet/go-tumbo3/internal/app"
	"github.com/sahlinet/go-tumbo3/internal/e"
	"github.com/sahlinet/go-tumbo3/internal/service/project_service"
)

func GetProject(c echo.Context) error {
	id := com.StrTo(c.Param("id")).MustInt()
	valid := validation.Validation{}
	valid.Min(id, 1, "id")

	if valid.HasErrors() {
		app.MarkErrors(valid.Errors)
		return c.String(http.StatusBadRequest, fmt.Sprint(e.INVALID_PARAMS))
	}

	projectservice := project_service.Project{ID: uint(id)}
	exists, err := projectservice.ExistByID()
	if err != nil {
		return c.String(http.StatusInternalServerError, fmt.Sprint(e.ERROR_CHECK_EXIST_ARTICLE_FAIL))
	}
	if !exists {
		return c.String(http.StatusOK, fmt.Sprint(e.ERROR_NOT_EXIST_PROJECT))
	}

	project, err := projectservice.Get()
	if err != nil {
		return c.String(http.StatusInternalServerError, fmt.Sprint(e.ERROR_GET_ARTICLE_FAIL))
	}

	return c.JSONPretty(http.StatusOK, project, " ")
}

func Getprojects(c echo.Context) error {
	valid := validation.Validation{}

	if valid.HasErrors() {
		app.MarkErrors(valid.Errors)
		return c.String(http.StatusBadRequest, fmt.Sprint(e.INVALID_PARAMS))
	}

	projectservice := project_service.Project{}

	projects, err := projectservice.GetAll()
	if err != nil {
		return c.String(http.StatusInternalServerError, fmt.Sprint(e.ERROR_GET_PROJECTS_FAIL))
	}

	return c.JSONPretty(http.StatusOK, projects, " ")
}
