package app

import (
	"log"
	"os"
	"path"
	"path/filepath"

	"gorm.io/gorm"

	"github.com/sahlinet/go-tumbo3/pkg/models"
)

var (
	dir, _ = os.Getwd()
	fp     = filepath.Join(filepath.Dir(dir), "..")
)

func TestData(db *gorm.DB) {

	project := &models.Project{
		Name:        "the-project",
		Description: "a project to test",
		State:       0,
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

	db.FirstOrCreate(&project)
}
