module Api.Project exposing
    ( decoder
    , list
    ,  Project
       --updateArticle

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
    , description : String
    , state : String
    }


decoder : Json.Decoder Project
decoder =
    Json.map3 Project
        (Json.field "name" Json.string)
        (Json.field "description" Json.string)
        (Json.field "state" Json.string)



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
                (Json.list decoder)
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
        { url = options.urlPrefix ++ "/projects/" ++ String.fromInt options.projectId ++ "/services/:serviceId/run"
        , body = Http.emptyBody
        , expect =
            Api.Data.expectJson options.onResponse
                (Json.list decoder)
        }
