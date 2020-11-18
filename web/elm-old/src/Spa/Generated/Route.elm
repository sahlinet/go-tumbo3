module Spa.Generated.Route exposing
    ( Route(..)
    , fromUrl
    , toString
    )

import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser)


type Route
    = Top
    | ExamplePage
    | Login
    | NotFound
    | Register


fromUrl : Url -> Maybe Route
fromUrl =
    Parser.parse routes


routes : Parser (Route -> a) a
routes =
    Parser.oneOf
        [ Parser.map Top Parser.top
        , Parser.map ExamplePage (Parser.s "example-page")
        , Parser.map Login (Parser.s "login")
        , Parser.map NotFound (Parser.s "not-found")
        , Parser.map Register (Parser.s "register")
        ]


toString : Route -> String
toString route =
    let
        segments : List String
        segments =
            case route of
                Top ->
                    []
                
                ExamplePage ->
                    [ "example-page" ]
                
                Login ->
                    [ "login" ]
                
                NotFound ->
                    [ "not-found" ]
                
                Register ->
                    [ "register" ]
    in
    segments
        |> String.join "/"
        |> String.append "/"