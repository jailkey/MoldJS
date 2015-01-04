"use strict";
Seed({
		name : "Mold.DNA.Model",
		dna : "dna",
		author : "Jan Kaufmann",
		version : "0.0.1",
		include : [
			"Mold.Lib.Model"
		]
	},
	{
		name :  "model",
		dnaInit : function(){
			Mold.addLoadingProperty("adapter");
		},
		createBy : "new",
		create : function(seed) {
			var target = Mold.createChain(Mold.getSeedChainName(seed));
			
			return function(){
				var adapter = false;
				if(seed.adapter){
					adapter = Mold.getSeed(Mold.cleanSeedName(seed.adapter));
					if(seed.resource){
						adapter = new adapter({ path : seed.resource });
					}else{
						throw new Error("Ressource not given!");
					}
				}
				var model = new Mold.Lib.Model({ properties : seed.func, adapter : adapter });
				return model;
			}
		}
	}
);