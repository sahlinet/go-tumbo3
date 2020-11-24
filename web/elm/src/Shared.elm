module Shared exposing
    ( Flags
    , Model
    , Msg
    , init
    , subscriptions
    , update
    , view
    )

import Api.User exposing (User)
import Bootstrap.CDN as CDN
import Browser.Navigation exposing (Key)
import Components.Footer
import Components.Navbar
import Html exposing (..)
import Html.Attributes exposing (class, href, rel, style, target)
import Json.Decode as Json
import Ports
import Spa.Document exposing (Document)
import Url exposing (Url)
import Utils.Route



-- INIT


type alias Flags =
    Json.Value


type alias Model =
    { url : Url
    , key : Key
    , user : Maybe User
    }


init : Flags -> Url -> Key -> ( Model, Cmd Msg )
init json url key =
    let
        user =
            json
                |> Json.decodeValue (Json.field "user" Api.User.decoder)
                |> Result.toMaybe
    in
    ( Model url key user
    , Cmd.none
    )



-- UPDATE


type Msg
    = ClickedSignOut


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ClickedSignOut ->
            ( { model | user = Nothing }
            , Ports.clearUser
            )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


slogan : String
slogan =
    "Highly flexible Application Runtime Platform"


view :
    { page : Document msg, toMsg : Msg -> msg }
    -> Model
    -> Document msg
view { page, toMsg } model =
    { title =
        if String.isEmpty page.title then
            "Tumbo"

        else
            page.title ++ " | Tumbo"
    , body =
        [ node "link"
            [ rel "stylesheet"
            , href "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
            ]
            []
        , CDN.stylesheet
        , div [ class "layout" ]
            [ Components.Navbar.view
                { user = model.user
                , currentRoute = Utils.Route.fromUrl model.url
                , onSignOut = toMsg ClickedSignOut
                }
            , div [ class "jumbotron" ] [ text slogan ]
            , div [ class "page" ] page.body
            , Components.Footer.view
            ]
        ]
    }
