package cache_service

import (
	"strconv"
	"strings"

	"github.com/sahlinet/go-tumbo/pkg/e"
)

type Project struct {
	ID    int
	TagID int
	State int

	PageNum  int
	PageSize int
}

func (a *Project) GetProjectKey() string {
	return e.CACHE_PROJECT + "_" + strconv.Itoa(a.ID)
}

func (a *Project) GetProjectsKey() string {
	keys := []string{
		e.CACHE_PROJECT,
		"LIST",
	}

	if a.ID > 0 {
		keys = append(keys, strconv.Itoa(a.ID))
	}
	if a.TagID > 0 {
		keys = append(keys, strconv.Itoa(a.TagID))
	}
	if a.State >= 0 {
		keys = append(keys, strconv.Itoa(a.State))
	}
	if a.PageNum > 0 {
		keys = append(keys, strconv.Itoa(a.PageNum))
	}
	if a.PageSize > 0 {
		keys = append(keys, strconv.Itoa(a.PageSize))
	}

	return strings.Join(keys, "_")
}
