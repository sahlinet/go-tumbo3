module Pages.Top exposing (Model, Msg, Params, page)

import Api.Article.Tag exposing (Tag)
import Api.Data exposing (Data)
import Api.Project exposing (Project)
import Api.User exposing (User)
import Html exposing (..)
import Html.Attributes exposing (class, classList)
import Html.Events as Events
import Shared
import Spa.Document exposing (Document)
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)
import Utils.Maybe


page : Page Params Model Msg
page =
    Page.application
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        , save = save
        , load = load
        }



-- INIT


type alias Params =
    ()


type alias Model =
    { user : Maybe User
    , listing : Data (List Api.Project.Project)

    --, page : Int
    , tags : Data (List Tag)
    , activeTab : Tab
    }


type Tab
    = FeedFor User
    | Global
    | TagFilter Tag


init : Shared.Model -> Url Params -> ( Model, Cmd Msg )
init shared _ =
    let
        activeTab : Tab
        activeTab =
            shared.user
                |> Maybe.map FeedFor
                |> Maybe.withDefault Global

        model : Model
        model =
            { user = shared.user
            , listing = Api.Data.Loading

            --  , page = 1
            , tags = Api.Data.Loading
            , activeTab = activeTab
            }
    in
    ( model
    , Cmd.batch
        [--fetchProjects model
         --  , Api.Article.Tag.list { onResponse = GotTags }
        ]
    )


type Msg
    = GotArticles (Data (List Api.Project.Project))
    | GotTags (Data (List Tag))
    | SelectedTab Tab


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


save : Model -> Shared.Model -> Shared.Model
save _ shared =
    shared


load : Shared.Model -> Model -> ( Model, Cmd Msg )
load _ model =
    ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Document Msg
view model =
    { title = ""
    , body =
        [ div [ class "home-page" ]
            [ div [ class "banner" ]
                [ div [ class "container" ]
                    []
                ]
            , div [ class "container page" ]
                [ div [ class "row" ]
                    [ div [ class "col-md-9" ]
                        []
                    ]
                ]
            ]
        ]
    }
