package models

import (
	"gorm.io/gorm"
)

type Project struct {
	Model

	Name        string `json:"name"`
	Description string `json:"description"`
	CreatedBy   string `json:"created_by"`
	ModifiedBy  string `json:"modified_by"`
	State       int    `json:"state"`

	GitRepository *GitRepository
	Services      []Service
}

type GitRepository struct {
	Model

	Url       string `gorm:"column:url"`
	ProjectID uint
}

func (GitRepository) TableName() string {
	return "git_repositories"
}

// ExistProjectByID checks if an project exists based on ID
func ExistProjectByID(id uint) (bool, error) {
	var project Project
	err := db.Select("id").Where("id = ? AND deleted_on = ? ", id, 0).First(&project).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return false, err
	}

	if project.ID > 0 {
		return true, nil
	}

	return false, nil
}

/*
// GetProjectTotal gets the total number of projects based on the constraints
func GetProjectTotal() (int64, error) {
	var count int64
	if err := db.Model(&Project{}).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}
*/

// GetProjects gets a list of projects based on paging constraints
func GetProjects() ([]*Project, error) {
	var projects []*Project
	//err := db.Offset(pageNum).Limit(pageSize).Find(&projects).Error
	err := db.Find(&projects).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	return projects, nil
}

// GetProject Get a single project based on ID
func GetProject(id uint) (*Project, error) {
	var project Project
	err := db.Preload("GitRepository").Preload("Services").Where("id = ?", id).First(&project).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	//	err = db.Model(&article).Related(&article.Tag).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	return &project, nil
}

// EditProject modify a single article
func EditProject(id uint, data interface{}) error {
	if err := db.Model(&Project{}).Where("id = ? AND deleted_on = ? ", id, 0).Updates(data).Error; err != nil {
		return err
	}

	return nil
}

// AddProject add a single article
func AddProject(data map[string]interface{}) error {
	project := Project{
		Name:        data["name"].(string),
		Description: data["description"].(string),
		//CreatedBy:   data["created_by"].(string),
		State: data["state"].(int),
	}
	if err := db.Debug().Create(&project).Error; err != nil {
		return err
	}

	return nil
}

// Update a single project
func (project *Project) Update() error {

	if err := db.Session(&gorm.Session{FullSaveAssociations: true}).Debug().Model(&Project{}).Where("id = ? AND deleted_on = ? ", project.ID, 0).Updates(project).Error; err != nil {
		return err
	}

	return nil
}

// Deleteproject delete a single article
func DeleteProject(id uint) error {
	if err := db.Where("id = ?", id).Delete(Project{}).Error; err != nil {
		return err
	}

	return nil
}

// CleanAllproject clear all article
/*
func CleanAllArticle() error {
	if err := db.Unscoped().Where("deleted_on != ? ", 0).Delete(&Project{}).Error; err != nil {
		return err
	}

	return nil
}
*/
