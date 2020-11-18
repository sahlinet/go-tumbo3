package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
	"github.com/urfave/cli"

	tc "github.com/fatih/color"
	"github.com/rodaine/table"

	"github.com/sahlinet/go-tumbo3/pkg/client"
	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/version"
)

func info() {
	app.Name = "tumbo-cli"
	app.Usage = "Interaction interface with Tumbo"
	app.Author = "Philip Sahli"
	app.Version = version.BuildVersion
}

var app = cli.NewApp()

func commands() {
	app.Commands = []cli.Command{
		{
			Name:    "login",
			Aliases: []string{"l"},
			Usage:   "Authenticate to the server",
			Action: func(c *cli.Context) {

				log.Info("File found, but errored")
				token, err := client.Auth("http://localhost:8000/auth", "user1", "password")
				if err != nil {
					log.Error(err)
					os.Exit(1)
				}
				viper.Set("target.local.token", token)

			},
		},
		{
			Name:    "projects",
			Aliases: []string{"p"},
			Usage:   "manage projects",
			Subcommands: []cli.Command{
				{
					Name:  "list",
					Usage: "list projects",
					Action: func(c *cli.Context) error {

						headerFmt := tc.New(tc.FgGreen, tc.Underline).SprintfFunc()
						columnFmt := tc.New(tc.FgYellow).SprintfFunc()

						tbl := table.New("ID", "Name", "Score", "Added")
						tbl.WithHeaderFormatter(headerFmt).WithFirstColumnFormatter(columnFmt)

						req, err := http.NewRequest("GET", "http://localhost:8000/api/v1/projects", nil)
						if err != nil {
							log.Fatal("http.NewRequest err", err)
						}
						client := http.Client{}
						req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", viper.Get("target.local.token")))

						resp, err := client.Do(req)
						if err != nil {
							log.Fatal("client.Do err", err)
						}

						projects := []models.Project{}
						err = json.NewDecoder(resp.Body).Decode(&projects)
						if err != nil {
							log.Fatal(err)
						}

						for _, project := range projects {
							tbl.AddRow(project.ID, project.Name)
						}

						tbl.Print()
						return nil

					},
				},
				{
					Name:  "run",
					Usage: "run a project",
					Flags: []cli.Flag{
						&cli.StringFlag{Name: "name"},
					},
					Action: func(c *cli.Context) error {

						url := fmt.Sprintf("http://localhost:8000/api/v1/projects/1/services/1/run")
						req, err := http.NewRequest("PUT", url, nil)
						if err != nil {
							log.Fatal("http.NewRequest err", err)
						}
						client := http.Client{}
						req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", viper.Get("target.local.token")))

						resp, err := client.Do(req)
						if err != nil {
							log.Fatal("client.Do err", err)
						}

						if resp.StatusCode != 200 {
							b, err := ioutil.ReadAll(resp.Body)
							if err != nil {
								log.Fatal(err)
							}

							log.Error(string(b))

							os.Exit(1)
						}

						return nil

					},
				},
				{
					Name:  "show",
					Usage: "show a project",
					Flags: []cli.Flag{
						&cli.StringFlag{Name: "name"},
					},
					Action: func(c *cli.Context) error {

						url := fmt.Sprintf("http://localhost:8000/api/v1/projects/24")
						req, err := http.NewRequest("GET", url, nil)
						if err != nil {
							log.Fatal("http.NewRequest err", err)
						}
						client := http.Client{}
						req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", viper.Get("target.local.token")))

						resp, err := client.Do(req)
						if err != nil {
							log.Fatal("client.Do err", err)
						}

						if resp.StatusCode != 200 {
							b, err := ioutil.ReadAll(resp.Body)
							if err != nil {
								log.Fatal(err)
							}

							log.Error(string(b))

							os.Exit(1)
						}

						return nil

					},
				},
			},
		},
	}
}

func main() {
	info()
	commands()

	viper.AddConfigPath("$HOME/.tumbo1/")
	viper.SetConfigFile("cli.yaml")

	viper.Set("target.local.url", "http://localhost:8000")
	viper.SetConfigType("yml")

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			log.Info("File found, but errored")
			token, err := client.Auth("http://localhost/auth", "user1", "password")
			if err != nil {
				log.Error(err)
				os.Exit(1)
			}
			viper.Set("target.local.token", token)

			log.Error(err)
			// Config file was found but another error was produced
			viper.WriteConfig()
			os.Exit(1)
		}

		log.Info("File found")
	}
	viper.WriteConfig()
	err := app.Run(os.Args)
	viper.WriteConfig()
	if err != nil {
		log.Fatal(err)
	}

}
