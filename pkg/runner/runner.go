package runner

import (
	"bytes"
	"errors"
	"fmt"
	"go/build"
	"io/ioutil"
	"net"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/hashicorp/go-plugin"
	log "github.com/sirupsen/logrus"
	"gopkg.in/matryer/try.v1"

	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/runner/server"
	"github.com/sahlinet/go-tumbo3/pkg/runner/shared"
)

func GetRunnableForProject(p *models.Service) (SimpleRunnable, error) {

	runnable := SimpleRunnable{
		Name:     "example-plugin-go-grpc-out",
		Location: "../../examples/example-plugin-go-grpc",
	}

	return runnable, nil
}

type Runnable interface {
	Build(ExecutableStore) error
	Run(ExecutableStore) error
	Stop() error
}

type SimpleRunnable struct {
	Name string
	//Code     []byte
	Location string
	Client   *plugin.Client
	KV       shared.KV
}

func (s *SimpleRunnable) FilePath() string {
	return fmt.Sprintf("%s/%s", s.Location, s.Name)
}

type Execute func() string

func (r SimpleRunnable) Build(store ExecutableStore) error {

	fn := fmt.Sprintf("./%s", r.Name)

	args := []string{"build", fmt.Sprintf("-o=%s", fn), "."}
	cmd := exec.Command("go", args...)
	cmd.Dir = r.Location

	//goPath := os.Getenv("GOPATH")
	goPath := ""
	if goPath == "" {
		goPath = build.Default.GOPATH
	}
	log.Print(goPath)
	cmd.Env = []string{"GOCACHE=/tmp/a", fmt.Sprintf("GOPATH=%s", goPath), "PATH=/usr/bin"}

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

	defer os.Remove(r.FilePath())

	outStr, errStr := string(stdout.Bytes()), string(stderr.Bytes())

	if errStr != "" {
		log.Errorf("out:\n%s\nerr:\n%s\n", outStr, errStr)
		return errors.New(strings.TrimRight(errStr, "\n"))
	}

	f, err := ioutil.ReadFile(r.FilePath())
	if err != nil {
		return err
	}

	store.Add(r.Name, &f)
	return nil
}

type Response struct {
	String string
}

func (r *SimpleRunnable) IsUp() (bool, error) {
	if r.Client == nil {
		return false, errors.New("down")
	}
	log.Println("Run IsUp")
	return true, nil
}

type RunnableEndpoint struct {
	Addr net.Addr
	Pid  int
}

func (r *SimpleRunnable) Run(store ExecutableStore) (RunnableEndpoint, error) {

	ac := make(chan *plugin.ReattachConfig)

	path := store.GetPath(r.Name)
	go r.RunPlugin(path, ac)

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

	reAttachConfig := <-ac

	endpoint := RunnableEndpoint{
		Addr: reAttachConfig.Addr,
		Pid:  reAttachConfig.Pid,
	}

	return endpoint, nil
}

func (r *SimpleRunnable) RunForever(store ExecutableStore) error {
	r.Run(store)

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

func (r *SimpleRunnable) RunPlugin(path string, ac chan *plugin.ReattachConfig) {
	// We don't want to see the plugin logs.
	log.SetOutput(ioutil.Discard)

	pluginExec := path

	// We're a host. Start by launching the plugin process.
	client := plugin.NewClient(&plugin.ClientConfig{
		HandshakeConfig: shared.Handshake,
		Plugins:         shared.PluginMap,
		Cmd:             exec.Command(pluginExec),
		AllowedProtocols: []plugin.Protocol{
			plugin.ProtocolNetRPC, plugin.ProtocolGRPC},
	})

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

	reAttachConfig := client.ReattachConfig()

	ac <- reAttachConfig

	c := make(chan struct{})
	<-c
	//os.Exit(0)
}

func (r *SimpleRunnable) Execute(s string) (string, error) {

	result, err := r.KV.Execute(s)
	log.Info(string(result))
	if err != nil {
		return "", err
	}

	return string(result), nil

}

func (r *SimpleRunnable) Attach(endpoint string, pid int) error {

	reattachConfig := plugin.ReattachConfig{
		Protocol: "grpc",
		Addr: &net.UnixAddr{
			Name: endpoint,
			Net:  "unix",
		},
		Pid:  pid,
		Test: false,
	}
	client := plugin.NewClient(&plugin.ClientConfig{
		Reattach: &reattachConfig,
	})
	log.Info(client)

	r.Client = client
	c, err := client.Client()
	if err != nil {
		return err
	}

	err = c.Ping()
	if err != nil {
		return fmt.Errorf("cannot ping, %s", err)
	}

	return nil

}
