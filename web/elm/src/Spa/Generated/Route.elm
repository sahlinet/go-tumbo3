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
    | NotFound


fromUrl : Url -> Maybe Route
fromUrl =
    Parser.parse routes


routes : Parser (Route -> a) a
routes =
    Parser.oneOf
        [ Parser.map Top Parser.top
        , Parser.map ExamplePage (Parser.s "example-page")
        , Parser.map NotFound (Parser.s "not-found")
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
                
                NotFound ->
                    [ "not-found" ]
    in
    segments
        |> String.join "/"
        |> String.append "/"