package client

import (
	"encoding/json"
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

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	respJson := &Token{}
	err = json.Unmarshal(bodyBytes, respJson)
	if err != nil {
		return "", err
	}
	return respJson.Token, nil
}

type Token struct {
	Token string `json:"token"`
}
