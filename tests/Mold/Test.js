Seed({
		name : "Mold.Test",
		dna : "class",
		include : [
			"external->Mold.Parser.Pre.ComLog",
			"Mold.TestFour",
			[
				[{ "Imported" : "Mold.TestThree" }],
				"Mold.TestTwo",
			]
		]
	},
	function(){
		//! das ist nur ein test
		this.publics = {
			testMethod : function(){
				var Imp = new Imported();
				return Imp.test();
			}
		}
	}
)