package api

import (
	"net/http"

	"github.com/astaxie/beego/validation"
	"github.com/gin-gonic/gin"

	"github.com/sahlinet/go-tumbo3/internal/app"
	"github.com/sahlinet/go-tumbo3/internal/e"
	"github.com/sahlinet/go-tumbo3/internal/service/auth_service"
	"github.com/sahlinet/go-tumbo3/internal/util"
)

type auth struct {
	Username string `valid:"Required; MaxSize(50)"`
	Password string `valid:"Required; MaxSize(50)"`
}

// @Summary Get Auth
// @Produce  json
// @Param username query string true "userName"
// @Param password query string true "password"
// @Success 200 {object} app.Response
// @Failure 500 {object} app.Response
// @Router /auth [get]
func GetAuth(c *gin.Context) {
	appG := app.Gin{C: c}
	valid := validation.Validation{}

	username := c.PostForm("username")
	password := c.PostForm("password")

	err, token, done := GetToken(username, password, valid, appG)
	if done {
		return
	}
	if err != nil {
		appG.Response(http.StatusInternalServerError, e.ERROR_AUTH_TOKEN, nil)
		return
	}

	appG.Response(http.StatusOK, e.SUCCESS, map[string]string{
		"token": token,
	})
}

func GetToken(username string, password string, valid validation.Validation, appg app.Gin) (error, string, bool) {
	a := auth{Username: username, Password: password}
	ok, _ := valid.Valid(&a)

	if !ok {
		app.MarkErrors(valid.Errors)
		appg.Response(http.StatusBadRequest, e.INVALID_PARAMS, nil)
		return nil, "", true
	}

	authService := auth_service.Auth{Username: username, Password: password}
	isExist, err := authService.Check()
	if err != nil {
		appg.Response(http.StatusInternalServerError, e.ERROR_AUTH_CHECK_TOKEN_FAIL, nil)
		return nil, "", true
	}

	if !isExist {
		appg.Response(http.StatusUnauthorized, e.ERROR_AUTH, nil)
		return nil, "", true
	}

	token, err := util.GenerateToken(username, password)
	return err, token, false
}
