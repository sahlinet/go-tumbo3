# Design

## Layout


1. https://github.com/eddycjy/go-gin-example
2. https://github.com/Massad/gin-boilerplate

## Terms

- Project

A project is a unit and represents an application. A project belongs to a team and its implementation is stored in a Git repository.

- Service

A Service is running on the execution layer and groups multiple functions.
 
- Function

A function is a code snipped that runs in a service. Interaction with functions happens over the HTTP API.

- Statics

Static content Delivery with dynamic rendering.

To build a webapplication with Tumbo, static files can be provided and they are loadable over 

- Settings

Configures the project. Configuration settings are available in the rendering process for files and executing functions.

## Server

### Embed Static files

[go.rice](https://github.com/GeertJohan/go.rice)

### Persistence

Mongodb

https://github.com/bitnami/charts/
https://medium.com/@devcrazy/golang-gin-jwt-mogo-mongodb-orm-golang-authentication-example-52c3c1189488

### Execution

User provided code is built and added to a Docker image.
The process is started when storing or updating the code. The User gets feedback about the process.

Multiple options allows to load the code in our execution stage:

- https://golang.org/pkg/plugin/
- https://www.terraform.io/docs/plugins/index.html

> Future:
> - asynchronous
> - scheduled

### Internals

#### Communication

Internal communication from the backend to the execution layer happens over grpc.

Every executor acts as a gRPC server handling the ExecutorService.

## Authentication

### Methods

- Basic Auth
- Social Auth GitHub  https://github.com/markbates/goth

### Teams

A user can create a team and invite other members. Members accept the invitation to agree the membership.
They receive the same permissions, except they cannot change the team.

## Frontend

### Implementation

elm-spa

#### Elm

Frontend Framework:  https://elm-lang.org/ - Component Framework: debois/elm-mdl

https://github.com/debois/elm-mdl -> not compatible with ELM 0.19
http://elm-bootstrap.info/
https://github.com/chrisUsick/elm-spa-mdl-boilerplate

Colors: https://package.elm-lang.org/packages/smucode/elm-flat-colors/latest/

#### Minify

https://github.com/tdewolff/minify

# CLI

## Development

### Security

go get github.com/securego/gosec/v2/cmd/gosec

