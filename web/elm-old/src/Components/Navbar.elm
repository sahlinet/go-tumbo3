module Components.Navbar exposing (view)

import Html exposing (..)
import Html.Attributes exposing (class, href, rel, style, target)
import Spa.Generated.Route as Route


view : Html msg
view =
    header [ class "navbar" ]
        [ a [ class "navbar-brand", href (Route.toString Route.Top), style "color" "#FF5733" ] [ text "Tumbo" ]
        , a [ class "navbar-right navbar-link", href "/login" ] [ text "Login" ]
        , a [ target "blank", href "https://github.com/sahlinet/go-tumbo3" ] [ i [ class "fa fa-github", style "color" "black" ] [] ]
        ]
