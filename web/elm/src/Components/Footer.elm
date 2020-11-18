module Components.Footer exposing (view)

import Html exposing (..)
import Html.Attributes exposing (class, href)


view : Html msg
view =
    Html.footer [ class "footer" ]
        [ div [ class "container text-center" ]
            [ span [ class "text-muted" ]
                [ text "© 2020 Copyright sahli.net"
                ]
            ]
        ]
