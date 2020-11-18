module Shared exposing
    ( Flags
    , Model
    , Msg
    , init
    , subscriptions
    , update
    , view
    )

import Array exposing (empty)
import Bootstrap.CDN as CDN
import Bootstrap.Navbar as Navbar
import Browser.Navigation exposing (Key)
import Components.Navbar as MyNavbar exposing (view)
import FontAwesome.Attributes as Icon
import FontAwesome.Brands as Icon
import FontAwesome.Icon as Icon exposing (..)
import FontAwesome.Layering as Icon
import FontAwesome.Solid as Icon
import FontAwesome.Styles as Icon
import FontAwesome.Svg as SvgIcon
import FontAwesome.Transforms as Icon
import Html exposing (..)
import Html.Attributes exposing (class, href, rel, style, target)
import Html.Parser
import Html.Parser.Util
import Spa.Document exposing (Document)
import Spa.Generated.Route as Route
import Url exposing (Url)
import User exposing (..)



-- INIT


type alias Flags =
    ()


type alias Model =
    { url : Url
    , key : Key
    , email : String
    , token : String
    }


init : Flags -> Url -> Key -> ( Model, Cmd Msg )
init flags url key =
    ( Model url key "" ""
    , Cmd.none
    )



-- UPDATE


type Msg
    = SignIn String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SignIn token ->
            ( { model | token = token }
            , Cmd.none
            )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


slogan : String
slogan =
    "Highly flexible Application Runtime Platform"



-- VIEW


footer : String
footer =
    """<!-- Footer -->
<footer class=" page - footer font - small blue pt - 4 ">

  <!-- Footer Links -->
  <div class=" container - fluid text - center text - md - left ">

    <!-- Grid row -->
    <div class=" row ">

      <!-- Grid column -->
      <div class=" col - md - 6 mt - md - 0 mt - 3 ">

        <!-- Content -->
        <h5 class=" text - uppercase ">Footer Content</h5>
        <p>Here you can use rows and columns to organize your footer content.</p>

      </div>
      <!-- Grid column -->

      <hr class=" clearfix w - 100 d - md - none pb - 3 ">

      <!-- Grid column -->
      <div class=" col - md - 3 mb - md - 0 mb - 3 ">

        <!-- Links -->
        <h5 class=" text - uppercase ">Links</h5>

        <ul class=" list - unstyled ">
          <li>
            <a href=" #! ">Link 1</a>
          </li>
          <li>
            <a href=" #! ">Link 2</a>
          </li>
          <li>
            <a href=" #! ">Link 3</a>
          </li>
          <li>
            <a href=" #! ">Link 4</a>
          </li>
        </ul>

      </div>
      <!-- Grid column -->

      <!-- Grid column -->
      <div class=" col - md - 3 mb - md - 0 mb - 3 ">

        <!-- Links -->
        <h5 class=" text - uppercase ">Links</h5>

        <ul class=" list - unstyled ">
          <li>
            <a href=" #! ">Link 1</a>
          </li>
          <li>
            <a href=" #! ">Link 2</a>
          </li>
          <li>
            <a href=" #! ">Link 3</a>
          </li>
          <li>
            <a href=" #! ">Link 4</a>
          </li>
        </ul>

      </div>
      <!-- Grid column -->

    </div>
    <!-- Grid row -->

  </div>
  <!-- Footer Links -->
"""


view :
    { page : Document msg
    , toMsg : Msg -> msg
    }
    -> Model
    -> Document msg
view { page, toMsg } model =
    { title = page.title
    , body =
        [ node "link"
            [ rel "stylesheet"
            , href "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
            ]
            []
        , CDN.stylesheet

        {-
           [ header [ class "navbar" ]
               [ a [ class "navbar-brand", href (Route.toString Route.Top), style "color" "#FF5733" ] [ text "Tumbo" ]
               , a [ class "navbar-right navbar-link", href "/login" ] [ text "Login" ]
               , a [ class "navbar-right navbar-link", href "/logout" ]
                   [ text
                       (if isLoggedIn model then
                           "Logout"

                        else
                           "Login"
                       )
                   ]
               , a [ target "blank", href "https://github.com/sahlinet/go-tumbo3" ] [ i [ class "fa fa-github", style "color" "black" ] [] ]
               ]
        -}
        , MyNavbar.view
        , div [ class "jumbotron" ] [ text slogan ]
        , div [ class "page" ] page.body
        , Html.footer [ class "footer" ]
            [ div [ class "container text-center" ]
                [ span [ class "text-muted" ]
                    [ text "© 2020 Copyright sahli.net"
                    ]
                ]
            ]
        ]
    }


textHtml : String -> List (Html.Html msg)
textHtml t =
    case Html.Parser.run t of
        Ok nodes ->
            Html.Parser.Util.toVirtualDom nodes

        Err _ ->
            []


isLoggedIn : Model -> Bool
isLoggedIn model =
    if String.length model.token > 0 then
        True

    else
        False
