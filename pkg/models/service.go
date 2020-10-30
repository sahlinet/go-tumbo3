package models

type Service struct {
	Model
	Name string

	ProjectID uint
	Runner    *Runner
}

type Runner struct {
	Size     string
	Endpoint string

	ServiceID uint
}

func NewServiceForProject(p *Project, n string) (*Service, error) {
	s := &Service{
		Name:      n,
		ProjectID: p.ID,
	}
	//p.Services = append(p.Services, *s)
	if err := db.Debug().Create(&s).Error; err != nil {
		return s, err
	}

	return s, nil
}

func GetAllServicesForProject(services *[]Service, projectId uint) error {
	projectLoaded, err := GetProject(projectId)
	if err != nil {
		return nil
	}
	//err := db.Where("project_id = ?", projectId).Find(&services).Error
	//project := Project{}
	//project.ID = projectId
	err = db.Model(&projectLoaded).Association("Services").Find(&services)
	//err := db.Find(&services).Error
	if err != nil {
		return err
	}
	return nil
	/*if err := db.Find(services).Error; err != nil {
		return err
	}

	return nil
	*/
}
