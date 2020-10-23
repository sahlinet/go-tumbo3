package shared

import (
	"golang.org/x/net/context"

	"github.com/sahlinet/go-tumbo3/pkg/runner/proto"
)

// GRPCClient is an implementation of KV that talks over RPC.
type GRPCClient struct{ client proto.KVClient }

func (m *GRPCClient) Execute(key string) ([]byte, error) {
	resp, err := m.client.Execute(context.Background(), &proto.TumboRequest{
		Key: key,
	})
	if err != nil {
		return nil, err
	}

	return resp.Value, nil
}

// Here is the gRPC server that GRPCClient talks to.
type GRPCServer struct {
	// This is the real implementation
	Impl KV
}

func (m *GRPCServer) Execute(
	ctx context.Context,
	req *proto.TumboRequest) (*proto.TumboResponse, error) {
	v, err := m.Impl.Execute(req.Key)
	return &proto.TumboResponse{Value: v}, err
}
