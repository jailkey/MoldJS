Seed({
		name : "Mold.DNA.Component",
		dna : "dna",
		author : "Jan Kaufmann",
		version : "0.0.1",
		include : [
			"Mold.Lib.Component"
		]
	},
/*
	Ccontroller parameter scope, element, collection
*/
	{
		name :  "component",
		dnaInit : function(){
			Mold.addLoadingProperty("controller");
		},
		createBy : "new",
		create : function(seed) {
			var target = Mold.createChain(Mold.getSeedChainName(seed));
			

			if(seed.controller){
				
				var component = new Mold.Lib.Component(seed.controller);
			}else if(seed.func){
				var component = new Mold.Lib.Component(seed.func);
			}else{
				throw new Error("No controller given for component "+seed.name+"!");
			}
			Mold.each(seed.directives, function(directive){
				directive.component = component;
				directive.register = seed.register;
				component.directive(directive);
			});
			if(seed.files){
				component.files(seed.files);
			}
			return component;
		}
	}
);