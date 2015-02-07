Seed(
	{ 
		name : "Mold.Main",
		dna : "urlrouter",
		include : [
			"->Mold.DNA.UrlRouter"
		]
	},
	{
		"/" : "@ready->Mold.MainController",
		"#login/:user/action/:postid" : "@doaction"
	}
);