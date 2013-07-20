Seed({
		name : "Mold.DNA.Plugin",
		dna : "dna",
		author : "Jan Kaufmann",
		include : []
	},
	{
		name :  "plugin",
		dnaInit : function(){
			Mold.addLoadingProperty("extend");
		},
		create : function(seed) {
			
			try {	
			
				if(seed.expand){					
					var expandDNA = Mold.getDNA(seed.expand);
					var oldCreate = expandDNA.create;
					var expandingSeed = seed.func;
					expandDNA.create = function(seed){
						var createValue = oldCreate(seed);
						seed.func = expandingSeed(createValue);
					
						var target = Mold.createChain(Mold.getSeedChainName(seed));
						target[Mold.getTargetName(seed)] = seed.func ;
						return target[Mold.getTargetName(seed)];
					}
					//Class DNA überschreiben
					Mold.addDNA(expandDNA)
					
				}else{
					Mold.log("Error", { code : 3, dnaname: "element", error : "dem Plugin muss angegeben werden welche DNA es erweitern soll"});
					return false;
				};
				
			}catch(e){
				Mold.log("Error", { code : 3, dnaname: "element", error : e});
			}
		}
	}
);