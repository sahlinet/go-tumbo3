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
	Building = "Building"
	Running  = "Running"
	Stopped  = "Stopped"
	Errored  = "Errored"
	Starting = "Starting"
	Backoff  = "Backoff"

	Retries = 5
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

	if p.State == Backoff {
		log.Info("Ignore because the state is ", Backoff)
		return
	}

	if p.State == Running {
		_, err := controllers.GetRunner(*p)
		if err != nil {
			runnerModel := &models.Runner{}
			models.GetRunner(runnerModel, *p)
			controllers.DeleteRunnerForService(p)
			p.State = Errored
			p.ErrorMsg = err.Error()
			log.Error(err)
		}

		p.ErrorMsg = ""

		return

	}

	if p.State != Running {
		// TODO: reset Backoff when code is changed
		if p.BuildRetries == Retries {
			p.State = Backoff
			return
		}
		log.Info("Must start", p)
		p.UpdateStateInDB(Building)
		err := controllers.ProjectServiceState(int(p.ID), "Start")
		if err != nil {
			log.Error(err)
			p.State = Errored
			p.ErrorMsg = err.Error()
			p.BuildRetries = p.BuildRetries + 1
			return
		}

		p.State = Running
		p.ErrorMsg = ""
	}

	log.Info("Ending reconcile the state is", p.State)
}
