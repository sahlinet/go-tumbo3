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
		ProjectID: uint(p.ID),
	}
	p.Service = s
	if err := db.Debug().Create(&s).Error; err != nil {
		return s, err
	}

	return p.Service, nil
}
