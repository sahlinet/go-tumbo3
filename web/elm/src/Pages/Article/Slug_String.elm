module Pages.Article.Slug_String exposing (Model, Msg, Params, page)

import Api.Article exposing (Article)
import Api.Article.Comment exposing (Comment)
import Api.Data exposing (Data)
import Api.Profile exposing (Profile)
import Api.User exposing (User)
import Browser.Navigation exposing (Key)
import Components.IconButton as IconButton
import Html exposing (..)
import Html.Attributes exposing (attribute, class, href, placeholder, src, value)
import Html.Events as Events
import Markdown
import Shared
import Spa.Document exposing (Document)
import Spa.Generated.Route as Route
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)
import Utils.Maybe
import Utils.Route
import Utils.Time


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
    { slug : String
    }


type alias Model =
    { key : Key
    , article : Data Article
    , comments : Data (List Comment)
    , user : Maybe User
    , commentText : String
    }


init : Shared.Model -> Url Params -> ( Model, Cmd Msg )
init shared { params } =
    ( { key = shared.key
      , article = Api.Data.Loading
      , comments = Api.Data.Loading
      , user = shared.user
      , commentText = ""
      }
    , Cmd.batch
        [ Api.Article.get
            { slug = params.slug
            , token = shared.user |> Maybe.map .token
            , onResponse = GotArticle
            }
        , Api.Article.Comment.get
            { token = shared.user |> Maybe.map .token
            , articleSlug = params.slug
            , onResponse = GotComments
            }
        ]
    )



-- UPDATE


type Msg
    = GotArticle (Data Article)
    | ClickedFavorite User Article
    | ClickedUnfavorite User Article
    | ClickedDeleteArticle User Article
    | DeletedArticle (Data Article)
    | GotAuthor (Data Profile)
    | ClickedFollow User Profile
    | ClickedUnfollow User Profile
    | GotComments (Data (List Comment))
    | ClickedDeleteComment User Article Comment
    | DeletedComment (Data Int)
    | SubmittedCommentForm User Article
    | CreatedComment (Data Comment)
    | UpdatedCommentText String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotArticle article ->
            ( { model | article = article }
            , Cmd.none
            )

        ClickedFavorite user article ->
            ( model
            , Api.Article.favorite
                { token = user.token
                , slug = article.slug
                , onResponse = GotArticle
                }
            )

        ClickedUnfavorite user article ->
            ( model
            , Api.Article.unfavorite
                { token = user.token
                , slug = article.slug
                , onResponse = GotArticle
                }
            )

        ClickedDeleteArticle user article ->
            ( model
            , Api.Article.delete
                { token = user.token
                , slug = article.slug
                , onResponse = DeletedArticle
                }
            )

        DeletedArticle _ ->
            ( model
            , Utils.Route.navigate model.key Route.Top
            )

        GotAuthor profile ->
            let
                updateAuthor : Article -> Article
                updateAuthor article =
                    case profile of
                        Api.Data.Success author ->
                            { article | author = author }

                        _ ->
                            article
            in
            ( { model | article = Api.Data.map updateAuthor model.article }
            , Cmd.none
            )

        ClickedFollow user profile ->
            ( model
            , Api.Profile.follow
                { token = user.token
                , username = profile.username
                , onResponse = GotAuthor
                }
            )

        ClickedUnfollow user profile ->
            ( model
            , Api.Profile.unfollow
                { token = user.token
                , username = profile.username
                , onResponse = GotAuthor
                }
            )

        GotComments comments ->
            ( { model | comments = comments }
            , Cmd.none
            )

        UpdatedCommentText text ->
            ( { model | commentText = text }
            , Cmd.none
            )

        SubmittedCommentForm user article ->
            if String.isEmpty model.commentText then
                ( model, Cmd.none )

            else
                ( { model | commentText = "" }
                , Api.Article.Comment.create
                    { token = user.token
                    , articleSlug = article.slug
                    , comment = { body = model.commentText }
                    , onResponse = CreatedComment
                    }
                )

        CreatedComment comment ->
            ( case comment of
                Api.Data.Success c ->
                    { model | comments = Api.Data.map (\comments -> c :: comments) model.comments }

                _ ->
                    model
            , Cmd.none
            )

        ClickedDeleteComment user article comment ->
            ( model
            , Api.Article.Comment.delete
                { token = user.token
                , articleSlug = article.slug
                , commentId = comment.id
                , onResponse = DeletedComment
                }
            )

        DeletedComment id ->
            let
                removeComment : List Comment -> List Comment
                removeComment =
                    List.filter (\comment -> Api.Data.Success comment.id /= id)
            in
            ( { model | comments = Api.Data.map removeComment model.comments }
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
    case model.article of
        Api.Data.Success article ->
            { title = article.title
            , body = [ viewArticle model article ]
            }

        _ ->
            { title = "Article"
            , body = []
            }


viewArticle : Model -> Article -> Html Msg
viewArticle model article =
    div [ class "article-page" ]
        [ div [ class "banner" ]
            [ div [ class "container" ]
                [ h1 [] [ text article.title ]
                , viewArticleMeta model article
                ]
            ]
        , div [ class "container page" ]
            [ div [ class "row article-content" ]
                [ div [ class "col-md-12" ]
                    [ Markdown.toHtml [] article.body ]
                , if List.isEmpty article.tags then
                    text ""

                  else
                    ul [ class "tag-list" ]
                        (List.map
                            (\tag -> li [ class "tag-default tag-pill tag-outline" ] [ text tag ])
                            article.tags
                        )
                ]
            , hr [] []
            , div [ class "article-actions" ] [ viewArticleMeta model article ]
            , viewCommentSection model article
            ]
        ]


viewArticleMeta : Model -> Article -> Html Msg
viewArticleMeta model article =
    div [ class "article-meta" ] <|
        List.concat
            [ [ a [ href ("/profile/" ++ article.author.username) ]
                    [ img [] []
                    ]
              , div [ class "info" ]
                    [ a [ class "author", href ("/profile/" ++ article.author.username) ] [ text article.author.username ]
                    , span [ class "date" ] [ text (Utils.Time.formatDate article.createdAt) ]
                    ]
              ]
            , case model.user of
                Just user ->
                    viewControls article user

                Nothing ->
                    []
            ]


viewControls : Article -> User -> List (Html Msg)
viewControls article user =
    if article.author.username == user.username then
        [ a
            [ class "btn btn-outline-secondary btn-sm"
            , href ("/editor/" ++ article.slug)
            ]
            [ i [ class "ion-edit" ] []
            , text "Edit article"
            ]
        , IconButton.view
            { color = IconButton.OutlinedRed
            , icon = IconButton.Trash
            , label = "Delete article"
            , onClick = ClickedDeleteArticle user article
            }
        ]

    else
        [ if article.author.following then
            IconButton.view
                { color = IconButton.FilledGray
                , icon = IconButton.Plus
                , label = "Unfollow " ++ article.author.username
                , onClick = ClickedUnfollow user article.author
                }

          else
            IconButton.view
                { color = IconButton.OutlinedGray
                , icon = IconButton.Plus
                , label = "Follow " ++ article.author.username
                , onClick = ClickedFollow user article.author
                }
        , if article.favorited then
            IconButton.view
                { color = IconButton.FilledGreen
                , icon = IconButton.Heart
                , label = "Unfavorite Post (" ++ String.fromInt article.favoritesCount ++ ")"
                , onClick = ClickedUnfavorite user article
                }

          else
            IconButton.view
                { color = IconButton.OutlinedGreen
                , icon = IconButton.Heart
                , label = "Favorite Post (" ++ String.fromInt article.favoritesCount ++ ")"
                , onClick = ClickedFavorite user article
                }
        ]


viewCommentSection : Model -> Article -> Html Msg
viewCommentSection model article =
    div [ class "row" ]
        [ div [ class "col-xs-12 col-md-8 offset-md-2" ] <|
            List.concat
                [ case model.user of
                    Just user ->
                        [ viewCommentForm model user article ]

                    Nothing ->
                        []
                , case model.comments of
                    Api.Data.Success comments ->
                        List.map (viewComment model.user article) comments

                    _ ->
                        []
                ]
        ]


viewCommentForm : Model -> User -> Article -> Html Msg
viewCommentForm model user article =
    form [ class "card comment-form", Events.onSubmit (SubmittedCommentForm user article) ]
        [ div [ class "card-block" ]
            [ textarea
                [ class "form-control"
                , placeholder "Write a comment..."
                , attribute "rows" "3"
                , value model.commentText
                , Events.onInput UpdatedCommentText
                ]
                []
            ]
        , div [ class "card-footer" ]
            [ button [ class "btn btn-sm btn-primary" ] [ text "Post Comment" ]
            ]
        ]


viewComment : Maybe User -> Article -> Comment -> Html Msg
viewComment currentUser article comment =
    let
        viewCommentActions =
            Utils.Maybe.view currentUser <|
                \user ->
                    if user.username == comment.author.username then
                        span
                            [ class "mod-options"
                            , Events.onClick (ClickedDeleteComment user article comment)
                            ]
                            [ i [ class "ion-trash-a" ] [] ]

                    else
                        text ""
    in
    div [ class "card" ]
        [ div [ class "card-block" ]
            [ p [ class "card-text" ] [ text comment.body ] ]
        , div [ class "card-footer" ]
            [ a
                [ class "comment-author"
                , href ("/profile/" ++ comment.author.username)
                ]
                [ text comment.author.username
                ]
            , span [ class "date-posted" ] [ text (Utils.Time.formatDate comment.createdAt) ]
            , viewCommentActions
            ]
        ]
