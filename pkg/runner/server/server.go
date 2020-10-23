package server

import (
	"net"

	"google.golang.org/grpc"

	pb "github.com/sahlinet/go-tumbo3/pkg/runner/proto"
	log "github.com/sirupsen/logrus"
)

type server struct {
	pb.KVServer
}

// SayHello implements helloworld.GreeterServer
/*func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	log.Printf("Received: %v", in.GetName())
	return &pb.HelloReply{Message: "Hello " + in.GetName()}, nil
}

*/

func Start() {
	lis, err := net.Listen("tcp", ":8888")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterKVServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
