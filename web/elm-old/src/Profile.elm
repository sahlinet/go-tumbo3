module Profile exposing (Profile, avatar, decoder)

{-| A user's profile - potentially your own!
Contrast with Cred, which is the currently signed-in user.
-}

import Api exposing (Cred)
import Avatar exposing (Avatar)
import Http.Legacy as Http
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline exposing (required)
import Username exposing (Username)



-- TYPES


type Profile
    = Profile Internals


type alias Internals =
    { 
    , avatar : Avatar
    }



-- INFO


avatar : Profile -> Avatar
avatar (Profile info) =
    info.avatar



-- SERIALIZATION


decoder : Decoder Profile
decoder =
    Decode.succeed Internals
        |> Decode.map Profile
