package models

import (
	"io/ioutil"
	"os"
	"path"

	log "github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type ExecutableStoreDb struct {
}

type ExecutableStoreDbItem struct {
	//ModelNonId
	Model

	Path       string `json:"path"`
	Executable *[]byte
	Size       uint
}

func NewExecutableStoreDbItem(p string) ExecutableStoreDbItem {
	item := ExecutableStoreDbItem{
		Path: p,
	}
	return item
}

func (s ExecutableStoreDb) Load(p string) (string, error) {
	item := NewExecutableStoreDbItem(p)

	err := db.Where(ExecutableStoreDbItem{Path: item.Path}).First(&item).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return "", err
	}

	d, err := ioutil.TempDir("/tmp/", "tumbo-*-source")
	filename := path.Join(d, p)

	f, err := os.Create(filename)
	if err != nil {
		return "", err
	}
	_, err = f.Write(*item.Executable)
	if err != nil {
		return "", err
	}

	return filename, nil
}

// Add saves the executable to the database
func (s ExecutableStoreDb) Add(p string, b *[]byte) (err error) {
	item := NewExecutableStoreDbItem(p)
	item.Size = uint(len(*b))
	item.Executable = b
	log.Info("store executable with name ", item.Path)
	if err = db.Create(&item).Error; err != nil {
		return err
	}
	return nil
}

func (s ExecutableStoreDb) Exists(p string) (bool, error) {
	_, err := os.Stat(s.GetPath(p))
	if err != nil {
		return false, err
	}
	return true, nil
}

func (s ExecutableStoreDb) GetPath(p string) string {
	return p
}
