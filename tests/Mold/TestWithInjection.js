Seed({
		name : "Mold.TestWithInjection",
		dna : "static",
		include : [
			{ "myClass" : "Mold.Dependency" }
		]
	},
	function(){
		
		var testInstace = new myClass();

		return testInstace.test;
	}
);