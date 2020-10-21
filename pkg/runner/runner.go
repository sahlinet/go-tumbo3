package runner

import (
	"bytes"
	"errors"
	"fmt"
	"log"
	"os"
	"os/exec"
	"plugin"
)

type Runnable interface {
	Build()
	Run()
}

type SimpleRunnable struct {
	Code     []byte
	Location string
}

type Execute func() string

func (r SimpleRunnable) Build() error {
	args := []string{"build", "-buildmode=plugin", "github.com/sahlinet/go-tumbo3-examples/helloworld"}
	//args = []string{"env"}
	cmd := exec.Command("/usr/local/bin/go", args...)
	cmd.Dir = "/Users/philipsahli/workspace/go-tumbo3-examples/helloworld"
	cmd.Env = []string{"GOOS=darwin", "GOARCH=amd64", "GOCACHE=/tmp/a", "GOPATH=/Users/philipsahli/go", "CC=clang", "PATH=/usr/bin"}

	var b bytes.Buffer
	cmd.Stdout = &b
	cmd.Stderr = &b

	//stdout, err := cmd.StdoutPipe()
	//stderr, err := cmd.StderrPipe()
	err := cmd.Start()
	if err != nil {
		return fmt.Errorf("build error: %s", err)
	}

	if err := cmd.Wait(); err != nil {
		log.Print(err)
	}
	println("output: " + string(b.Bytes()))

	return nil
}

func (r SimpleRunnable) Run() (string, error) {
	var p *plugin.Plugin
	var err error

	//p, err = plugin.Open(fmt.Sprintf("%s/helloworld.so", r.Location))
	if _, err := os.Stat("./helloworld.so"); os.IsNotExist(err) {
		// Do whatever is required on module not existing
		return "", errors.New("file not found")
	}
	p, err = plugin.Open(fmt.Sprint("./helloworld.so"))
	if err != nil {
		return "", err
	}

	f, err := p.Lookup("F")
	if err != nil {
		return "", err
	}

	s := f.(Execute)()

	return s, nil

}
