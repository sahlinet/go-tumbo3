package routers

import (
	"time"

	"github.com/GeertJohan/go.rice/embedded"
)

func init() {

	// define files
	file2 := &embedded.EmbeddedFile{
		Filename:    "index.html",
		FileModTime: time.Unix(1602360846, 0),

		Content: string("<!DOCTYPE html>\n<html>\n<head>\n    <link\n            rel=\"stylesheet\"\n            href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">\n\n    <style>\n        .jumbotron {\n            background-color: #e6ffe6;\n            text-align: center;\n        }\n    </style>\n</head>\n\n<body>\n<div id=\"elm-app-is-loaded-here\"></div>\n\n<script src=\"static/app.js\"></script>\n<script>\n    var app = Elm.Main.init({\n        node: document.getElementById(\"elm-app-is-loaded-here\")\n    });\n</script>\n</body>\n</html>"),
	}

	// define dirs
	dir1 := &embedded.EmbeddedDir{
		Filename:   "",
		DirModTime: time.Unix(1602591846, 0),
		ChildFiles: []*embedded.EmbeddedFile{
			file2, // "index.html"

		},
	}

	// link ChildDirs
	dir1.ChildDirs = []*embedded.EmbeddedDir{}

	// register embeddedBox
	embedded.RegisterEmbeddedBox(`../web/static`, &embedded.EmbeddedBox{
		Name: `../web/static`,
		Time: time.Unix(1602591846, 0),
		Dirs: map[string]*embedded.EmbeddedDir{
			"": dir1,
		},
		Files: map[string]*embedded.EmbeddedFile{
			"index.html": file2,
		},
	})
}
