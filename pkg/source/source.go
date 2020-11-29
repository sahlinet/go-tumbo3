package source

import (
	"io/ioutil"
	"os"

	"github.com/go-git/go-git/v5"
)

type Source struct {
	Remote           string
	CodePath         string
	TempBinaryOutput string
}

func (s *Source) Clone() (string, error) {
	d, err := Checkout(s.Remote)
	if err != nil {
		return "", err
	}
	return d, nil
}

func Checkout(cloneUrl string) (string, error) {
	t, err := tempDir()
	if err != nil {
		return "", err
	}
	_, err = git.PlainClone(t, false, &git.CloneOptions{
		URL:      cloneUrl,
		Progress: os.Stdout,
	})
	if err != nil {
		return "", err
	}

	return t, nil
}

func tempDir() (string, error) {
	dir, err := ioutil.TempDir("/tmp", "tumbo-*-source")
	if err != nil {
		return "", err
	}
	return dir, nil
}
