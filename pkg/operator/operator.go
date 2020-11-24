package operator

import (
	"time"

	"github.com/sahlinet/go-tumbo3/pkg/controllers"
	"github.com/sahlinet/go-tumbo3/pkg/models"

	log "github.com/sirupsen/logrus"
)

type Operator struct {
}

const (
	Running  = "Running"
	Stopped  = "Stopped"
	Errored  = "Errored"
	Starting = "Starting"
)

func (o *Operator) Run() {
	for {
		time.Sleep(2 * time.Second)
		log.Info("Run")
		projects, err := models.GetProjects()
		if err != nil {
			log.Error(err)
		}
		for _, project := range projects {
			p, err := models.GetProject(project.ID)
			if err != nil {
				log.Error()
			}
			log.Infof("Name: %s State: %s", p.Name, p.State)

			reconcile(p)
		}

	}
}

func reconcile(p *models.Project) {
	log.Info("Starting reconcile the state is", p.State)
	defer p.Update()

	if p.State == "Running" {
		r, err := controllers.GetRunner(p.Services[0])
		runnerModel := &models.Runner{}
		models.GetRunner(runnerModel, p.Services[0])
		if err != nil {
			controllers.DeleteRunnerForService(&p.Services[0])
			log.Error(err)
			p.State = "Errored"
			p.ErrorMsg = err.Error()
		}
		log.Debug(r)
		p.ErrorMsg = ""
		/*err = r.Close()
		if err != nil {
			log.Error(err)
		}*/
		return

	}

	if p.State != "Running" {
		log.Info("Must start", p)
		err := controllers.ChangeServiceState(int(p.ID), int(p.Services[0].ID), "Start")
		if err != nil {
			log.Error(err)
			p.State = "Errored"
			p.ErrorMsg = err.Error()
			return
		}

		p.State = "Running"
		p.ErrorMsg = ""
	}

	log.Info("Ending reconcile the state is", p.State)
}
