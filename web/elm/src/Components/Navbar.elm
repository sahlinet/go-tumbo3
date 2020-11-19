module Components.Navbar exposing (view)

import Api.User exposing (User)
import Html exposing (..)
import Html.Attributes exposing (class, classList, href, id, property, style, target, type_)
import Html.Events as Events
import Json.Encode as Json
import Spa.Generated.Route as Route exposing (Route)


view :
    { user : Maybe User
    , currentRoute : Route
    , onSignOut : msg
    }
    -> Html msg
view options =
    nav [ class "navbar navbar-expand-lg  navbar-light" ]
        [ a [ class "navbar-brand", href (Route.toString Route.Top), style "color" "#FF5733" ] [ text "Tumbo" ]
        , button [ class "navbar-toggler", type_ "button", dataToggle "collapse", dataTarget "#navbarTogglerDemo02", ariaControls "navbarTogglerDemo02", ariaExpanded "false", ariaLabel "Toggle navigation" ]
            [ span [ class "navbar-toggler-icon" ] []
            ]
        , div [ class "collapse navbar-collapse", id "navbarTogglerDemo02" ]
            [ ul [ class "nav navbar-nav ml-auto" ] <|
                case options.user of
                    Just _ ->
                        List.concat
                            [ List.map (viewLink options.currentRoute) <|
                                [ ( "Home", Route.Top )
                                , ( "Projects", Route.Projects )
                                , ( "Settings", Route.Settings )
                                ]
                            , [ li [ class "nav-item" ]
                                    [ a
                                        [ class "nav-link"
                                        , Events.onClick options.onSignOut
                                        ]
                                        [ text "Sign out" ]
                                    ]
                              ]
                            ]

                    Nothing ->
                        List.map (viewLink options.currentRoute) <|
                            [ ( "Home", Route.Top )
                            , ( "Sign in", Route.Login )
                            , ( "Sign up", Route.Register )
                            ]
            , a [ target "blank", href "https://github.com/sahlinet/go-tumbo3" ] [ i [ class "fa fa-github", style "color" "black" ] [] ]
            ]
        ]


viewLink : Route -> ( String, Route ) -> Html msg
viewLink currentRoute ( label, route ) =
    li [ class "nav-item" ]
        [ a
            [ class "nav-link"
            , classList [ ( "active", currentRoute == route ) ]
            , href (Route.toString route)
            ]
            [ text label ]
        ]


stringProperty : String -> String -> Attribute msg
stringProperty name string =
    property name (Json.string string)


dataToggle : String -> Attribute msg
dataToggle value =
    stringProperty "data-toggle" value


dataTarget : String -> Attribute msg
dataTarget value =
    stringProperty "data-target" value


ariaControls : String -> Attribute msg
ariaControls value =
    stringProperty "aria-controls" value


ariaExpanded : String -> Attribute msg
ariaExpanded value =
    stringProperty "aria-expanded" value


ariaLabel : String -> Attribute msg
ariaLabel value =
    stringProperty "aria-label" value
