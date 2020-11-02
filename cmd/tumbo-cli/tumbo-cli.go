package main

import (
	"encoding/json"
	"fmt"
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
			Usage:   "List projects",
			Action: func(c *cli.Context) {
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
