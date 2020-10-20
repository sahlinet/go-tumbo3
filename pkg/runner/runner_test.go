package runner

import (
	"fmt"
	"testing"
)

func TestAbs(t *testing.T) {
	r := SimpleRunnable{
		Location: "../../../go-tumbo3-examples/examples/helloworld",
	}

	err := r.Build()
	if err != nil {
		t.Error("no error expected", err)
	}

	fmt.Println(r)

	resp, err := r.Run()
	if err != nil {
		t.Error("no error expected", err)
	}

	if resp == "" {
		t.Error("no empty return expected")
	}

}
