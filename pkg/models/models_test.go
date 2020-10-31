package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func init() {
	InitTestDB("model-project")
}

func TestModelProject(t *testing.T) {
	repo := GitRepository{
		Url: "https://github.com/sahlinet/go-tumbo-examples",
	}

	defer DestroyTestDB("model-project")

	project := Project{
		Name:        "my-project",
		Description: "my-project",

		GitRepository: &repo,
	}

	err := db.Model(&project).Association("GitRepository").Error
	assert.Nil(t, err)

	err = db.Model(&project).Association("Services").Error
	assert.Nil(t, err)

	if err := db.Create(&project).Error; err != nil {
		t.Error(err)
	}

	// Test GetProject
	projectLoaded, err := GetProject(1)

	assert.Nil(t, err)
	assert.Equal(t, repo.Url, projectLoaded.GitRepository.Url)

	// Change Repository
	repo.Url = "new-url"

	db.Save(&project.GitRepository)
	projectLoaded, err = GetProject(1)

	assert.Equal(t, "new-url", projectLoaded.GitRepository.Url)

	// Create Service
	service, err := NewServiceForProject(projectLoaded, "service-name")
	assert.Nil(t, err)
	t.Log(service)

	// Query Service over project
	projectLoaded, err = GetProject(1)
	if len(projectLoaded.Services) < 1 {
		t.Fatal("Service expected")
	}

	assert.Equal(t, "service-name", projectLoaded.Services[0].Name)

	// Query Service by projectId
	services := make([]Service, 0)
	err = GetAllServicesForProject(&services, projectLoaded.ID)
	assert.Nil(t, err)
	assert.Len(t, services, 1)

}
