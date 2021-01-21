package main

import (
	"fmt"

	"github.com/hashicorp/go-plugin"
	"github.com/sahlinet/go-tumbo3/pkg/runner/shared"
)

// Here is a real implementation of KV that writes to a local file with
// the key name and the contents are the value of the key.
type KV struct{}

func (KV) Execute(key string) ([]byte, error) {
	panic("I panicked")
	return []byte(fmt.Sprintf("Hello %s", key)), nil
}

func main() {
	plugin.Serve(&plugin.ServeConfig{
		HandshakeConfig: shared.Handshake,
		Plugins: map[string]plugin.Plugin{
			"kv": &shared.KVGRPCPlugin{Impl: &KV{}},
		},

		// A non-nil value here enables gRPC serving for this plugin...
		GRPCServer: plugin.DefaultGRPCServer,
	})
}
