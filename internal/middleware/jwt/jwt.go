package jwt

import (
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"

	"github.com/sahlinet/go-tumbo3/internal/e"
	"github.com/sahlinet/go-tumbo3/internal/util"
)

// JWT is jwt middleware
func JWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		var code int
		var data interface{}

		code = e.SUCCESS

		// Get token from query string
		token := c.Query("token")

		// Get token from Authorization Header
		reqToken := c.Request.Header.Get("Authorization")

		// We got no token
		if token == "" && reqToken == "" {
			code = e.INVALID_PARAMS
		}

		// From header arrived, get the token part
		if reqToken != "" {
			splitToken := strings.Split(reqToken, "Bearer ")
			token = splitToken[1]
		}

		_, err := util.ParseToken(token)
		if err != nil {
			switch err.(*jwt.ValidationError).Errors {
			case jwt.ValidationErrorExpired:
				code = e.ERROR_AUTH_CHECK_TOKEN_TIMEOUT
			default:
				code = e.ERROR_AUTH_CHECK_TOKEN_FAIL
			}
		}

		if code != e.SUCCESS {
			c.JSON(http.StatusUnauthorized, gin.H{
				"code": code,
				"msg":  e.GetMsg(code),
				"data": data,
			})

			c.Abort()
			return
		}

		c.Next()
	}
}
