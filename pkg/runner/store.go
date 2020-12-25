package runner

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/sahlinet/go-tumbo3/internal/util"
	"github.com/sahlinet/go-tumbo3/pkg/models"
)

type ExecutableStore interface {
	Load(string) (string, error)
	Add(string, *[]byte) error
	Exists(string) (bool, error)
	GetPath(string) string
}

type ExecutableStoreFilesystem struct {
	Root string
}

var Store ExecutableStore

func init() {
	k8s := util.IsRunningInKubernetes()
	if k8s {

		Store = models.ExecutableStoreDb{}
	} else {
		Store = ExecutableStoreFilesystem{
			Root: "/tmp",
		}
	}
}

func (s ExecutableStoreFilesystem) Load(p string) (string, error) {
	_, err := ioutil.ReadFile(s.GetPath(p))
	if err != nil {
		return "", err
	}
	return s.GetPath(p), nil
}

func (s ExecutableStoreFilesystem) Add(p string, b *[]byte) error {
	err := ioutil.WriteFile(s.GetPath(p), *b, 0744)
	if err != nil {
		return err
	}
	return nil
}

func (s ExecutableStoreFilesystem) Exists(p string) (bool, error) {
	_, err := os.Stat(s.GetPath(p))
	if err != nil {
		return false, err
	}
	return true, nil
}

func (s ExecutableStoreFilesystem) GetPath(p string) string {
	return fmt.Sprintf("%s/%s", s.Root, p)
}
