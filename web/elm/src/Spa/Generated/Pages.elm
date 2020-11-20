module Spa.Generated.Pages exposing
    ( Model
    , Msg
    , init
    , load
    , save
    , subscriptions
    , update
    , view
    )

import Pages.Top
import Pages.Login
import Pages.NotFound
import Pages.Projects
import Pages.Register
import Pages.Settings
import Pages.Profile.Username_String
import Shared
import Spa.Document as Document exposing (Document)
import Spa.Generated.Route as Route exposing (Route)
import Spa.Page exposing (Page)
import Spa.Url as Url


-- TYPES


type Model
    = Top__Model Pages.Top.Model
    | Login__Model Pages.Login.Model
    | NotFound__Model Pages.NotFound.Model
    | Projects__Model Pages.Projects.Model
    | Register__Model Pages.Register.Model
    | Settings__Model Pages.Settings.Model
    | Profile__Username_String__Model Pages.Profile.Username_String.Model


type Msg
    = Top__Msg Pages.Top.Msg
    | Login__Msg Pages.Login.Msg
    | NotFound__Msg Pages.NotFound.Msg
    | Projects__Msg Pages.Projects.Msg
    | Register__Msg Pages.Register.Msg
    | Settings__Msg Pages.Settings.Msg
    | Profile__Username_String__Msg Pages.Profile.Username_String.Msg



-- INIT


init : Route -> Shared.Model -> ( Model, Cmd Msg )
init route =
    case route of
        Route.Top ->
            pages.top.init ()
        
        Route.Login ->
            pages.login.init ()
        
        Route.NotFound ->
            pages.notFound.init ()
        
        Route.Projects ->
            pages.projects.init ()
        
        Route.Register ->
            pages.register.init ()
        
        Route.Settings ->
            pages.settings.init ()
        
        Route.Profile__Username_String params ->
            pages.profile__username_string.init params



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update bigMsg bigModel =
    case ( bigMsg, bigModel ) of
        ( Top__Msg msg, Top__Model model ) ->
            pages.top.update msg model
        
        ( Login__Msg msg, Login__Model model ) ->
            pages.login.update msg model
        
        ( NotFound__Msg msg, NotFound__Model model ) ->
            pages.notFound.update msg model
        
        ( Projects__Msg msg, Projects__Model model ) ->
            pages.projects.update msg model
        
        ( Register__Msg msg, Register__Model model ) ->
            pages.register.update msg model
        
        ( Settings__Msg msg, Settings__Model model ) ->
            pages.settings.update msg model
        
        ( Profile__Username_String__Msg msg, Profile__Username_String__Model model ) ->
            pages.profile__username_string.update msg model
        
        _ ->
            ( bigModel, Cmd.none )



-- BUNDLE - (view + subscriptions)


bundle : Model -> Bundle
bundle bigModel =
    case bigModel of
        Top__Model model ->
            pages.top.bundle model
        
        Login__Model model ->
            pages.login.bundle model
        
        NotFound__Model model ->
            pages.notFound.bundle model
        
        Projects__Model model ->
            pages.projects.bundle model
        
        Register__Model model ->
            pages.register.bundle model
        
        Settings__Model model ->
            pages.settings.bundle model
        
        Profile__Username_String__Model model ->
            pages.profile__username_string.bundle model


view : Model -> Document Msg
view =
    bundle >> .view


subscriptions : Model -> Sub Msg
subscriptions =
    bundle >> .subscriptions


save : Model -> Shared.Model -> Shared.Model
save =
    bundle >> .save


load : Model -> Shared.Model -> ( Model, Cmd Msg )
load =
    bundle >> .load



-- UPGRADING PAGES


type alias Upgraded params model msg =
    { init : params -> Shared.Model -> ( Model, Cmd Msg )
    , update : msg -> model -> ( Model, Cmd Msg )
    , bundle : model -> Bundle
    }


type alias Bundle =
    { view : Document Msg
    , subscriptions : Sub Msg
    , save : Shared.Model -> Shared.Model
    , load : Shared.Model -> ( Model, Cmd Msg )
    }


upgrade : (model -> Model) -> (msg -> Msg) -> Page params model msg -> Upgraded params model msg
upgrade toModel toMsg page =
    let
        init_ params shared =
            page.init shared (Url.create params shared.key shared.url) |> Tuple.mapBoth toModel (Cmd.map toMsg)

        update_ msg model =
            page.update msg model |> Tuple.mapBoth toModel (Cmd.map toMsg)

        bundle_ model =
            { view = page.view model |> Document.map toMsg
            , subscriptions = page.subscriptions model |> Sub.map toMsg
            , save = page.save model
            , load = load_ model
            }

        load_ model shared =
            page.load shared model |> Tuple.mapBoth toModel (Cmd.map toMsg)
    in
    { init = init_
    , update = update_
    , bundle = bundle_
    }


pages :
    { top : Upgraded Pages.Top.Params Pages.Top.Model Pages.Top.Msg
    , login : Upgraded Pages.Login.Params Pages.Login.Model Pages.Login.Msg
    , notFound : Upgraded Pages.NotFound.Params Pages.NotFound.Model Pages.NotFound.Msg
    , projects : Upgraded Pages.Projects.Params Pages.Projects.Model Pages.Projects.Msg
    , register : Upgraded Pages.Register.Params Pages.Register.Model Pages.Register.Msg
    , settings : Upgraded Pages.Settings.Params Pages.Settings.Model Pages.Settings.Msg
    , profile__username_string : Upgraded Pages.Profile.Username_String.Params Pages.Profile.Username_String.Model Pages.Profile.Username_String.Msg
    }
pages =
    { top = Pages.Top.page |> upgrade Top__Model Top__Msg
    , login = Pages.Login.page |> upgrade Login__Model Login__Msg
    , notFound = Pages.NotFound.page |> upgrade NotFound__Model NotFound__Msg
    , projects = Pages.Projects.page |> upgrade Projects__Model Projects__Msg
    , register = Pages.Register.page |> upgrade Register__Model Register__Msg
    , settings = Pages.Settings.page |> upgrade Settings__Model Settings__Msg
    , profile__username_string = Pages.Profile.Username_String.page |> upgrade Profile__Username_String__Model Profile__Username_String__Msg
    }