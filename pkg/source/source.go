package source

import (
	"io/ioutil"
	"os"

	"github.com/go-git/go-git/v5"

	log "github.com/sirupsen/logrus"
)

type Source struct {
	Remote           string
	CodePath         string
	TempBinaryOutput string
	Version          string
}

func (s *Source) Clone() (string, error) {
	d, version, err := Checkout(s.Remote)
	if err != nil {
		return "", err
	}
	s.Version = version
	return d, nil
}

func Checkout(cloneUrl string) (string, string, error) {
	t, err := tempDir()
	if err != nil {
		return "", "", err
	}
	r, err := git.PlainClone(t, false, &git.CloneOptions{
		URL:      cloneUrl,
		Progress: os.Stdout,
	})
	if err != nil {
		return "", "", err
	}
	ref, err := r.Head()
	if err != nil {
		return "", "", err
	}

	commit, err := r.CommitObject(ref.Hash())
	commitHash := commit.Hash.String()
	log.Infof("on commitHash: %s", commitHash)

	return t, commitHash, nil
}

func tempDir() (string, error) {
	dir, err := ioutil.TempDir("/tmp", "tumbo-*-source")
	if err != nil {
		return "", err
	}
	return dir, nil
}
