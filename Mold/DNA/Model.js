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
			target[Mold.getTargetName(seed)] = function(){
				var model = new Mold.Lib.Model({ propertys : seed.func });
					
				return model;
			}
		}
	}
);