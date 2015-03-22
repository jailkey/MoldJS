Seed({
		name : "Mold.Tools.Test.Unit",
		dna : "action",
		include : [
			"Mold.Tools.Test.TDD",
			"Mold.Tools.Test.ConsoleReporter"
		]
	},
	function(){

		
		Mold.addPostProcessor("unittest", function(createdSeed, rawSeed){
			if(rawSeed.test){
				if(typeof rawSeed.test === "function"){

					var simpleUnit = new Mold.Tools.Test.TDD();
					simpleUnit.addReporter(new Mold.Tools.Test.ConsoleReporter());
					simpleUnit.test(rawSeed.test, createdSeed);
					simpleUnit.run();
				}
			}
		});

		//if not nodejs run default tests
		if(!Mold.isNodeJS){
			Mold.load({
				name : "Mold.Lib.*"
			}).bind(function(){
				//console.log("Package loaded!")
			});
		}

	}
);