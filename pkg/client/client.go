package client

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
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
