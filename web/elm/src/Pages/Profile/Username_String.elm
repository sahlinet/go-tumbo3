module Pages.Profile.Username_String exposing (Model, Msg, Params, page)

import Api.Article.Filters as Filters
import Api.Data exposing (Data)
import Api.Profile exposing (Profile)
import Api.Project exposing (Project)
import Api.Token exposing (Token)
import Api.User exposing (User)
import Components.IconButton as IconButton
import Components.NotFound
import Components.ProjectList
import Html exposing (..)
import Html.Attributes exposing (class, classList, src)
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
    { username : String }


type alias Model =
    { username : String
    , user : Maybe User
    , profile : Data Profile
    , listing : Data (List Api.Project.Project)
    , selectedTab : Tab
    , page : Int
    }


type Tab
    = MyArticles
    | FavoritedArticles


init : Shared.Model -> Url Params -> ( Model, Cmd Msg )
init shared { params } =
    let
        token : Maybe Token
        token =
            Maybe.map .token shared.user
    in
    ( { username = params.username
      , user = shared.user
      , profile = Api.Data.Loading
      , listing = Api.Data.Loading
      , selectedTab = MyArticles
      , page = 1
      }
    , Cmd.batch
        [ Api.Profile.get
            { token = token
            , username = params.username
            , onResponse = GotProfile
            }
        ]
    )



-- UPDATE


type Msg
    = GotProfile (Data Profile)
    | GotArticles (Data (List Api.Project.Project))
    | Clicked Tab
    | ClickedPage Int


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model
    , Cmd.none
    )


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
    { title = "Profile"
    , body =
        case model.profile of
            Api.Data.Success profile ->
                [ viewProfile profile model ]

            Api.Data.Failure _ ->
                [ Components.NotFound.view ]

            _ ->
                []
    }


viewProfile : Profile -> Model -> Html Msg
viewProfile profile model =
    let
        isViewingOwnProfile : Bool
        isViewingOwnProfile =
            Maybe.map .username model.user == Just profile.username

        viewTabRow : Html Msg
        viewTabRow =
            div [ class "articles-toggle" ]
                [ ul [ class "nav nav-pills outline-active" ]
                    (List.map viewTab [ MyArticles, FavoritedArticles ])
                ]

        viewTab : Tab -> Html Msg
        viewTab tab =
            li [ class "nav-item" ]
                [ button
                    [ class "nav-link"
                    , Events.onClick (Clicked tab)
                    , classList [ ( "active", tab == model.selectedTab ) ]
                    ]
                    [ text
                        (case tab of
                            MyArticles ->
                                "My Articles"

                            FavoritedArticles ->
                                "Favorited Articles"
                        )
                    ]
                ]
    in
    div [ class "profile-page" ]
        [ div [ class "container" ]
            [ div [ class "row" ]
                []
            ]
        ]
