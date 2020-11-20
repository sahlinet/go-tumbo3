module Pages.Projects exposing (Model, Msg, Params, page)

import Api.Data exposing (Data)
import Api.Project exposing (Project)
import Api.User exposing (User)
import Components.ProjectList
import Html exposing (..)
import Html.Attributes exposing (..)
import Shared
import Spa.Document exposing (Document)
import Spa.Page as Page exposing (Page)
import Spa.Url as Url exposing (Url)
import String exposing (contains)


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
    --, tags : Data (List Tag)
    --, activeTab : Tab
    }


init : Shared.Model -> Url Params -> ( Model, Cmd Msg )
init shared _ =
    let
        model : Model
        model =
            { user = shared.user
            , listing = Api.Data.Loading
            }
    in
    ( model
    , Cmd.batch
        [ fetchProjects model shared.url.host
        ]
    )


makeUrl : String -> String
makeUrl host =
    if contains "localhost" host then
        "http://localhost:8000"

    else
        ""


fetchProjects :
    { model
        | user : Maybe User
    }
    -> String
    -> Cmd Msg
fetchProjects model host =
    Api.Project.list
        { token = Maybe.map .token model.user
        , onResponse = GotProjects
        , urlPrefix = makeUrl host
        }



-- UPDATE


type Msg
    = GotProjects (Data (List Api.Project.Project))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotProjects listing ->
            ( { model | listing = listing }
            , Cmd.none
            )


save : Model -> Shared.Model -> Shared.Model
save model shared =
    shared


load : Shared.Model -> Model -> ( Model, Cmd Msg )
load shared model =
    ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Document Msg
view model =
    { title = "Projects"
    , body =
        [ div [ class "container" ]
            [ h1 []
                [ text "Projects" ]
            , div [ class "col-md-9" ]
                [ Components.ProjectList.view
                    { user = model.user
                    , projectListing = model.listing
                    }
                ]
            ]
        ]
    }
