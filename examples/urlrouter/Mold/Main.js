Seed(
	{ 
		name : "Mold.Main",
		dna : "urlrouter",
		onhashchange : "update",
		include : [
			"external->Mold.DNA.UrlRouter"
		]
	},
	{
		"/" : "@ready->Mold.Test",
		"#login/:user/action/:postid" : "@doaction"
	}
);