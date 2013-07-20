Seed({
		name : "Mold.DNA.Element",
		dna : "dna",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Element"
		]
	},
	{
		name :  "element",
		dnaInit : function(){
			Mold.addLoadingProperty("extend");
		},
		create : function(seed) {
			try {
				var target = Mold.createChain(Mold.getSeedChainName(seed));	
				
			
				if(seed.extend){
					var superElement = Mold.getSeed(seed.extend);
					seed.func =	Mold.extend(function(){
							var superElementObject = Mold.callWithDynamicArguments(superElement, arguments);

							this.element = superElementObject;
							return this;
						}, 
						seed.func,
						{ superClassName : "rootclass"}
					);					
				}else{
					seed.func =	Mold.extend(function(){
							this.element = this.element || new Mold.Lib.Element(seed.tagname);
							return this;
						}, 
						seed.func,
						{ superClassName : "rootclass"}
					);
					
				}
				//	seed.func.prototype.element = superElement.prototype.element.cloneNode(true);
				
				target[Mold.getTargetName(seed)] = seed.func;
				return target[Mold.getTargetName(seed)];
			}catch(e){
				Mold.log("Error", { code : 3, dnaname: "element", error : e, seed : seed});
			}
		}
	}
);
