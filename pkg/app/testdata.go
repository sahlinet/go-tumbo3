package app

import (
	"os"
	"path"
	"path/filepath"

	"gorm.io/gorm"

	"github.com/sahlinet/go-tumbo3/pkg/models"
	log "github.com/sirupsen/logrus"
)

func LoadTestData(db *gorm.DB) error {
	log.Print("Loading examples into database")
	return testData(db)
}

func testData(db *gorm.DB) error {
	mod := os.Getenv("GOMOD")
	examplePath := path.Join(filepath.Dir(mod), "../../examples/example-plugin-go-grpc")

	project := &models.Project{
		Name:        "the-project",
		Description: "a project to test",
		State:       "not started",
		GitRepository: &models.GitRepository{
			Url: examplePath,
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
