module User exposing (..)


type alias User =
    { name : String
    , token : String
    }


emptyUser : User
emptyUser =
    { name = ""
    , token = ""
    }
