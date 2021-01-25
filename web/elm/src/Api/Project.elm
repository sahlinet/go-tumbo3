module Api.Project exposing
    ( list
    ,  Project
       --updateArticle
      , projectDecoder

    )

{-|

@docs Article, decoder
@docs Listing, updateArticle
@docs list, feed
@docs get, create, update, delete
@docs favorite, unfavorite

-}

import Api.Data exposing (Data)
import Api.Profile exposing (Profile)
import Api.Token exposing (Token)
import Http
import Iso8601
import Json.Decode as Json
import Json.Encode as Encode
import Time
import Utils.Json exposing (withField)


type alias Project =
    { name : String
    , id : Int
    , description : String
    , state : ProjectState
    , gitrepository : GitRepository
    }


type alias GitRepository =
    { url : String
    , version : String
    }


type alias ProjectState =
    { state : String
    , errormsg : String
    }


projectDecoder : Json.Decoder Project
projectDecoder =
    Json.map5 Project
        (Json.field "name" Json.string)
        (Json.field "id" Json.int)
        (Json.field "description" Json.string)
        (Json.field "state" projectStateDecoder)
        (Json.field "gitrepository" gitRepositoryDecoder)


gitRepositoryDecoder : Json.Decoder GitRepository
gitRepositoryDecoder =
    Json.map2 GitRepository
        (Json.field "url" Json.string)
        (Json.field "version" Json.string)


projectStateDecoder : Json.Decoder ProjectState
projectStateDecoder =
    Json.map2 ProjectState
        (Json.field "state" Json.string)
        (Json.field "errormsg" Json.string)



-- ENDPOINTS


list :
    { token : Maybe Token
    , urlPrefix : String
    , onResponse : Data (List Project) -> msg
    }
    -> Cmd msg
list options =
    Api.Token.get options.token
        { url = options.urlPrefix ++ "/api/v1/projects"
        , expect =
            Api.Data.expectJson options.onResponse
                (Json.list projectDecoder)
        }


start :
    { token : Maybe Token
    , urlPrefix : String
    , projectId : Int
    , onResponse : Data (List Project) -> msg
    }
    -> Cmd msg
start options =
    Api.Token.put options.token
        { url = options.urlPrefix ++ "/projects/" ++ String.fromInt options.projectId ++ "/run"
        , body = Http.emptyBody
        , expect =
            Api.Data.expectJson options.onResponse
                (Json.list projectDecoder)
        }
