package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func init() {
	InitTestDB()
}

func TestModelProject(t *testing.T) {
	repo := GitRepository{
		Url: "https://github.com/sahlinet/go-tumbo-examples",
	}

	defer DestroyTestDB()

	project := Project{
		Title: "my-project",
		Desc:  "my-project",

		GitRepository: &repo,
	}

	err := db.Model(&project).Association("GitRepository").Error
	assert.Nil(t, err)

	err = db.Model(&project).Association("Service").Error
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

	// Query Service
	projectLoaded, err = GetProject(1)
	if projectLoaded.Service == nil {
		t.Fatal("Service expected")
	}
	assert.Equal(t, "service-name", projectLoaded.Service.Name)

}
