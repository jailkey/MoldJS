Seed (
	{ 
		name : "Mold.Misc.TestSingelton",
		dna : "singelton",
		author : "Jan Kaufmann",
		//include : ["Mold.Misc.Superclass"],
		//implements : "Mold.Misc.InterfaceTestclass",
		//extend : "Mold.Misc.Superclass",
		description : "",
		version : 0.1
	},
	function(parameter){
	
		var _privateParam = parameter;
		
		this.public = {
			publicMethode : function(){
				
				console.log(_privateParam);
			},
			setParam : function(param){
				_privateParam = param;
			}
		}
	}
);