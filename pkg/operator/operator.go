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
		time.Sleep(10 * time.Second)
		projects, err := models.GetProjects()
		if err != nil {
			log.Error(err)
		}
		for _, project := range projects {
			p, err := models.GetProject(project.ID)
			if err != nil {
				log.Error(err)
			}

			logProject := log.WithField("project", project.Name)
			logProject.Infof("Name: %s State: %s", p.Name, p.ProjectState.State)

			go reconcile(logProject, p)
		}

	}
}

func reconcile(log *logrus.Entry, p *models.Project) {
	log.Infof("Starting reconcile %s the state is %s", p.Name, p.ProjectState.State)

	// Get and Lock
	p, tx, err := models.GetProjectForShareOrUpdate(p.ID, "SHARE")
	if err != nil {
		log.Error(err)
		return
	}
	defer tx.Commit()
	defer p.Update(tx)

	if p.ProjectState == nil {
		p.ProjectState = &models.ProjectState{
			State: "None",
		}
	}

	if p.ProjectState.State == Backoff {
		log.Info("Ignore because the state is ", Backoff)
		return
	}

	if p.ProjectState.State == Stopped {
		log.Info("Ignore stopped")
		return
	}

	if p.ProjectState.State == "Outdated" {

		_, err := controllers.ProjectServiceState(int(p.ID), "Stop", tx)
		if err != nil {
			log.Error(err)
			return
		}

	}

	if p.ProjectState.State == Running {
		log.Info("State is running")
		_, err := controllers.GetRunner(*p)
		if err != nil {
			runnerModel := &models.Runner{}
			models.GetRunner(runnerModel, *p)
			controllers.DeleteRunnerForService(p)
			p.ProjectState.State = Errored
			p.ProjectState.ErrorMsg = err.Error()
			log.Error(err)
			p.Update(tx)
			return
		}

		p.ProjectState.ErrorMsg = ""

		project, err := controllers.ProjectServiceState(int(p.ID), "Reload", tx)
		log.Infof("Diff old: %s new: %s", p.GitRepository.Version, project.GitRepository.Version)
		if p.GitRepository.Version != project.GitRepository.Version {
			p.ProjectState.State = "Outdated"
			return
		}

		/*err = p.Update(tx)
		if err != nil {
			log.Error(err)
			return
		}
		*/

		return
	}

	if p.ProjectState.State != Running {
		if p.BuildRetries == Retries {
			log.Info("Max retries reached")
			p.ProjectState.State = Backoff

			// Check if code changed
			project, err := controllers.ProjectServiceState(int(p.ID), "Check", tx)
			p.GitRepository = project.GitRepository
			if err != nil {
				log.Error(err)
			}
			if p.GitRepository.Version != project.GitRepository.Version {
				return
			}
			p.BuildRetries = 0
			p.ProjectState.ErrorMsg = ""
		}
		log.Info("Must start", p)
		project, err := controllers.ProjectServiceState(int(p.ID), "Start", tx)
		log.Info("Project after state change: ", project)
		if err != nil {
			log.Error(err)
			p.ProjectState.State = Errored
			p.ProjectState.ErrorMsg = err.Error()
			p.BuildRetries = p.BuildRetries + 1

			p.Update(tx)
			return
		}
		p.ProjectState.ErrorMsg = ""
		p.GitRepository = project.GitRepository
		//project.Update(tx)

	}

	log.Infof("Ending reconcile the state is %s", p.ProjectState.State)
}
