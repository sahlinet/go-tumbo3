package runner

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/kylelemons/godebug/diff"
)

var flagtests = []struct {
	name               string
	runnable           SimpleRunnable
	buildErrorExpected string
	expectedResponse   string
}{
	{
		name: "example",
		runnable: SimpleRunnable{
			Name:     "example-plugin-go-grpc-out",
			Location: "../../examples/example-plugin-go-grpc",
		},
		expectedResponse:   "Hello Hello",
		buildErrorExpected: "",
	},
	/* 	{
			name: "example-fail",
			runnable: SimpleRunnable{
				Name:     "example-plugin-go-grpc-fail-out",
				Location: "../../examples/example-plugin-go-grpc-fail",
			},
			buildErrorExpected: `# github.com/sahlinet/go-tumbo3/examples/example-plugin-go-grpc-fail
	./main.go:20:20: undefined: shared.Handshak`,
			expectedResponse: "Hello Hello",
		}, */

	{
		name: "example-git",
		runnable: SimpleRunnable{
			Name:     "example-plugin-go-grpc",
			Location: "https://github.com/sahlinet/go-tumbo3-examples.git//example-plugin-go-grpc",
		},
		expectedResponse:   "Hello Hello",
		buildErrorExpected: "",
	},

	/* 	{
		name: "panicking",
		runnable: SimpleRunnable{
			Name:     "example-plugin-go-grpc-panicking",
			Location: "../../examples/example-plugin-go-grpc-panicking",
		},
		expectedResponse:   "",
		buildErrorExpected: "",
	}, */
}

func TestBuildAndRunner(t *testing.T) {
	for _, tt := range flagtests {
		t.Run(tt.name, func(t *testing.T) {

			r := tt.runnable

			// Define this the same as
			store := ExecutableStoreFilesystem{
				Root: "/tmp",
			}

			err := r.PrepareSource()
			assert.Nil(t, err)

			assert.NotEmpty(t, r.Source.Version)

			buildOutput, err := r.Build("/tmp/tumbo-builds")
			if err != nil && err.Error() != tt.buildErrorExpected {
				t.Errorf("expected build error wrong, diff:\n %s", diff.Diff(err.Error(), tt.buildErrorExpected))
			}

			if tt.buildErrorExpected == "" {

				err = buildOutput.OutputToStore(&store)
				assert.Nil(t, err)

				endpoint, err := r.Run(store)
				if err != nil {
					t.Error("no error expected", err)
				}

				if endpoint.Pid == 0 {
					t.Error("Pid cannot be zero")
				}

				resp, err := r.Execute("Hello")
				if resp != tt.expectedResponse {
					t.Errorf("not expected response '%s', was: '%s'", tt.expectedResponse, resp)
				}

				err = r.Stop()
				if err != nil {
					t.Error("Error not expected ", err)
				}

			}

		})

	}
}
