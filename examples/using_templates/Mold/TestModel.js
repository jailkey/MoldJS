Seed({
		name : "Mold.TestModel",
		dna : "model",
		adapter : "external->Mold.Adapter.Rest",
		resource : "/moldserver/test",
		include : [
			"external->Mold.DNA.Model"
		]
	},
	{
		"name" : "string",
		"vorname" : "string",
		"nachname" : "string",
		"list" : [
			{ 
				"text" : "string",
				"background" : "string",
				"color" : "string",
				"size" : "number"
			}
		],
		"adress" : [
			{
				"number" : "string",
				"plz" : "string"
			}
		]
	}
);