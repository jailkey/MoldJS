Seed({
		name : "Mold.DNA.Component",
		dna : "dna",
		author : "Jan Kaufmann",
		version : "0.0.1",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Component"
		]
	},
	{
		name :  "component",
		dnaInit : function(){
			
		},
		createBy : "new",
		create : function(seed) {
			var target = Mold.createChain(Mold.getSeedChainName(seed));
	
			target[Mold.getTargetName(seed)] = function(){
				var component = new Mold.Lib.Component(seed.element, seed.attributes, seed.func);
				return component;
			}
		}
	}
);