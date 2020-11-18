package app

import (
	"log"

	"gorm.io/gorm"

	"github.com/sahlinet/go-tumbo3/pkg/models"
)

func TestData(db *gorm.DB) {

	project := &models.Project{
		Name:        "the-project",
		Description: "a project to test",
		State:       0,
		GitRepository: &models.GitRepository{
			Url: "/Users/philipsahli/workspace/go-tumbo3/examples/example-plugin-go-grpc",
		},
		Services: []models.Service{{
			Name: "service-A",
		}},
	}

	err := db.Model(&project).Association("GitRepository").Error
	if err != nil {
		log.Fatal(err)
	}

	err = db.Model(&project).Association("Services").Error
	if err != nil {
		log.Fatal(err)
	}

	db.FirstOrCreate(&project)
}
