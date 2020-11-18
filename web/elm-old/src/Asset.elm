module Asset exposing (Image, defaultAvatar, error, loading, src)

{-| Assets, such as images, videos, and audio. (We only have images for now.)
We should never expose asset URLs directly; this module should be in charge of
all of them. One source of truth!
-}

import Html exposing (Attribute, Html)
import Html.Attributes as Attr