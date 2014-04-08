Seed(
	{ 
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Lib.Ajax"
		]
	},
	function(){

		var ajax = new Mold.Lib.Ajax();

		var promise = new Mold.Lib.Promise().resolve(ajax.get("test.html"));

		

	}
);