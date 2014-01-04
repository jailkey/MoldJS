Seed({
		name : "Mold.Lib.DomScope",
		dna : "static",
		include : [
			"Mold.Lib.TemplateDirective",
			"Mold.Lib.Template"
		]
	},
	function(mainScope){
		
		var _mainTemplate = new Mold.Lib.Template(document.documentElement);
		
		return {

			directive : function(directive){
				
				Mold.Lib.TemplateDirective.add(directive);
				_mainTemplate.refresh();
			}
		}
	}
);