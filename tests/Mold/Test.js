Seed({
		name : "Mold.Test",
		dna : "class",
		include : [
			"Mold.TestFour",
			[
				[{ "Imported" : "Mold.TestThree" }],
				"Mold.TestTwo",
			]
		]
	},
	function(){
		
		this.publics = {
			testMethod : function(){
				var Imp = new Imported();
				return Imp.test();
			}
		}
	}
)