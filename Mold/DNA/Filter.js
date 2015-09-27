Seed({
		name : "Mold.DNA.Filter",
		dna : "dna",
		author : "Jan Kaufmann",
		version : "0.0.1",
		include : [
			"Mold.Lib.Filter"
		]
	},
	{
		name :  "filter",
		dnaInit : function(){

		},
		create : function(seed) {
			
			var target = Mold.createChain(Mold.getSeedChainName(seed));


			target[Mold.getTargetName(seed)] = seed.func;
			
			if(!seed.filterName){
				throw new Error("Filername in " + seed.name + " is not specified!")
			}

			Mold.Lib.Filter.add(seed.filterName, seed.func)
			
			return target[Mold.getTargetName(seed)];
		}
	}
);