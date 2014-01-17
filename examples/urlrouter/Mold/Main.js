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
		"#seed-one" : "@ready->Mold.Test",
		"#login/:user/action/:postid" : "@doaction"
	}
);