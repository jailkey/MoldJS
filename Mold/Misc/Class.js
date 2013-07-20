Seed (
	{ 
		name : "Mold.Misc.Class",
		dna : "class",
		author : "Jan Kaufmann",
		implements : "Mold.Misc.Interface",
		extend : "Mold.Misc.Superclass",
		description : "",
		version : 0.1
	},
	function(parameter, paramzwei){
		var _irgendwas = "test";
		var _privateMethode = function(){ return "private" }
	
		this.publics = {
			publicMethode : function(){
				return "wasanders";
				
			},
			testlla : function(){
				return "test";
			}
		}
	}
);