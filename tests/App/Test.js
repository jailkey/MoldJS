//!seedInfo transpiled
Seed({
		type : "static",
		include : [
			{ "Injection" : "App.Dependency"}
		]
	},
	function(){	
		console.log("Show this message if dependecy is loaded!")
		var test = new Injection();

		this.testMethod = function(){
			return test.test();
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