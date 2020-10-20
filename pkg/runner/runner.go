package runner

import (
	"fmt"
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
	cmd := exec.Command("go", "build", "-buildmode=plugin")
	cmd.Dir = r.Location
	err := cmd.Run()
	if err != nil {
		return fmt.Errorf("build error: %s", err)
	}

	return nil
}

func (r SimpleRunnable) Run() (string, error) {
	var p *plugin.Plugin
	var err error

	p, err = plugin.Open(fmt.Sprintf("%s/helloworld.so", r.Location))
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
