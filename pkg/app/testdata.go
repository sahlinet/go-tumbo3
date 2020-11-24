package app

import (
	"log"
	"os"
	"path"

	"gorm.io/gorm"

	"github.com/sahlinet/go-tumbo3/pkg/models"
)

var (
	dir, _ = os.Getwd()
	fp     = "/Users/philipsahli/workspace/go-tumbo3"
)

func TestData(db *gorm.DB) error {

	project := &models.Project{
		Name:        "the-project",
		Description: "a project to test",
		State:       "not started",
		GitRepository: &models.GitRepository{
			Url: path.Join(fp, "examples/example-plugin-go-grpc"),
		},
		Services: []models.Service{{
			Name: "service-A",
		}},
	}

	log.Print(project)

	err := db.Model(&project).Association("GitRepository").Error
	if err != nil {
		log.Fatal(err)
	}

	err = db.Model(&project).Association("Services").Error
	if err != nil {
		log.Fatal(err)
	}

	if err := db.FirstOrCreate(&project).Error; err != nil {
		// return any error will rollback
		return err
	}

	return nil
}
