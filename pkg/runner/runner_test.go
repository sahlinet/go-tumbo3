package runner

import (
	"testing"
)

func TestAbs(t *testing.T) {
	r := SimpleRunnable{
		Name: "example-plugin-go-grpc",
		//Location: "../../../go-tumbo3-examples/helloworld",
		Location: "./example-plugin-go-grpc",
	}

	err := r.Build()
	if err != nil {
		t.Error("no error expected", err)
	}

	err = r.Run()
	if err != nil {
		t.Error("no error expected", err)
	}

	expectedResponse := "Hello Hello"

	resp, err := r.Execute("Hello")
	if resp != expectedResponse {
		t.Errorf("not expected response '%s', was: '%s'", expectedResponse, resp)
	}

	err = r.Stop()
	if err != nil {
		t.Error("Error not expected ", err)
	}

}
