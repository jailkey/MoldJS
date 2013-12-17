Seed({
		name : "Mold.Lib.DomScope",
		dna : "class",
		include : [
			"Mold.Lib.TemplateDirective"
		]
	},
	function(mainScope){
		var _domScope = mainScope || document.createDocumentFragment();
		var _directive = false;
		this.publics = {
			append : function(element){
				if(Mold.isNodeList(element)){
					
				}
				return this;
			},
			directive : function(directive){
				switch(directive.at){
					case "element":
						var elements = _domScope.getElementsByTagName(directive.name);
						break;
					default:
						break;
				}
				Mold.Lib.TemplateDirective.add(directive);


				if(Mold.isNodeList(elements)){
					_domScope = elements;
					console.log("is nodelist")
				}else{
					console.log("keine Nodelist")
				}
				return this;
			},
			collect : function(){

				return collectionData;
			},
			get : function(){
				return _domScope;
			} 
		}
	}
);