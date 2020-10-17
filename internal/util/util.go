package util

import "github.com/sahlinet/go-tumbo/internal/setting"

// Setup Initialize the util
func Setup() {
	jwtSecret = []byte(setting.AppSetting.JwtSecret)
}
