package models

type Service struct {
	Model
	Name string

	ProjectID uint
	Runners   []Runner
}

type Runner struct {
	Model
	//ModelNonId

	//Size     string
	Endpoint string `json:"endpoint"`
	Pid      int

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

func GetService(service *Service, projectId, serviceId uint) error {
	err := db.Where("project_id = ? AND id = ?", projectId, serviceId).Find(&service).Error
	if err != nil {
		return err
	}
	return nil
}

func CreateRunner(r *Runner, service Service) error {
	//err := db.Create(r).Error
	err := db.Model(&service).Association("Runners").Append(r)
	if err != nil {
		return err
	}
	return nil
}

func GetRunner(runner *Runner, service Service) error {
	err := db.Where("service_id = ?", service.ID).Find(&runner).Error
	if err != nil {
		return err
	}
	return nil
}
