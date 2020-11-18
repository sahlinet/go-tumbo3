module Pages.ExamplePage exposing (Model, Msg, Params, page)

import Bootstrap.Alert exposing (simplePrimary)
import Bootstrap.CDN as CDN
import Bootstrap.Grid as Grid exposing (..)
import Html exposing (Html, button, div, header, text)
import Html.Events exposing (onClick)
import Spa.Document exposing (Document)
import Spa.Page as Page exposing (Page)
import Spa.Url as Url exposing (Url)


type Msg
    = Increment
    | Decrement


page : Page Params Model Msg
page =
    Page.static
        { view = view
        }


type alias Model =
    Url Params



-- type alias Msg =
--     Never
-- VIEW


type alias Params =
    ()


view : Url Params -> Document Msg
view { params } =
    { title = "ExamplePage"
    , body =
        [ Grid.container []
            -- Creates a div that centers content
            [ Grid.row []
                -- Creates a row with no options
                [ Grid.col [] [ text "One of Three columns" ] -- Creates a column that by default automatically resizes for all media breakpoints
                , Grid.col [] [ text "One of Three columns" ]
                , Grid.col [] [ text "One of Three columns" ]
                ]
            ]
        ]
    }
