module Components.ProjectList exposing (view)

import Api.Data exposing (Data)
import Api.Project exposing (Project)
import Api.User exposing (User)
import Components.IconButton as IconButton
import Html exposing (..)
import Html.Attributes exposing (alt, attribute, class, classList, href, src, type_)
import Html.Events exposing (onClick)
import Utils.Maybe
import Utils.Time


view :
    { user : Maybe User
    , projectListing : Data (List Api.Project.Project)

    --, onStart : msg
    }
    -> Html msg
view options =
    case options.projectListing of
        Api.Data.NotAsked ->
            div [] []

        Api.Data.Failure _ ->
            div [] []

        Api.Data.Loading ->
            div [ class "project-preview" ] [ text "Loading..." ]

        Api.Data.Success listing ->
            div [ class "listings" ]
                (List.map viewProject listing)



--(List.map (\x -> viewProject { project = x, onStart = options.onStart }) listing)


viewProject :
    --{ project : Project
    --, onStart : msg
    --}
    ---> Html msg
    Project -> Html msg



--viewProject options =


viewProject listing =
    div [ class "highlight col-md-4" ]
        [ h5 []
            [ text listing.name ]
        , button [ class "btn btn-outline-secondary btn-xs pull-right", type_ "button" ]
            --, button [ class "btn btn-outline-secondary btn-xs pull-right", type_ "button", onClick options.onStart ]
            [ text "Start" ]
        , p [] [ text listing.description ]
        , span [ class "badge badge-pill badge-secondary" ]
            [ text listing.state ]
        ]
