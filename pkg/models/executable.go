package models

import (
	"os"

	"gorm.io/gorm"
)

type ExecutableStoreDb struct {
}

type ExecutableStoreDbItem struct {
	ModelNonId

	Path       string `gorm:"primary_key" json:"Path"`
	Executable []byte
}

func NewExecutableStoreDbItem(p string) ExecutableStoreDbItem {
	item := ExecutableStoreDbItem{
		Path: p,
	}
	return item
}

func (s ExecutableStoreDb) Load(p string) ([]byte, error) {
	item := NewExecutableStoreDbItem(p)

	err := db.Where(ExecutableStoreDbItem{Path: item.Path}).First(&item).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return []byte{}, err
	}

	return item.Executable, nil
}

func (s ExecutableStoreDb) Add(p string, b []byte) (err error) {
	item := NewExecutableStoreDbItem(p)
	item.Executable = b
	if err = db.Create(item).Error; err != nil {
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
