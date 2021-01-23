package models

import (
	"testing"

	log "github.com/sirupsen/logrus"
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

	// Create Runner for for project
	runner := Runner{
		Endpoint: "the-endpoint",
		Pid:      111,
	}
	log.Debug(runner)

	err = CreateRunner(&runner, project)
	assert.Nil(t, err)

	// Lock project for other read

}
