//!seedInfo transpiled
Seed({
		type : "class",
		include : [
			"App.Dependency"
		]
	},
	function(){	
		console.log("Show this message if dependecy is loaded!")

		this.publics = {
			testMethod : function(){
				return true;
			}
		}
	}
)


Seed({
		name : "App.WasAnderes",
		type : "static",
	},
	function(){
		console.log("ANDERS ------------------")

		//module.exports = this;
		return {};
	}
)