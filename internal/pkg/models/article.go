package models

import (
	"github.com/jinzhu/gorm"
)

type Project struct {
	Model

	TagID int `json:"tag_id" gorm:"index"`

	Title         string `json:"title"`
	Desc          string `json:"desc"`
	Content       string `json:"content"`
	CoverImageUrl string `json:"cover_image_url"`
	CreatedBy     string `json:"created_by"`
	ModifiedBy    string `json:"modified_by"`
	State         int    `json:"state"`
}

// ExistArticleByID checks if an project exists based on ID
func ExistArticleByID(id int) (bool, error) {
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

// GetArticleTotal gets the total number of projects based on the constraints
func GetArticleTotal(maps interface{}) (int64, error) {
	var count int64
	if err := db.Model(&Project{}).Where(maps).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

// GetProjects gets a list of projects based on paging constraints
func GetProjects(pageNum int, pageSize int, maps interface{}) ([]*Project, error) {
	var projects []*Project
	err := db.Preload("Tag").Where(maps).Offset(pageNum).Limit(pageSize).Find(&projects).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	return projects, nil
}

// GetProject Get a single project based on ID
func GetProject(id int) (*Project, error) {
	var project Project
	err := db.Where("id = ? AND deleted_on = ? ", id, 0).First(&project).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	//	err = db.Model(&article).Related(&article.Tag).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	return &project, nil
}

// Editproject modify a single article
func EditArticle(id int, data interface{}) error {
	if err := db.Model(&Project{}).Where("id = ? AND deleted_on = ? ", id, 0).Updates(data).Error; err != nil {
		return err
	}

	return nil
}

// Addproject add a single article
func AddArticle(data map[string]interface{}) error {
	project := Project{
		TagID:         data["tag_id"].(int),
		Title:         data["title"].(string),
		Desc:          data["desc"].(string),
		Content:       data["content"].(string),
		CreatedBy:     data["created_by"].(string),
		State:         data["state"].(int),
		CoverImageUrl: data["cover_image_url"].(string),
	}
	if err := db.Create(&project).Error; err != nil {
		return err
	}

	return nil
}

// Deleteproject delete a single article
func DeleteArticle(id int) error {
	if err := db.Where("id = ?", id).Delete(Project{}).Error; err != nil {
		return err
	}

	return nil
}

// CleanAllproject clear all article
func CleanAllArticle() error {
	if err := db.Unscoped().Where("deleted_on != ? ", 0).Delete(&Project{}).Error; err != nil {
		return err
	}

	return nil
}
