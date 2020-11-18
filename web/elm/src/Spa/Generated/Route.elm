module Spa.Generated.Route exposing
    ( Route(..)
    , fromUrl
    , toString
    )

import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser)


type Route
    = Top
    | Editor
    | Login
    | NotFound
    | Register
    | Settings
    | Article__Slug_String { slug : String }
    | Editor__ArticleSlug_String { articleSlug : String }
    | Profile__Username_String { username : String }


fromUrl : Url -> Maybe Route
fromUrl =
    Parser.parse routes


routes : Parser (Route -> a) a
routes =
    Parser.oneOf
        [ Parser.map Top Parser.top
        , Parser.map Editor (Parser.s "editor")
        , Parser.map Login (Parser.s "login")
        , Parser.map NotFound (Parser.s "not-found")
        , Parser.map Register (Parser.s "register")
        , Parser.map Settings (Parser.s "settings")
        , (Parser.s "article" </> Parser.string)
          |> Parser.map (\slug -> { slug = slug })
          |> Parser.map Article__Slug_String
        , (Parser.s "editor" </> Parser.string)
          |> Parser.map (\articleSlug -> { articleSlug = articleSlug })
          |> Parser.map Editor__ArticleSlug_String
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
                
                Editor ->
                    [ "editor" ]
                
                Login ->
                    [ "login" ]
                
                NotFound ->
                    [ "not-found" ]
                
                Register ->
                    [ "register" ]
                
                Settings ->
                    [ "settings" ]
                
                Article__Slug_String { slug } ->
                    [ "article", slug ]
                
                Editor__ArticleSlug_String { articleSlug } ->
                    [ "editor", articleSlug ]
                
                Profile__Username_String { username } ->
                    [ "profile", username ]
    in
    segments
        |> String.join "/"
        |> String.append "/"