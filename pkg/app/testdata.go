package app

import (
	"os"
	"path"
	"path/filepath"

	"gorm.io/gorm"

	log "github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/internal/util"
	"github.com/sahlinet/go-tumbo3/pkg/models"
)

//LoadTestData creates projects as example
func LoadTestData(db *gorm.DB) error {
	log.Print("Loading examples into database")
	return testData(db)
}

func localTestProject() *models.Project {
	d, err := lookupExamplesFolder()
	if err != nil {
		log.Error(err)
	}
	examplePath := path.Join(d, "example-plugin-go-grpc")

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
	return project
}

func gitTestProject() *models.Project {
	project := &models.Project{
		Name:        "the-project",
		Description: "a project to test",
		State:       "not started",
		GitRepository: &models.GitRepository{
			Url: "https://github.com/sahlinet/go-tumbo3.git//examples/example-plugin-go-grpc",
		},
		Services: []models.Service{{
			Name: "service-A",
		}},
	}
	return project
}

func lookupExamplesFolder() (string, error) {
	var d string
	e := filepath.Walk("../..", func(p string, info os.FileInfo, err error) error {
		if err == nil && info.Name() == "examples" {
			println(info.Name())
			d = path.Join("../..", info.Name())
		}
		return nil
	})
	if e != nil {
		log.Fatal(e)
	}
	return d, nil

}

func testData(db *gorm.DB) error {
	var project *models.Project

	if k8s := util.IsRunningInKubernetes(); k8s {
		project = gitTestProject()
	} else {
		project = localTestProject()
	}

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
