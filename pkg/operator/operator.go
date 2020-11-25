package operator

import (
	"time"

	"github.com/sahlinet/go-tumbo3/pkg/controllers"
	"github.com/sahlinet/go-tumbo3/pkg/models"

	"github.com/sirupsen/logrus"
)

type Operator struct {
}

const (
	Running  = "Running"
	Stopped  = "Stopped"
	Errored  = "Errored"
	Starting = "Starting"
)

func (o *Operator) Run(log *logrus.Entry) {
	for {
		time.Sleep(2 * time.Second)
		projects, err := models.GetProjects()
		if err != nil {
			log.Error(err)
		}
		for _, project := range projects {
			p, err := models.GetProject(project.ID)
			if err != nil {
				log.Error()
			}
			//log.Infof("Name: %s State: %s", p.Name, p.State)

			reconcile(log, p)
		}

	}
}

func reconcile(log *logrus.Entry, p *models.Project) {
	log.Infof("Starting reconcile %s the state is %s", p.Name, p.State)
	defer p.Update()

	if p.State == "Running" {
		_, err := controllers.GetRunner(p.Services[0])
		if err != nil {
			runnerModel := &models.Runner{}
			models.GetRunner(runnerModel, p.Services[0])
			controllers.DeleteRunnerForService(&p.Services[0])
			p.State = "Errored"
			p.ErrorMsg = err.Error()
			log.Error(err)
		}
		//log.Debug(r)
		p.ErrorMsg = ""
		/*err = r.Close()
		if err != nil {
			log.Error(err)
		}
		*/
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
