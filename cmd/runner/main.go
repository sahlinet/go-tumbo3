package main

import (
	"flag"
	"fmt"
	"path/filepath"

	log "github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/pkg/runner"
)

func main() {
	pluginPath := flag.String("plugin", "", "path to the plugin")
	build := flag.Bool("build", false, "build executable")
	//download := flag.Bool("download", false, "download executable")
	//downloadBaseURL := flag.Bool("")

	flag.Parse()

	if *pluginPath == "" {
		log.Fatal("Plugin path must be provided")
	}

	r := runner.SimpleRunnable{
		Name:     "example-plugin-go-grpc",
		Location: fmt.Sprintf("%s", *pluginPath),
	}

	r.Name = filepath.Base(r.Location)

	store := runner.ExecutableStoreFilesystem{
		Root: "/tmp",
	}

	if *build {
		buildOutput, err := r.Build("/tmp/tumbo-builds")
		if err != nil {
			log.Fatal("no error expected", err)
		}

		buildOutput.OutputToStore(&store)
	}

	fmt.Println(r)

	err := r.RunForever(store)
	if err != nil {
		log.Error("no error expected", err)
	}

}
