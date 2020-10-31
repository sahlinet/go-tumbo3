package project_service

import (
	"github.com/sahlinet/go-tumbo3/pkg/models"
)

type Project struct {
	ID uint

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

	project, err := models.GetProject(a.ID)
	if err != nil {
		return nil, err
	}

	return project, nil
}

func (a *Project) GetAll() ([]*models.Project, error) {
	projects, err := models.GetProjects()
	if err != nil {
		return nil, err
	}

	return projects, nil
}

func (a *Project) Delete() error {
	return models.DeleteProject(a.ID)
}

func (a *Project) ExistByID() (bool, error) {
	return models.ExistProjectByID(a.ID)
}

/*func (a *Project) Count() (int64, error) {
	return models.GetProjectTotal()
}
*/
