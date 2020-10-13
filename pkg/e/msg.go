package e

var MsgFlags = map[int]string{
	SUCCESS:                        "ok",
	ERROR:                          "fail",
	INVALID_PARAMS:                 "INVALID_PARAMS",
	ERROR_EXIST_TAG:                "ERROR_EXIST_TAG",
	ERROR_EXIST_TAG_FAIL:           "ERROR_EXIST_TAG_FAIL",
	ERROR_NOT_EXIST_TAG:            "ERROR_NOT_EXIST_TAG",
	ERROR_GET_TAGS_FAIL:            "ERROR_GET_TAGS_FAIL",
	ERROR_COUNT_TAG_FAIL:           "ERROR_COUNT_TAG_FAIL",
	ERROR_ADD_TAG_FAIL:             "ERROR_ADD_TAG_FAIL",
	ERROR_EDIT_TAG_FAIL:            "ERROR_EDIT_TAG_FAIL",
	ERROR_DELETE_TAG_FAIL:          "ERROR_DELETE_TAG_FAIL",
	ERROR_EXPORT_TAG_FAIL:          "ERROR_EXPORT_TAG_FAIL",
	ERROR_IMPORT_TAG_FAIL:          "ERROR_IMPORT_TAG_FAIL",
	ERROR_NOT_EXIST_PROJECT:        "ERROR_NOT_EXIST_PROJECT",
	ERROR_ADD_ARTICLE_FAIL:         "ERROR_ADD_ARTICLE_FAIL",
	ERROR_DELETE_ARTICLE_FAIL:      "ERROR_DELETE_ARTICLE_FAIL",
	ERROR_CHECK_EXIST_ARTICLE_FAIL: "ERROR_CHECK_EXIST_ARTICLE_FAIL",
	ERROR_EDIT_ARTICLE_FAIL:        "ERROR_EDIT_ARTICLE_FAIL",
	ERROR_COUNT_ARTICLE_FAIL:       "ERROR_COUNT_ARTICLE_FAIL",
	ERROR_GET_PROJECT_FAIL:         "ERROR_GET_PROJECT_FAIL",
	ERROR_GET_ARTICLE_FAIL:         "ERROR_GET_ARTICLE_FAIL",
	ERROR_GEN_ARTICLE_POSTER_FAIL:  "ERROR_GEN_ARTICLE_POSTER_FAIL",
	ERROR_AUTH_CHECK_TOKEN_FAIL:    "ERROR_AUTH_CHECK_TOKEN_FAIL",
	ERROR_AUTH_CHECK_TOKEN_TIMEOUT: "ERROR_AUTH_CHECK_TOKEN_TIMEOUT",
	ERROR_AUTH_TOKEN:               "ERROR_AUTH_TOKEN",
	ERROR_AUTH:                     "ERROR_AUTH",
}

// GetMsg get error information based on Code
func GetMsg(code int) string {
	msg, ok := MsgFlags[code]
	if ok {
		return msg
	}

	return MsgFlags[ERROR]
}
