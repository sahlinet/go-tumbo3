module Pages.Login exposing (Model, Msg, Params, page)

import Debug
import Html exposing (Attribute, button, div, form, h1, input, label, small, text)
import Html.Attributes exposing (attribute, autofocus, class, for, id, placeholder, required, src, type_)
import Html.Events exposing (onClick, onSubmit, stopPropagationOn)
import Http
import Json.Decode as Json exposing (Decoder, field, string, succeed)
import Shared
import Spa.Document exposing (Document)
import Spa.Generated.Route as GeneratedRoute
import Spa.Page as Page exposing (Page)
import Spa.Url as Url exposing (Url)
import User exposing (User, emptyUser)
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
    { email : String
    , password : String
    , token : String
    }


init : Shared.Model -> Url Params -> ( Model, Cmd Msg )
init shared url =
    ( { email = ""
      , password = ""
      , token = ""
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = --   = SignIn
      GetTokenCompleted (Result Http.Error String)



--    | Uploaded


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        --        SignIn ->
        --           ( model, loginRequestCmd model loginUrl )
        GetTokenCompleted result ->
            getTokenCompleted model result



--                ( { model | response = Nothing }
--                , loginRequest model
--                )
--        Uploaded ->
--            Result Http.Error ()


getTokenCompleted : Model -> Result Http.Error String -> ( Model, Cmd Msg )
getTokenCompleted model result =
    case result of
        Ok newToken ->
            ( { model | token = newToken, password = "" } |> Debug.log "got new token", Cmd.none )

        Err error ->
            --( model |> Debug.log "error", Cmd.none )
            --( model |> Debug.log "error", afterLoginRedirectCmd model.key GeneratedRoute.Top )
            ( model |> Debug.log "error", Cmd.none )


save : Model -> Shared.Model -> Shared.Model
save model shared =
    shared


load : Shared.Model -> Model -> ( Model, Cmd Msg )
load shared model =
    ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



--loginRequest : Model -> Http.Request String


loginRequestCmd : Model -> String -> Cmd Msg
loginRequestCmd model apiUrl =
    let
        body =
            Http.multipartBody
                [ Http.stringPart "username" "user1"
                , Http.stringPart "password" "password"
                ]
    in
    --Http.post (Json.maybe Json.string) "/auth" body
    Http.post
        { url = loginUrl
        , body = body
        , expect = Http.expectJson GetTokenCompleted responseDecoder
        }


afterLoginRedirectCmd : String -> Url Params -> Cmd Msg
afterLoginRedirectCmd key url =
    --Utils.Route.navigate url.key GeneratedRoute.Top
    Utils.Route.navigate url.key GeneratedRoute.Top


loginUrl : String
loginUrl =
    --"/auth"
    "http://localhost:8000/auth"


responseDecoder : Decoder String
responseDecoder =
    field "token" string



--       |> Task.map ServerResponse
--       |> flip Task.onError (Task.succeed << Fail)
--       |> Fx.task}
-- VIEW
{-
   <form class="form-signin">
         <img class="mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
         <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
         <label for="inputEmail" class="sr-only">Email address</label>
         <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
         <label for="inputPassword" class="sr-only">Password</label>
         <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
         <div class="checkbox mb-3">
           <label>
             <input type="checkbox" value="remember-me"> Remember me
           </label>
         </div>
         <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
         <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
       </form>
-}


view : Model -> Document Msg
view model =
    { title = "Login"
    , body =
        [ div [ class "container" ]
            [ div [ class "row justify-content-center" ]
                [ div [ class "col-3" ]
                    {-
                           [ form [ class "form-signin, text-center" ]
                               [ h1 [ class "h3 mb-3 font-weight-normal" ] [ text "Sign in" ]
                               , label [ for "inputEmail", class "sr-only" ] [ text "Email address" ]
                               , input [ type_ "email", id "inputEmail", class "form-control", placeholder "Email Address", required True, autofocus True ] []
                               , label [ for "inputPassword", class "sr-only" ] [ text "Password" ]
                               , input [ type_ "password", id "inputPassword", class "form-control", placeholder "Password", required True ] []
                               , button [ class "btn btn-lg btn-primary btn-block" ] [ text "Sign In" ]
                               ]
                           ]
                       ]
                    -}
                    [ h1 [ class "h3 mb-3 font-weight-normal" ] [ text "Sign in" ]
                    , div []
                        [ div [ class "form-group" ]
                            [ label [ for "exampleInputEmail1" ]
                                [ text "Email address" ]
                            , input [ attribute "aria-describedby" "emailHelp", class "form-control", id "exampleInputEmail1", placeholder "Enter email", type_ "email" ]
                                []

                            --, small [ class "form-text text-muted", id "emailHelp" ]
                            --[ text "We'll never share your email with anyone else." ]
                            ]
                        , div [ class "form-group" ]
                            [ label [ for "exampleInputPassword1" ]
                                [ text "Password" ]
                            , input [ class "form-control", id "exampleInputPassword1", placeholder "Password", type_ "password" ]
                                []
                            ]

                        --, div [ class "form-check" ]
                        --   [ input [ class "form-check-input", id "exampleCheck1", type_ "checkbox" ]
                        --   []
                        --, label [ class "form-check-label", for "exampleCheck1" ]
                        --    [ text "Check me out" ]
                        --    ]
                        , button [ class "btn-primary", onClick SignIn ]
                            [ text "Sign in" ]
                        ]
                    ]
                ]
            ]
        ]
    }



{-
   onClickWithPreventDefault : msg -> Attribute msg
   onClickWithPreventDefault msg =
       stopPropagationOn "click" ( Json.succeed, msg )
-}
