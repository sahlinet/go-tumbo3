package main

import (
	"flag"
	"fmt"

	log "github.com/sirupsen/logrus"

	"github.com/sahlinet/go-tumbo3/pkg/runner"
)

func main() {
	pluginPath := flag.String("plugin", "", "path to the plugin")

	flag.Parse()

	if *pluginPath == "" {
		log.Fatal("Plugin path must be provided")
	}

	r := runner.SimpleRunnable{
		Name:     "example-plugin-go-grpc",
		Location: fmt.Sprintf("%s", *pluginPath),
	}

	err := r.Build()
	if err != nil {
		log.Error("no error expected", err)
	}

	fmt.Println(r)

	err = r.RunForever()
	if err != nil {
		log.Error("no error expected", err)
	}

}
