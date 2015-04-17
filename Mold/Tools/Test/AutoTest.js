Seed({
		name : "Mold.Tools.Test.AutoTest",
		dna : "action",
		include : [
			"Mold.Tools.Test.Tester",
			"Mold.Tools.Test.ConsoleReporter"
		]
	},
	function(){

		Mold.addPostProcessor("unittest", function(createdSeed, rawSeed){
			if(rawSeed.test){
				var simpleUnit = new Mold.Tools.Test.Tester();
				simpleUnit.addReporter(new Mold.Tools.Test.ConsoleReporter());
					
				if(typeof rawSeed.test === "function"){
					simpleUnit.test(rawSeed.test, createdSeed);
					simpleUnit.run();
				}else if(Mold.startsWith(rawSeed.test, "Mold.")){
					Mold.load({ name : (Mold.isExternalSeed(rawSeed.name) ? "->" : "") + rawSeed.test }).bind(function(){
						var testSeed = Mold.getSeed(rawSeed.test);
						simpleUnit.test(testSeed, createdSeed);
						simpleUnit.run();
					});
				}
			}
		});

	}
);