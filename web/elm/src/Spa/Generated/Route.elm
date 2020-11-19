module Spa.Generated.Route exposing
    ( Route(..)
    , fromUrl
    , toString
    )

import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser)


type Route
    = Top
    | Login
    | NotFound
    | Projects
    | Register
    | Settings
    | Profile__Username_String { username : String }


fromUrl : Url -> Maybe Route
fromUrl =
    Parser.parse routes


routes : Parser (Route -> a) a
routes =
    Parser.oneOf
        [ Parser.map Top Parser.top
        , Parser.map Login (Parser.s "login")
        , Parser.map NotFound (Parser.s "not-found")
        , Parser.map Projects (Parser.s "projects")
        , Parser.map Register (Parser.s "register")
        , Parser.map Settings (Parser.s "settings")
        , (Parser.s "profile" </> Parser.string)
          |> Parser.map (\username -> { username = username })
          |> Parser.map Profile__Username_String
        ]


toString : Route -> String
toString route =
    let
        segments : List String
        segments =
            case route of
                Top ->
                    []
                
                Login ->
                    [ "login" ]
                
                NotFound ->
                    [ "not-found" ]
                
                Projects ->
                    [ "projects" ]
                
                Register ->
                    [ "register" ]
                
                Settings ->
                    [ "settings" ]
                
                Profile__Username_String { username } ->
                    [ "profile", username ]
    in
    segments
        |> String.join "/"
        |> String.append "/"