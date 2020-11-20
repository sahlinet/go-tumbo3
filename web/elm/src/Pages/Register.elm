module Pages.Register exposing (Model, Msg, Params, page)

import Api.Data exposing (Data)
import Api.User exposing (User)
import Browser.Navigation exposing (Key)
import Components.UserForm
import Html exposing (..)
import Ports
import Shared
import Spa.Document exposing (Document)
import Spa.Generated.Route as Route
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)
import Utils.Route


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
    { user : Data User
    , key : Key
    , username : String
    , email : String
    , password : String
    }


init : Shared.Model -> Url Params -> ( Model, Cmd Msg )
init shared { key } =
    ( Model
        (case shared.user of
            Just user ->
                Api.Data.Success user

            Nothing ->
                Api.Data.NotAsked
        )
        key
        ""
        ""
        ""
    , Cmd.none
    )



-- UPDATE


type Msg
    = Updated Field String
    | AttemptedSignUp
    | GotUser (Data User)


type Field
    = Username
    | Email
    | Password


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Updated Username username ->
            ( { model | username = username }
            , Cmd.none
            )

        Updated Email email ->
            ( { model | email = email }
            , Cmd.none
            )

        Updated Password password ->
            ( { model | password = password }
            , Cmd.none
            )

        AttemptedSignUp ->
            ( model
            , Api.User.registration
                { user =
                    { username = model.username
                    , email = model.email
                    , password = model.password
                    }
                , onResponse = GotUser
                }
            )

        GotUser user ->
            ( { model | user = user }
            , case Api.Data.toMaybe user of
                Just user_ ->
                    Cmd.batch
                        [ Ports.saveUser user_
                        , Utils.Route.navigate model.key Route.Top
                        ]

                Nothing ->
                    Cmd.none
            )


save : Model -> Shared.Model -> Shared.Model
save model shared =
    { shared
        | user =
            case Api.Data.toMaybe model.user of
                Just user ->
                    Just user

                Nothing ->
                    shared.user
    }


load : Shared.Model -> Model -> ( Model, Cmd Msg )
load _ model =
    ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Document Msg
view model =
    { title = "Sign up"
    , body =
        [ Components.UserForm.view
            { user = model.user
            , label = "Sign up"
            , onFormSubmit = AttemptedSignUp
            , alternateLink = { label = "Have an account?", route = Route.Login }
            , fields =
                [ { label = "Your Name"
                  , type_ = "text"
                  , value = model.username
                  , onInput = Updated Username
                  }
                , { label = "Email"
                  , type_ = "email"
                  , value = model.email
                  , onInput = Updated Email
                  }
                , { label = "Password"
                  , type_ = "password"
                  , value = model.password
                  , onInput = Updated Password
                  }
                ]
            }
        ]
    }
