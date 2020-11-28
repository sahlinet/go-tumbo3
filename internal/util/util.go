package util

import (
	"os"

	"github.com/sahlinet/go-tumbo3/internal/setting"
)

// Setup Initialize the util
func Setup() {
	jwtSecret = []byte(setting.AppSetting.JwtSecret)
}

// IsRunningInKubernetes checks if the application is running in a Kubernetes Container
func IsRunningInKubernetes() bool {
	_, present := os.LookupEnv("KUBERNETES_SERVICE_HOST")
	return present
}
