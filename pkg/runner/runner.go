package runner

import (
	"bytes"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"time"

	"github.com/hashicorp/go-plugin"
	"gopkg.in/matryer/try.v1"

	"github.com/sahlinet/go-tumbo3/pkg/runner/server"
	"github.com/sahlinet/go-tumbo3/pkg/runner/shared"
)

type Runnable interface {
	Build()
	Run()
	Stop()
}

type SimpleRunnable struct {
	Name     string
	Code     []byte
	Location string
	Client   *plugin.Client
	KV       shared.KV
}

type Execute func() string

func (r SimpleRunnable) Build() error {
	args := []string{"build", "-o=./example-plugin-go-grpc-out", "."}
	cmd := exec.Command("go", args...)
	cmd.Dir = r.Location
	//cmd.Env = []string{"GOOS=darwin", "GOARCH=amd64", "GOCACHE=/tmp/a", "GOPATH=/Users/philipsahli/go", "CC=clang", "PATH=/usr/bin"}
	cmd.Env = []string{"GOCACHE=/tmp/a", "CC=clang", "PATH=/usr/bin"}

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err := cmd.Start()
	if err != nil {
		return fmt.Errorf("build error: %s", err)
	}

	if err := cmd.Wait(); err != nil {
		log.Print(err)
	}
	outStr, errStr := string(stdout.Bytes()), string(stderr.Bytes())
	fmt.Printf("out:\n%s\nerr:\n%s\n", outStr, errStr)

	return nil
}

type Response struct {
	String string
}

func (r *SimpleRunnable) IsUp() (bool, error) {
	fmt.Println("Run IsUp")
	if r.Client == nil {
		return false, errors.New("down")
	}
	return true, nil
}

func (r *SimpleRunnable) Run() error {
	go r.RunPlugin()

	err := try.Do(func(attempt int) (bool, error) {
		var err error
		_, err = r.IsUp()
		if err != nil {
			time.Sleep(1 * time.Second)
		}
		return attempt < 10, err // try 5 times
	})
	if err != nil {
		log.Fatalln("error:", err)
	}

	return nil
}

func (r *SimpleRunnable) RunForever() error {
	r.Run()

	go server.Start()

	c := make(chan struct{})
	<-c

	return nil
}

func (r SimpleRunnable) Stop() error {
	if r.Client == nil {
		return errors.New("it looks like client is not up")
	}
	r.Client.Kill()
	return nil
}

// handshakeConfigs are used to just do a basic handshake between
// a plugin and host. If the handshake fails, a user friendly error is shown.
// This prevents users from executing bad plugins or executing a plugin
// directory. It is a UX feature, not a security feature.
var handshakeConfig = plugin.HandshakeConfig{
	ProtocolVersion:  1,
	MagicCookieKey:   "BASIC_PLUGIN",
	MagicCookieValue: "hello",
}

// pluginMap is the map of plugins we can dispense.
var pluginMap = map[string]plugin.Plugin{
	"greeter": &GreeterPlugin{},
}

func (r *SimpleRunnable) RunPlugin() {
	// We don't want to see the plugin logs.
	log.SetOutput(ioutil.Discard)

	pluginExec := fmt.Sprintf("%s/%s", r.Location, "example-plugin-go-grpc-out")

	// We're a host. Start by launching the plugin process.
	client := plugin.NewClient(&plugin.ClientConfig{
		HandshakeConfig: shared.Handshake,
		Plugins:         shared.PluginMap,
		Cmd:             exec.Command("sh", "-c", pluginExec),
		AllowedProtocols: []plugin.Protocol{
			plugin.ProtocolNetRPC, plugin.ProtocolGRPC},
	})
	//defer client.Kill()

	// Connect via RPC
	rpcClient, err := client.Client()
	r.Client = client
	if err != nil {
		fmt.Println("Error:", err.Error())
		os.Exit(1)
	}

	// Request the plugin
	raw, err := rpcClient.Dispense("kv_grpc")
	if err != nil {
		fmt.Println("Error:", err.Error())
		os.Exit(1)
	}

	// We should have a KV store now! This feels like a normal interface
	// implementation but is in fact over an RPC connection.
	kv := raw.(shared.KV)
	r.KV = kv

	c := make(chan struct{})
	<-c
	//os.Exit(0)
}

func (r *SimpleRunnable) Execute(s string) (string, error) {

	result, err := r.KV.Execute(s)
	fmt.Println(string(result))
	if err != nil {
		return "", err
	}

	return string(result), nil

}
