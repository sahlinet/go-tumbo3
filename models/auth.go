package models

import "github.com/jinzhu/gorm"

type Auth struct {
	Model

	Username string `json:"username"`
	Password string `json:"password"`
}

// CheckAuth checks if authentication information exists
func CheckAuth(username, password string) (bool, error) {
	var auth Auth
	err := db.Select("id").Where(Auth{Username: username, Password: password}).First(&auth).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return false, err
	}

	if auth.ID > 0 {
		return true, nil
	}

	return false, nil
}

func (a *Auth) Exists() (bool, error) {
	err := db.Select("id").Where("id = ? AND deleted_on = ? ", a.ID, 0).First(&a).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return false, err
	}

	return true, nil
}

func (a *Auth) Create() error {
	if err := db.Create(&a).Error; err != nil {
		return err
	}
	return nil
}
