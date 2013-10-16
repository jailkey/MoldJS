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
		"#setname/:vorname/:name" : "@setname"
	}
);