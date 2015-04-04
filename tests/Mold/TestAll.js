Seed({
		name : "Mold.TestAll",
		dna : "action",
		include : [
			"->Mold.Tools.Test.AutoTest",
			[
				"->Mold.Lib.*",
				"->Mold.Tools.Test.*"
			]
		]
	},
	function(){
		var simpleUnit = new Mold.Tools.Test.Tester();
		simpleUnit.addReporter(new Mold.Tools.Test.ConsoleReporter());


		var testTest = Mold.getRawSeed("Mold.Tools.Test.Tester");

		Mold.load({ name : "->" + testTest.test }).bind(function(){
			var testSeed = Mold.getSeed(testTest.test);
			simpleUnit.test(testSeed, Mold.Tools.Test.Tester);
			simpleUnit.run();
		});
	}
)