package app

import (
	"os"
	"path"
	"path/filepath"
	"strings"

	"gorm.io/gorm"

	log "github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/internal/util"
	"github.com/sahlinet/go-tumbo3/pkg/models"
)

//LoadTestData creates projects as example
func LoadTestData(db *gorm.DB) error {
	log.Print("Loading examples into database")
	log.Print(os.Getwd())
	return testData(db)
}

func localTestProjects() []*models.Project {
	d, err := lookupExamplesFolder()
	if err != nil {
		log.Error(err)
	}
	examplePath := path.Join(d, "example-plugin-go-grpc")

	projects := make([]*models.Project, 0)

	projects = append(projects, &models.Project{
		/* 		Model: models.Model{
			ID: 0,
		} ,*/
		Name:        "the-project",
		Description: "a project to test",
		State:       "not started",
		GitRepository: &models.GitRepository{
			Url: examplePath,
		},
	})

	/*	examplePath = path.Join(d, "example-plugin-go-grpc-fail")

		projects = append(projects, &models.Project{
			Name:        "failing application",
			Description: "an application that fails",
			State:       "not started",
			GitRepository: &models.GitRepository{
				Url: examplePath,
			},
		})*/
	return projects
}

func gitTestProjects() []*models.Project {
	projects := make([]*models.Project, 0)

	projects = append(projects, &models.Project{
		Name:        "the-project",
		Description: "a project to test",
		State:       "not started",
		GitRepository: &models.GitRepository{
			Url: "https://github.com/sahlinet/go-tumbo3.git//examples/example-plugin-go-grpc",
		},
	})
	return projects

}

func lookupExamplesFolder() (string, error) {
	var d string
	w := "../.."

	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	// In case of
	log.Info("current working directory: ", cwd)
	if strings.HasSuffix(cwd, "go-tumbo3") {
		w = "."
		log.Info("Set walk to .")
	}

	e := filepath.Walk(w, func(p string, info os.FileInfo, err error) error {
		if err == nil && info.Name() == "examples" {
			println(info.Name())
			d = path.Join(w, info.Name())
		}
		return nil
	})
	if e != nil {
		log.Fatal(e)
	}
	return d, nil

}

func testData(db *gorm.DB) error {
	var projects []*models.Project

	if k8s := util.IsRunningInKubernetes(); k8s {
		projects = gitTestProjects()
	} else {
		projects = localTestProjects()
	}

	for _, project := range projects {

		log.Infof("load testdata: %s", project.Name)

		_, err := project.CreateOrUpdate()
		if err != nil {
			return err
		}

	}

	return nil
}
