package controllers

import (
	"errors"
	"net/http"
	"strconv"
	"syscall"

	"github.com/labstack/echo"
	log "github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/runner"
)

func ProjectStateHandler(c echo.Context) error {
	projectID := c.Param("projectId")

	var state string
	switch state = c.Request().Method; state {
	case http.MethodPut:
		state = "Start"
	case http.MethodDelete:
		state = "Stop"
	}

	if state == "" {
		log.Error("state cannot be empty")
		return c.NoContent(http.StatusInternalServerError)
	}
	projectIDInt, err := strconv.Atoi(projectID)

	err = ProjectServiceState(projectIDInt, state)
	if err != nil && err == ErrNotFound {
		return c.NoContent(http.StatusNotFound)

	}
	if err != nil {
		return c.NoContent(http.StatusInternalServerError)
	}
	return nil
}

var ErrNotFound = errors.New("not found")

func ProjectServiceState(projectID int, state string) error {
	project, runnable, store, err := GetSimpleRunnable(projectID)
	if err != nil {
		return err
	}

	// Start
	if state == "Start" {

		err := runnable.PrepareSource()
		if err != nil {
			log.Error(err)
			return err
		}

		buildOutput, err := runnable.Build("/tmp/tumbo-builds")
		if err != nil {
			log.Error(err)
			return err
		}

		log.Info("project builded, ", buildOutput)

		err = buildOutput.OutputToStore(store)
		if err != nil {
			log.Error(err)
			return err
		}

		// Run
		endpoint, err := runnable.Run(store)

		if err != nil {
			log.Error(err)
			return err
		}

		// Store informations to reconnect later with reAttachConfig
		runner := models.Runner{
			Endpoint:  endpoint.Addr.String(),
			Pid:       endpoint.Pid,
			ProjectID: project.ID,
		}
		log.Debug(runner)

		err = models.CreateRunner(&runner, *project)
		if err != nil {
			log.Error(err)
			return err
		}

	}

	// Stop
	if state == "Stop" {
		r := models.Runner{}
		err = models.GetRunner(&r, *project)
		if err != nil {
			log.Error(err)
			return err
		}

		var runnable runner.SimpleRunnable
		err = runnable.Attach(r.Endpoint, r.Pid)
		if err != nil {
			log.Error(err)
			return err
		}

		err = runnable.Stop()
		if err != nil {
			log.Error(err)
			return err
		}
	}

	return nil
}

func GetRunner(project models.Project) (*runner.SimpleRunnable, error) {
	r := &models.Runner{}
	err := models.GetRunner(r, project)
	if err != nil {
		log.Error(err)
		return nil, err
	}

	runnable := runner.SimpleRunnable{}
	err = runnable.Attach(r.Endpoint, r.Pid)
	if err != nil {
		log.Error(err)
		return &runnable, err
	}
	return &runnable, nil
}

func GetSimpleRunnable(projectID int) (*models.Project, runner.SimpleRunnable, runner.ExecutableStore, error) {
	project, err := models.GetProject(uint(projectID))
	if err != nil {
		return project, runner.SimpleRunnable{}, runner.ExecutableStoreFilesystem{}, err
	}

	repo := models.GitRepository{}
	err = models.GetRepositoryForProject(&repo, uint(projectID))
	if err != nil {
		return project, runner.SimpleRunnable{}, runner.ExecutableStoreFilesystem{}, ErrNotFound
	}

	// Get Runnable
	runnable, err := runner.GetRunnableForProject(project, &repo)
	if err != nil {
		return project, runner.SimpleRunnable{}, runner.ExecutableStoreFilesystem{}, err
	}

	return project, runnable, runner.Store, err
}

func DeleteRunnerForService(project *models.Project) error {
	r := models.Runner{}
	err := models.GetRunner(&r, *project)
	if err != nil {
		return err
	}
	err = syscall.Kill(r.Pid, 9)
	if err != nil {
		log.Infof("not running anymore: %s", err)
	}

	m := models.DeleteRunner(r.ID)
	return m
}
