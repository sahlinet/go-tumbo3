package runner

import (
	"testing"

	"github.com/kylelemons/godebug/diff"
)

var flagtests = []struct {
	name               string
	runnable           SimpleRunnable
	buildErrorExpected string
}{
	{
		name: "example",
		runnable: SimpleRunnable{
			Name:     "example-plugin-go-grpc-out",
			Location: "../../examples/example-plugin-go-grpc",
		},
		buildErrorExpected: "",
	},
	{
		name: "example-fail",
		runnable: SimpleRunnable{
			Name:     "example-plugin-go-grpc-fail-out",
			Location: "../../examples/example-plugin-go-grpc-fail",
		},
		buildErrorExpected: `# github.com/sahlinet/go-tumbo3/examples/example-plugin-go-grpc-fail
./main.go:5:1: syntax error: non-declaration statement outside function body`,
	},
}

func TestAbs(t *testing.T) {
	for _, tt := range flagtests {
		t.Run(tt.name, func(t *testing.T) {

			r := tt.runnable

			store := ExecutableStoreFilesystem{
				Root: "/tmp",
			}

			err := r.Build(&store)
			if err != nil && err.Error() != tt.buildErrorExpected {
				t.Errorf("expected build error wrong, diff:\n %s", diff.Diff(err.Error(), tt.buildErrorExpected))
			}

			if tt.buildErrorExpected == "" {

				err = r.Run(&store)
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

		})

	}
}
