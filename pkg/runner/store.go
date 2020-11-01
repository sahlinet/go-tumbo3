package runner

import (
	"fmt"
	"io/ioutil"
	"os"
)

type ExecutableStore interface {
	Load(string) (*[]byte, error)
	Add(string, *[]byte) error
	Exists(string) (bool, error)
	GetPath(string) string
}

type ExecutableStoreFilesystem struct {
	Root string
}

func (s ExecutableStoreFilesystem) Load(p string) (*[]byte, error) {
	f, err := ioutil.ReadFile(s.GetPath(p))
	if err != nil {
		return &[]byte{}, err
	}
	return &f, nil
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
