module Api.User exposing
    ( User
    , decoder, encode
    , authentication, registration, current, update
    )

{-|

@docs User
@docs decoder, encode

@docs authentication, registration, current, update

-}

import Api.Data exposing (Data)
import Api.Token exposing (Token)
import Http
import Json.Decode as Json
import Json.Encode as Encode
import Utils.Json


type alias User =
    { email : String
    , token : Token
    , username : String
    }


decoder : Json.Decoder User
decoder =
    Json.map3 User
        (Json.field "email" Json.string)
        (Json.field "token" Api.Token.decoder)
        (Json.field "username" Json.string)


encode : User -> Json.Value
encode user =
    Encode.object
        [ ( "username", Encode.string user.username )
        , ( "email", Encode.string user.email )
        , ( "token", Api.Token.encode user.token )
        ]


loginUrl : String
loginUrl =
    --    "http://localhost:8000/auth"
    "/auth"


authentication :
    { user : { user | email : String, password : String }
    , onResponse : Data User -> msg
    }
    -> Cmd msg
authentication options =
    let
        body =
            Http.multipartBody
                [ Http.stringPart "username" options.user.email
                , Http.stringPart "password" options.user.password
                ]
    in
    Http.post
        { url = loginUrl
        , body = body
        , expect =
            Api.Data.expectJson options.onResponse
                (Json.field "user" decoder)
        }


registration :
    { user :
        { user
            | username : String
            , email : String
            , password : String
        }
    , onResponse : Data User -> msg
    }
    -> Cmd msg
registration options =
    let
        body : Json.Value
        body =
            Encode.object
                [ ( "user"
                  , Encode.object
                        [ ( "username", Encode.string options.user.username )
                        , ( "email", Encode.string options.user.email )
                        , ( "password", Encode.string options.user.password )
                        ]
                  )
                ]
    in
    Http.post
        { url = "https://conduit.productionready.io/api/users"
        , body = Http.jsonBody body
        , expect =
            Api.Data.expectJson options.onResponse
                (Json.field "user" decoder)
        }


current : { token : Token, onResponse : Data User -> msg } -> Cmd msg
current options =
    Api.Token.get (Just options.token)
        { url = "https://conduit.productionready.io/api/user"
        , expect =
            Api.Data.expectJson options.onResponse
                (Json.field "user" decoder)
        }


update :
    { token : Token
    , user :
        { user
            | username : String
            , email : String
            , password : Maybe String
        }
    , onResponse : Data User -> msg
    }
    -> Cmd msg
update options =
    let
        body : Json.Value
        body =
            Encode.object
                [ ( "user"
                  , Encode.object
                        (List.concat
                            [ [ ( "username", Encode.string options.user.username )
                              , ( "email", Encode.string options.user.email )
                              ]
                            , case options.user.password of
                                Just password ->
                                    [ ( "password", Encode.string password ) ]

                                Nothing ->
                                    []
                            ]
                        )
                  )
                ]
    in
    Api.Token.put (Just options.token)
        { url = "https://conduit.productionready.io/api/user"
        , body = Http.jsonBody body
        , expect =
            Api.Data.expectJson options.onResponse
                (Json.field "user" decoder)
        }
