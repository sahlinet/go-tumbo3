module Components.ProjectList exposing (view)

import Api.Data exposing (Data)
import Api.Project exposing (Project)
import Api.User exposing (User)
import Components.IconButton as IconButton
import Html exposing (..)
import Html.Attributes exposing (alt, class, classList, href, src)
import Html.Events as Events
import Utils.Maybe
import Utils.Time


view :
    { user : Maybe User
    , projectListing : Data (List Api.Project.Project)
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


viewProject : Project -> Html msg
viewProject listing =
    div [] [ a [] [ text listing.description ] ]
