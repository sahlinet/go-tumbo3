package models

import (
	"io/ioutil"
	"os"
	"path"

	log "github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ExecutableStoreDb struct {
}

type ExecutableStoreDbItem struct {
	//ModelNonId
	//Model

	Path       string `gorm:"primary_key" json:"path"`
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

	os.Chmod(filename, 0700)

	return filename, nil
}

// Add saves the executable to the database
func (s ExecutableStoreDb) Add(p string, b *[]byte) error {
	item := NewExecutableStoreDbItem(p)

	item.Size = uint(len(*b))
	item.Executable = b

	log.Infof("store executable with name %s", item.Path)

	if err := db.Clauses(clause.OnConflict{
		UpdateAll: true,
	}).Create(&item).Error; err != nil {
		return err
	}

	log.Infof("stored executable with name %s", item.Path)
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
