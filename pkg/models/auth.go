package models

import "gorm.io/gorm"

type Auth struct {
	ID       int    `gorm:"primary_key" json:"id"`
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

func CreateUser(db *gorm.DB) error {
	user := Auth{
		ID:       0,
		Username: "user1",
		Password: "password",
	}

	tx := db.Create(&user)
	if tx.Error != nil {
		return tx.Error
	}

	//log.Info(tx.Row())

	return nil
}
