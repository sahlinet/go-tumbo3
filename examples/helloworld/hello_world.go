package main

import (
	"fmt"

	"github.com/sahlinet/go-tumbo3/pkg/runner"
)

var V int

func F() runner.Execute {
	return func() string {
		s := fmt.Sprintf("Hello, number %d\n", V)
		return s
	}
}
