Seed({
		name : "Mold.Lib.DomScope",
		dna : "static",
		include : [
			"Mold.Lib.Directive",
			//"Mold.Lib.Template",
			"Mold.Lib.CssParser"
		]
	},
	function(mainScope){
		
		//var _mainTemplate = new Mold.Lib.Template(document.documentElement);
		var cssParser = new Mold.Lib.CssParser();

		
		Mold.Lib.Directive.on("directive.added", function(e){
			var directive = e.data.directive;
			var scope = e.data.scope || document;



			switch(directive.at){
				case "element":
					var elements = scope.getElementsByTagName(directive.name);
					break;
				case "attribute":
					var elements = scope.querySelectorAll("["+directive.name+"]");
					break;
				case "class":
					var elements = scope.getElementsByClassName(directive.name);
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
				
				var index = 0,
					template = e.data.template || false,
					node = false;

				Mold.each(elements, function(element, elementName){
					if(elementName != "length"){
						switch(directive.at){
							case "element":
								node = element;
								break;
							case "attribute":
								node = element.getAttributeNode(directive.name);
								break;
							case "class":
								node = element;
								break;
						}
					
						directive.apply(node, element, template, index, (styleAttributes) ? styleAttributes[index] : false);
						index++;
					}
				});
			}
		});

		return {

			directive : function(directive, scope, template){
				
				if(directive.at !== "style-property"){
					//console.log("addwith template", template);
					Mold.Lib.Directive.add(directive, scope, template);
				}else{
					cssParser.at("ready", function(){
						
						Mold.Lib.Directive.add(directive, scope, template);
					});
				}
				//_mainTemplate.refresh();
			}
		}
	}
);