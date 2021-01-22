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
				log.Error(err)
			}
			/*p, tx, err := models.GetProjectForShareOrUpdate(project.ID, "UPDATE")
			if err != nil {
				log.Error()
				tx.Rollback()
			}
			tx.Commit()
			*/
			logProject := log.WithField("project", project.Name)
			logProject.Infof("Name: %s State: %s", p.Name, p.State)

			//reconcile(logProject, p, tx)
			reconcile(logProject, p)
		}

	}
}

/*
func (o *Operator) Run(log *logrus.Entry) {
	for {
		time.Sleep(5 * time.Second)
		projects, err := models.GetProjects()
		if err != nil {
			log.Error(err)
		}
		for _, project := range projects {
			p, err := models.GetProject(project.ID)
			if err != nil {
				log.Error()
			}
			logProject := log.WithField("project", project.Name)
			logProject.Infof("Name: %s State: %s", p.Name, p.State)

			reconcile(logProject, p)
		}

	}
}
*/

//func reconcile(log *logrus.Entry, p *models.Project, tx *gorm.DB) {
func reconcile(log *logrus.Entry, p *models.Project) {
	log.Infof("Starting reconcile %s the state is %s", p.Name, p.State)

	// Get and Lock
	p, tx, err := models.GetProjectForShareOrUpdate(p.ID, "SHARE")
	if err != nil {
		log.Error(err)
	}
	//time.Sleep(10 * time.Second)
	defer tx.Commit()
	if p.State == Backoff {
		log.Info("Ignore because the state is ", Backoff)
		return
	}

	if p.State == Stopped {
		log.Info("Ignore stopped")
		return
	}

	if p.State == Running {
		log.Info("State is running")
		_, err := controllers.GetRunner(*p)
		if err != nil {
			runnerModel := &models.Runner{}
			models.GetRunner(runnerModel, *p)
			controllers.DeleteRunnerForService(p)
			p.State = Errored
			p.ErrorMsg = err.Error()
			log.Error(err)
			p.Update(tx)
			return
		}

		p.ErrorMsg = ""

		project, err := controllers.ProjectServiceState(int(p.ID), "Reload", tx)
		if p.GitRepository.Version != project.GitRepository.Version {
			p.State = "Outdated"
		}

		err = p.Update(tx)
		if err != nil {
			log.Error(err)
			return
		}

		return
	}

	if p.State != Running {
		// TODO: reset Backoff when code is changed
		if p.BuildRetries == Retries {
			log.Info("Max retries reached")
			p.State = Backoff
			return
		}
		log.Info("Must start", p)
		//p.UpdateStateInDB(Building)
		project, err := controllers.ProjectServiceState(int(p.ID), "Start", tx)
		log.Info("Project after state change: ", project)
		if err != nil {
			log.Error(err)
			p.State = Errored
			p.ErrorMsg = err.Error()
			p.BuildRetries = p.BuildRetries + 1

			p.Update(tx)
			return
		}
		project.ErrorMsg = ""
		project.Update(tx)

	}

	log.Infof("Ending reconcile the state is %s", p.State)
}
