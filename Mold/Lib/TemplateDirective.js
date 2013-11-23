Seed({
		name : "Mold.Lib.TemplateDirective",
		dna : "static",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(){

		var _directives = [];
		var _directivesIndex = {};

		/*
			Directive Exampel
			{
				at : "attribute|element",
				name : "mold-event",
				action : function(node, element, template){
					
				}
			}
		*/

		var _add = function(directive){
			_directives.push(directive);
			_directivesIndex[directive.at] = _directivesIndex[directive.at] || {};
			_directivesIndex[directive.at][directive.name] = _directives[_directives.length -1];
		}

/*Mold View Event*/
		_add({
			at : "attribute",
			name : "mold-event",
			action : function(node, element, template, index){
				
				var handler =  node.nodeValue.split(":")[0];
				var moldEvent = node.nodeValue.split(":")[1];
				
				new Mold.Lib.Event(element).on(handler, function(e){
					var data ={
						e : e,
						element : this,
						index : index
					}
					template.triggerEvent(moldEvent, data);
				})
			}
		});

/*Mold View Data*/
		_add({
			at : "attribute",
			name : "mold-data",
			action : function(node, element, template, index){

				var viewModel = node.nodeValue;
				if(element.nodeName.toLowerCase() === "input"
					|| element.nodeName.toLowerCase() === "textarea"
				){
					new Mold.Lib.Event(element).on("keyup", function(e){
						var name = element.getAttribute("name");
						template.viewModel.set(viewModel, name, element.value)
					})
				}
			}
		});

		
		return {
			add : function(directive){
				_add(directive);
			},
			get : function(type, name){
				if(_directivesIndex[type] && _directivesIndex[type][name]){
					return _directivesIndex[type][name].action;
				}else{
					return false;
				}
			}
		}	
	}
)