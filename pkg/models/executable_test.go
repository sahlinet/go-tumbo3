package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func init() {
	InitTestDB("model")
}

func TestModelExecutable(t *testing.T) {

	store := ExecutableStoreDb{}

	defer DestroyTestDB("model")

	e := []byte("aa")
	item := ExecutableStoreDbItem{

		Path:       "aa-aa",
		Executable: &e,
	}
	err := store.Add(item.Path, item.Executable)
	assert.Nil(t, err)

	b, err := store.Load(item.Path)
	assert.Nil(t, err)

	assert.Regexp(t, "/tmp.*source.*", b)

}
