module Pages.Top exposing (Model, Msg, Params, page)

import Bootstrap.CDN as CDN
import Bootstrap.Grid as Grid exposing (..)
import Html exposing (..)
import Spa.Document exposing (Document)
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)


type alias Params =
    ()


type alias Model =
    Url Params


type alias Msg =
    Never


page : Page Params Model Msg
page =
    Page.static
        { view = view
        }



-- VIEW


view : Url Params -> Document Msg
view { params } =
    { title = "Homepage"
    , body =
        [ Grid.container []
            -- Creates a div that centers content
            [ Grid.row []
                -- Creates a row with no options
                [ 
                --     Grid.col [] [ text "One of Three columns" ] -- Creates a column that by default automatically resizes for all media breakpoints
                -- , Grid.col [] [ text "One of Three columns" ]
                -- , Grid.col [] [ text "One of Three columns" ]
                ]
            ]
        ]
    }
