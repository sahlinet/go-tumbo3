package client

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"

	log "github.com/sirupsen/logrus"

	"github.com/flowchartsman/retry"
	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/operator"
)

func Auth(u, username, password string) (string, error) {
	resp, err := http.PostForm(u, url.Values{
		"username": {username},
		"password": {password}})
	if err != nil {
		return "", err
	}

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("Could not login (%d)", resp.StatusCode)
	}

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	respJson := &User{}
	err = json.Unmarshal(bodyBytes, respJson)
	if err != nil {
		return "", err
	}
	return respJson.User.Token, nil
}

type User struct {
	User struct {
		Token string `json:"token"`
	} `json:"user"`
}

func CreateProject(baseUrl, token string, project *models.Project) error {
	payload, err := json.Marshal(project)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/api/v1/projects", baseUrl)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer([]byte(payload)))
	if err != nil {
		log.Error("http.NewRequest err", err)
	}
	client := http.Client{}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := client.Do(req)
	if err != nil {
	}

	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode > 300 {
		log.Error("client.Do err", err)
		log.Error(body)
		return errors.New("error creating project")
	}

	err = json.Unmarshal(body, &project)
	if err != nil {
		return err
	}

	return nil

}

func StartProject(baseUrl, token string, project *models.Project) error {
	payload, err := json.Marshal(project)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/api/v1/projects/%b/run", baseUrl, project.ID)

	req, err := http.NewRequest("PUT", url, bytes.NewBuffer([]byte(payload)))
	if err != nil {
		log.Error("http.NewRequest err", err)
	}
	client := http.Client{}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := client.Do(req)
	if err != nil {
	}

	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode > 300 {
		log.Error("client.Do err", err)
		log.Error(body)
		return fmt.Errorf("error starting project (%s)", body)
	}

	err = json.Unmarshal(body, &project)
	if err != nil {
		return err
	}
	err = WaitForState(baseUrl, token, project, operator.Running)
	if err != nil {
		return err
	}

	return nil
}

func WaitForState(baseUrl, token string, project *models.Project, state string) error {
	retrier := retry.NewRetrier(30, 100*time.Millisecond, 2*time.Second)

	err := retrier.Run(func() error {
		err := GetProject(baseUrl, token, project)
		switch {
		case err != nil:
			// request error - return it
			return err
		case project.State != state:
			return fmt.Errorf("retry, state is %s, not %s", project.State, state)
			//case project.State == state:
			// retryable StatusCode - return it
			//return retry.Stop(fmt.Errorf("expected state is " + state))
		}
		return nil
	})
	if err != nil {
		// handle error
		return err
	}
	return nil
}

func StopProject(baseUrl, token string, project *models.Project) error {
	payload, err := json.Marshal(project)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("%s/api/v1/projects/%b/run", baseUrl, project.ID)

	req, err := http.NewRequest("DELETE", url, bytes.NewBuffer([]byte(payload)))
	if err != nil {
		log.Error("http.NewRequest err", err)
	}
	client := http.Client{}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := client.Do(req)
	if err != nil {
	}

	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode > 300 {
		log.Error("client.Do err", err)
		log.Error(body)
		return errors.New("error stopping project")
	}

	err = json.Unmarshal(body, &project)
	if err != nil {
		return err
	}

	err = WaitForState(baseUrl, token, project, operator.Stopped)
	if err != nil {
		return err
	}

	return nil
}

func GetProjects(baseUrl, token string) ([]models.Project, error) {
	projects := []models.Project{}

	url := fmt.Sprintf("%s/api/v1/projects", baseUrl)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Error("http.NewRequest err", err)
	}
	client := http.Client{}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := client.Do(req)
	if err != nil {
		log.Error("client.Do err", err)
	}

	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode > 299 {
		log.Error(body)
	}

	err = json.Unmarshal(body, &projects)
	if err != nil {
		return projects, err
	}

	return projects, nil

}

func GetProject(baseUrl, token string, project *models.Project) error {
	url := fmt.Sprintf("%s/api/v1/projects/%b", baseUrl, project.ID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Error("http.NewRequest err", err)
	}
	client := http.Client{}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	resp, err := client.Do(req)
	if err != nil {
		log.Error("client.Do err", err)
	}

	body, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode > 299 {
		log.Error(body)
	}

	err = json.Unmarshal(body, &project)
	if err != nil {
		return err
	}

	return nil

}
