Seed({
		name : "Mold.DNA.Component",
		dna : "dna",
		author : "Jan Kaufmann",
		version : "0.0.1",
		include : [
			"Mold.Lib.Component"
		]
	},
	{
		name :  "component",
		dnaInit : function(){
			Mold.addLoadingProperty("controller");
		},
		createBy : "new",
		create : function(seed) {
			var target = Mold.createChain(Mold.getSeedChainName(seed));
	
			 
			var component = new Mold.Lib.Component(seed.controller);
			Mold.each(seed.func.directives, function(directive){
				component.directive(directive);
			});
			if(seed.func.files){
				component.files(seed.func.files);
			}
				
			target[Mold.getTargetName(seed)] = component;
			
		}
	}
);