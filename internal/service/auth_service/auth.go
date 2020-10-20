package auth_service

import "github.com/sahlinet/go-tumbo3/internal/pkg/models"

type Auth struct {
	Username string
	Password string
}

func (a *Auth) Check() (bool, error) {
	return models.CheckAuth(a.Username, a.Password)
}
