Seed({
		name : "Mold.Lib.TemplateDirective",
		dna : "static",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Controller"
		]
	},
	function(){

		var _directives = [];
		var _directivesIndex = {};
		var _that = this;

		Mold.mixing(this, new Mold.Lib.Event(this));

		/*
			Directive Exampel
			{
				at : "attribute|element",
				name : "mold-event",
				seed : "seedname", [optional]
				collect {}, [optional]
				replace : true, [optional]
				action : function(node, element, template){
					
				}
			}
		*/
		//var _mainTemplate = new Mold.Lib.Template(document);
		var _watchList = [];
		var _watch = function(element, callback){
			if(Mold.isSupported("mutationObserver")){
				var observer = new MutationObserver(function(mutations){
					Mold.each(mutations, function(mutation){
						callback.call(this, mutation);
					});
				});
				observer.observe(element, { attributes: true, childList: true, characterData: true })
				_watchList.push(element);
			}else{
				throw "Your Browser does not support MutationObserver!"
			}
		}

		var _collectChilds = function(elements, collection, elementName, output, watchable){

			var i = 0,
				len = elements.length,
				childs = {},
				selected;

			if(!output[elementName]){
				output[elementName] = [];
			}

			for(; i < len; i++){
				selected = elements[i];
				childs = {};
				
				Mold.each(collection.childs, function(item){
					output[elementName][i] = output[elementName][i] || {};
					_collect(selected, item, output[elementName][i], watchable);
					if(output[elementName].len != output[elementName].length){
						output[elementName].len = output[elementName].length;
					}
				})
			};
			return output;
		}

		var _collect = function(scope, collection, output, watchable){
			
			if(Mold.isArray(collection)){
				Mold.each(collection, function(item, name){
					_collect(scope, item, output, watchable)
				});
			}else{
				
				if(collection.element){
					
					var elements = scope.getElementsByTagName(collection.element);
					var elementName = collection.name || collection.element;
					
					if(collection.childs){
						_collectChilds(elements, collection, elementName, output, watchable)
					}

					if(watchable){
						_watch(scope, function(mutation){
							if(mutation.type === "childList"){
								Mold.each(mutation.addedNodes, function(selectedNode){
									if(
										selectedNode.nodeName 
										&& collection.element 
										&& (selectedNode.nodeName.toLowerCase() === collection.element.toLowerCase())
									){
										output[elementName].concat(_collectChilds(elements, collection,  elementName, output, watchable));
										//output[elementName].trigger("element.added", {})
									}
								});
							}
						});
					}
				}else if(collection.content){
					
					if(collection.content === "html"){
						var content = scope.innerHTML;
					}

					if(content){
						var contentName = collection.name || collection.content;
						output[contentName] = content;
						
						if(watchable){
							_watch(scope, function(mutation){
								output[contentName] = scope.innerHTML;
							});
						}
					}

				}else if(collection.attribute){

					var collectedAttributes = (Mold.isArray(collection.attribute)) ? collection.attribute : [collection.attribute]

					Mold.each(collectedAttributes, function(selectedAttribute){

						var attribute = scope.getAttribute(selectedAttribute);
						
						if(attribute){
							var attributeName = selectedAttribute.name || selectedAttribute;
							output[attributeName] = attribute;

							if(watchable){
								_watch(scope, function(mutation){
									if(
										mutation.type === "attributes" 
										&& mutation.attributeName === attributeName
									){
										output[attributeName] = mutation.target.getAttribute(attributeName);
									}
								});
							}
						}
					});
				}
			}
			return output;
		}

		var _add = function(directive){
			directive._id = Mold.getId();
			directive.apply = function(node, element, template, index, style){
				if(!element.hasDirective || !element.hasDirective(directive._id)){
					directive.scope = element;
					if(directive.seed){

						if(directive.collect){
							if(directive.watchable){

							}
							var collection = _collect(directive.scope, directive.collect, {},directive.watchable);
						}

						if(style){
							collection = style;
						}

						var scope = {
							append : function(element){
								if(directive.replace) {
									directive.replaceElement(element);
								}else{
									directive.appendElement(element);
								}
							}
						}

						if(typeof directive.seed === "string"){
							var seed = Mold.getSeed(directive.seed);
							
						}else{
							var seed = new Mold.Lib.Controller(directive.seed);
						}

						directive.instance = new seed(scope, collection);

						if(directive.instance.scope){
							if(directive.replace) {
								directive.replaceElement(directive.instance.scope);
							}else{
								directive.appendElement(directive.instance.scope);
							}
						}else{
							directive.instance.scope = directive.scope;
							directive.instance.trigger("scope");
						}
					}
					if(!element.hasDirective){
						element.hasDirective = function(id){
							return element.directives[id] || false;
						}
					}
					if(!element.directives){
						element.directives = [];
					}
					element.directives.push(directive._id)
					if(directive.action){
						directive.action.call(directive, node, element, template, index);
					}
				}
			}
			
			directive.appendElement = function(child){
				return directive.scope.appendChild(child);
			}

			directive.replaceElement = function(child){
				return directive.scope.parentNode.replaceChild(child, directive.scope);
			}

			_directives.push(directive);
			_directivesIndex[directive.at] = _directivesIndex[directive.at] || {};
			_directivesIndex[directive.at][directive.name] = _directives[_directives.length -1];
			_that.trigger("directive.added", { directive : directive });
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
				if(
					element.nodeName.toLowerCase() === "input"
					|| element.nodeName.toLowerCase() === "textarea"
				){
					new Mold.Lib.Event(element).on("keyup", function(e){
						var name = element.getAttribute("name");
						template.viewModel.set(viewModel, name, element.value)
					});
				}
			}
		});

		
		return {
			on : this.on,
			trigger : this.trigger,
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