Seed({
		name : "Mold.Lib.DomScope",
		dna : "static",
		include : [
			"Mold.Lib.TemplateDirective",
			"Mold.Lib.Template",
			"Mold.Lib.CssParser"
		]
	},
	function(mainScope){
		
		//var _mainTemplate = new Mold.Lib.Template(document.documentElement);
		var cssParser = new Mold.Lib.CssParser();
		
		Mold.Lib.TemplateDirective.on("directive.added", function(e){
			var directive = e.data.directive;
			switch(directive.at){
				case "element":
					var elements = document.getElementsByTagName(directive.name);
					break;
				case "attribute":
					var elements = document.querySelectorAll("["+directive.name+"]");
					break;
				case "class":
					console.log("get class directive")
					var elements = document.getElementsByClassName(directive.name);
					break;
				case "style-property":
					var elementStyles = cssParser.getElementsByStyleProperty(directive.name);
					var elements = [];
					var styleAttributes = [];
					Mold.each(elementStyles, function(selected){
						elements.push(selected.element)
						styleAttributes.push(selected.properties)
					});
					break;
				default:
					break;
			}
			if(elements && elements.length){
				var index = 0;
				var template = false;
				Mold.each(elements, function(element){
					directive.apply(element, element, template, index, (styleAttributes) ? styleAttributes[index] : false);
					index++;
				});
			}
		});

		return {

			directive : function(directive){
				cssParser.at("ready", function(){
					Mold.Lib.TemplateDirective.add(directive);
				});
				//_mainTemplate.refresh();
			}
		}
	}
);