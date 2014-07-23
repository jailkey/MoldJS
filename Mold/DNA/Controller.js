Seed({
		name : "Mold.DNA.Controller",
		dna : "dna",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Controller"
		]
	},
	{
		name :  "controller",
		dnaInit : function(){
			Mold.addLoadingProperty("extend");
		},
		createBy : "new",
		create : function(seed) {
			var target = Mold.createChain(Mold.getSeedChainName(seed));
			if(seed.func){
				var controllerCode = seed.func;
			}else if (seed.controller){
				var controllerCode = seed.controller;
			}
			var controller = new Mold.Lib.Controller(controllerCode, seed.name);
	
			return controller;
		}
	}
);