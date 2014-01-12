Seed({
		name : "Mold.DNA.View",
		dna : "dna",
		author : "Jan Kaufmann",
		version : "0.0.1",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.View"
		]
	},
	{
		name :  "view",
		dnaInit : function(){
			Mold.addLoadingProperty("extend");
		},
		create : function(seed) {
			
			var target = Mold.createChain(Mold.getSeedChainName(seed));

			target[Mold.getTargetName(seed)] = new Mold.Lib.View(seed.func, seed.name, seed.extend);
			
			return target[Mold.getTargetName(seed)];
		}
	}
);