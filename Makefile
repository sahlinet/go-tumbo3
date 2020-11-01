.PHONY: build clean tool lint help

all: build

elm:
	cd web/elm && elm make src/Main.elm --optimize

build: elm
	@go generate ./...
	@go build -o build/tumbo -v ./cmd/tumbo
	@go build -o build/runner -v ./cmd/runner
	#@go build -v ./cmd/cli
	cd pkg/runner ; protoc -I proto/ proto/kv.proto --go_out=plugins=grpc:proto/
	swag init -g ./cmd/tumbo/main.go

test: build
	@go test ./...

run: build
	@go run ./cmd/tumbo	

tool:
	go vet ./...
	gofmt -w .

lint:
	golint ./...

clean:
	rm -rf go-gin-example
	go clean -i .

example: build
	./build/runner -build -plugin examples/example-plugin-go-grpc

help:
	@echo "make: compile packages and dependencies"
	@echo "make tool: run specified go tool"
	@echo "make lint: golint ./..."
	@echo "make clean: remove object files and cached files"
