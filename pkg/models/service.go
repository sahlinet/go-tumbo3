package models

type Runner struct {
	Model
	//ModelNonId

	//Size     string
	Endpoint string `json:"endpoint"`
	Pid      int

	ProjectID uint
}

func GetRepositoryForProject(repo *GitRepository, projectId uint) error {
	err := db.Where("project_id = ?", projectId).Find(&repo).Error
	if err != nil {
		return err
	}
	return nil
}

func CreateRunner(r *Runner, project Project) error {
	//err := db.Create(r).Error
	err := db.Model(&project).Association("Runner").Append(r)
	if err != nil {
		return err
	}
	return nil
}

func GetRunner(runner *Runner, project Project) error {
	err := db.Where("project_id = ?", project.ID).Find(&runner).Error
	if err != nil {
		return err
	}
	return nil
}

func DeleteRunner(id uint) error {
	if err := db.Where("id = ?", id).Delete(Runner{}).Error; err != nil {
		return err
	}
	return nil
}
