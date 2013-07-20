Seed (
	{ 
		name : "Mold.Misc.Superclass",
		dna : "class",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	function(parameter){
		var _irgendwas = "test";
		var _privateMethde = function(){ return "private" }

		var _test = parameter 

		this.publics = {
			superClassPublicMethode : function(){
				var output = "superClassPublicMethode wird ausgeführt:" + _test;
				return output;
			}
		}

	}
);