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
	"path"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/hashicorp/go-plugin"
	log "github.com/sirupsen/logrus"
	"gopkg.in/matryer/try.v1"

	"github.com/sahlinet/go-tumbo3/pkg/models"
	"github.com/sahlinet/go-tumbo3/pkg/runner/server"
	"github.com/sahlinet/go-tumbo3/pkg/runner/shared"
	"github.com/sahlinet/go-tumbo3/pkg/source"
)

func GetRunnableForProject(s *models.Service, repo *models.GitRepository) (SimpleRunnable, error) {

	runnable := SimpleRunnable{
		Name:     s.Name,
		Location: repo.Url,
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

	Location string
	Source   source.Source

	Client *plugin.Client
	KV     shared.KV
}

type BuildOutput struct {
	Path string
}

func (o *BuildOutput) OutputToStore(store *ExecutableStoreFilesystem) error {
	f, err := ioutil.ReadFile(o.Path)
	if err != nil {
		return err
	}

	err = store.Add(filepath.Base(o.Path), &f)
	if err != nil {
		return err
	}
	return nil

}

func (s *SimpleRunnable) FilePath() string {
	return fmt.Sprintf("%s", s.Name)
}

type Execute func() string

func (r *SimpleRunnable) PrepareSource() error {
	s := source.Source{
		Remote: r.Location,
	}

	if strings.Contains(r.Location, ".git") {

		p, err := s.Clone()
		if err != nil {
			return err
		}
		s.CodePath = p
	} else {
		s.CodePath = r.Location
	}
	r.Source = s

	return nil
}

func (r SimpleRunnable) Build(buildOutputDir string) (BuildOutput, error) {
	// Define output
	var output BuildOutput
	fn := path.Join(buildOutputDir, r.FilePath())
	output.Path = fn

	cwd, _ := os.Getwd()
	log.Info("current working directory: ", cwd)

	args := []string{"build", fmt.Sprintf("-o=%s", fn), "."}
	cmd := exec.Command("go", args...)
	cmd.Dir = r.Source.CodePath
	//cmd.Dir = r.Location

	//goPath := os.Getenv("GOPATH")
	goPath := ""
	if goPath == "" {
		goPath = build.Default.GOPATH
	}
	cmd.Env = []string{"GOCACHE=/tmp/a", fmt.Sprintf("GOPATH=%s", goPath), "PATH=/usr/bin"}
	log.Print(cmd)
	log.Print("in directory ", cmd.Dir)

	if cmd.Dir == "" {
		return output, fmt.Errorf("directory must be set")
	}

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err := cmd.Start()
	if err != nil {
		return output, fmt.Errorf("build error: %s", err)
	}

	if err = cmd.Wait(); err != nil {
		log.Print(err)
	}

	//defer os.Remove(r.FilePath())

	outStr, errStr := string(stdout.Bytes()), string(stderr.Bytes())

	if errStr != "" {
		log.Errorf("out:\n%s\nerr:\n%s\n", outStr, errStr)
		return output, errors.New(strings.TrimRight(errStr, "\n"))
	}

	return output, nil
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

func (r SimpleRunnable) Close() error {
	c, err := r.Client.Client()
	if err != nil {
		return err
	}
	err = c.Close()
	if err != nil {
		return err
	}
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

	process := exec.Command(pluginExec)
	process.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	//process.SysProcAttr.Setsid = true
	//syscall.Umask(0)
	log.Info("running ", process)

	// We're a host. Start by launching the plugin process.
	client := plugin.NewClient(&plugin.ClientConfig{
		HandshakeConfig: shared.Handshake,
		Plugins:         shared.PluginMap,
		Cmd:             process,
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
	if err != nil {
		return "", err
	}

	log.Info(string(result))

	return string(result), nil

}

func (r *SimpleRunnable) Attach(endpoint string, pid int) error {

	c, err := r.GetClient(endpoint, pid)
	if err != nil {
		return err
	}

	err = r.Ping(c)
	if err != nil {
		return fmt.Errorf("error on r.Ping: %s", err)
	}

	// Request the plugin

	raw, err := c.Dispense("kv_grpc")
	if err != nil {
		log.Warn("Error:", err.Error())
		return err
	}

	// We should have a KV store now! This feels like a normal interface
	// implementation but is in fact over an RPC connection.
	kv := raw.(shared.KV)
	r.KV = kv

	return nil

}

func (r *SimpleRunnable) GetClient(endpoint string, pid int) (plugin.ClientProtocol, error) {
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
		HandshakeConfig: shared.Handshake,
		Plugins:         shared.PluginMap,
		Reattach:        &reattachConfig,
	})

	r.Client = client

	if clientProtocol, err := client.Client(); clientProtocol == nil || err != nil {
		return nil, fmt.Errorf("error in clientProtocol, %s", err)
	}
	c, err := client.Client()
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (r *SimpleRunnable) Ping(c plugin.ClientProtocol) error {
	err := c.Ping()
	if err != nil {
		return fmt.Errorf("cannot ping, %s", err)
	}
	return nil
}
