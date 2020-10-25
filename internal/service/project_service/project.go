package project_service

import (
	"encoding/json"

	log "github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/internal/gredis"
	"github.com/sahlinet/go-tumbo3/internal/pkg/models"
	"github.com/sahlinet/go-tumbo3/internal/service/cache_service"
)

type Project struct {
	ID int

	Title      string
	Desc       string
	Content    string
	CreatedBy  string
	ModifiedBy string

	PageNum  int
	PageSize int
}

func (a *Project) Add() error {
	project := map[string]interface{}{
		"title":      a.Title,
		"desc":       a.Desc,
		"content":    a.Content,
		"created_by": a.CreatedBy,
	}

	if err := models.AddProject(project); err != nil {
		return err
	}

	return nil
}

func (a *Project) Edit() error {
	return models.EditProject(a.ID, map[string]interface{}{
		"title":       a.Title,
		"desc":        a.Desc,
		"content":     a.Content,
		"modified_by": a.ModifiedBy,
	})
}

func (a *Project) Get() (*models.Project, error) {
	var project *models.Project

	cache := cache_service.Project{ID: a.ID}
	key := cache.GetProjectKey()
	if gredis.Exists(key) {
		data, err := gredis.Get(key)
		if err != nil {
			log.Info(err)
		} else {
			json.Unmarshal(data, &project)
			return project, nil
		}
	}

	article, err := models.GetProject(a.ID)
	if err != nil {
		return nil, err
	}

	gredis.Set(key, article, 3600)
	return article, nil
}

func (a *Project) GetAll() ([]*models.Project, error) {
	var (
		projects, cacheprojects []*models.Project
	)

	cache := cache_service.Project{
		PageNum:  a.PageNum,
		PageSize: a.PageSize,
	}
	key := cache.GetProjectsKey()
	if gredis.Exists(key) {
		data, err := gredis.Get(key)
		if err != nil {
			log.Info(err)
		} else {
			json.Unmarshal(data, &cacheprojects)
			return cacheprojects, nil
		}
	}

	projects, err := models.GetProjects(a.PageNum, a.PageSize)
	if err != nil {
		return nil, err
	}

	gredis.Set(key, projects, 3600)
	return projects, nil
}

func (a *Project) Delete() error {
	return models.DeleteProject(a.ID)
}

func (a *Project) ExistByID() (bool, error) {
	return models.ExistProjectByID(a.ID)
}

func (a *Project) Count() (int64, error) {
	return models.GetProjectTotal()
}
