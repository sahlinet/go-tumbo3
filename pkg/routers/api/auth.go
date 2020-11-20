package api

import (
	"errors"
	"net/http"
	"time"

	"github.com/astaxie/beego/validation"
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"

	"github.com/sahlinet/go-tumbo3/internal/service/auth_service"
)

type auth struct {
	Username string `valid:"Required; MaxSize(50)"`
	Password string `valid:"Required; MaxSize(50)"`
}

func GetAuth(c echo.Context) error {
	valid := validation.Validation{}

	username := c.FormValue("username")
	password := c.FormValue("password")

	// TODO: Set in debug mode only.
	c.Response().Header().Set("Access-Control-Allow-Origin", "*")

	token, err := GetToken(username, password, valid, c)
	if err != nil {
		return c.NoContent(http.StatusUnauthorized)
	}

	// TODO: Take dynamic values
	return c.JSON(http.StatusOK, map[string]interface{}{
		"user": map[string]string{
			"token":    token,
			"email":    "philip@sahli.net",
			"username": username,
		},
	})
}

func GetToken(username string, password string, valid validation.Validation, c echo.Context) (string, error) {
	authService := auth_service.Auth{Username: username, Password: password}
	isExist, err := authService.Check()

	if err != nil {
		return "", errors.New("authService.check error")
	}

	if !isExist {
		return "", errors.New("authService.check not successfull")
	}

	// Create token
	token := jwt.New(jwt.SigningMethodHS256)

	// Set claims
	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = username
	claims["admin"] = false
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return "", errors.New("error generating jwt token")
	}

	return t, nil
}
