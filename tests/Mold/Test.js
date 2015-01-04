Seed({
		name : "Mold.Test",
		dna : "class",
		include : [
			"Mold.Dependency",
			"->Mold.Lib.Event"
		]
	},
	function(){
		
		console.log("Show this dessage if dependecy is loaded!")

		this.publics = {
			testMethod : function(){
				return true;
			}
		}
	}
)