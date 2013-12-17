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

		var _collect = function(scope, collection, bind){
			var output;
			if(Mold.isArray(collection)){
				output = [];
				Mold.each(collection, function(item, name){
					output.push(_collect(scope, item, bind))
				});
			}else{
				output = {};
				if(collection.element){

					var elements = scope.getElementsByTagName(collection.element);
					var elementName = collection.name || collection.element;
					output[elementName] = [];
					if(collection.childs){
						Mold.each(elements, function(selected){
							var childs = {};
							Mold.each(collection.childs, function(item){
								Mold.mixing(childs, _collect(selected, item, bind));
							})
							output[elementName].push(childs);
						});
					}
				}else if(collection.attribute){
					var attribute = scope.getAttribute(collection.attribute);
					var attributeName = collection.name || collection.attribute;
					output[attributeName] = attribute;
				}
			}
			return output;
		}

		var _add = function(directive){
			

			directive.apply = function(node, element, template, index){
				directive.scope = element;
				if(directive.seed){
					var seed = Mold.getSeed(directive.seed);
					directive.instance = new seed();
					if(directive.collect){
						var collection = _collect(directive.scope, directive.collect, false);
						console.log("collection", collection)
					}
					if(directive.instance.scope){
						
						if(directive.replace) {
							directive.replace(directive.instance.scope);
						}else{
							directive.append(directive.instance.scope);
						}
					}
				}
				directive.action.call(directive, node, element, template, index);
			}
			directive.append = function(child){
				return directive.scope.appendChild;
			}

			directive.replace = function(child){
				return directive.scope.parentNode.replaceChild(child, directive.scope);
			}

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
				name = name.toLowerCase();
				if(_directivesIndex[type] && _directivesIndex[type][name]){
					return _directivesIndex[type][name];
				}else{
					return false;
				}
			}
		}	
	}
)