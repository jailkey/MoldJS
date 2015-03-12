Seed({
		name : "Mold.Lib.Directive",
		dna : "static",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Controller",
			"Mold.Lib.CssParser",
			"Mold.Lib.Element",
			"Mold.Lib.Info",
			"Mold.Lib.DomObserver"
		]
	},
	function(){

		var _directives = [],
			_directivesIndex = {},
			_that = this,
			_cache = {},
			doc = (Mold.isMoldJS) ? false : document;
			cssParser = new Mold.Lib.CssParser(document);

		Mold.mixin(this, new Mold.Lib.Event(this));

		/*
			Directive Exampel
			{
				at : "attribute|element|class|style-property",
				name : "mold-event",
				seed : "seedname", [optional]
				collect {}, [optional]
				replace : true, [optional]
				watchable : true, [optional]
				action : function(node, element, template){
					
				}
			}
		*/
	
		var _watchList = [];
		
		var _isInWatchList = function(element){
			return !!Mold.find(_watchList, function(selected){
				if(selected === element){
					return true;
				}
				return false;
			})
		}

		
		var _watch = function(element, callback){
			
			if(!_isInWatchList(element)){
				var test = Mold.Lib.DomObserver.observeElement(element);
				test.on("element.changed", function(e){
					callback.call(this, e.data.mutation);
					
				});
				_watchList.push(element);
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
				
				Mold.each(collection.childs, function(item, name){
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
										output[elementName] = output[elementName] || [];
										output[elementName].concat(
											_collectChilds(
												elements,
												collection,
												elementName,
												output,
												watchable
											)
										);
										output.trigger("element.added", { name: elementName, node : selectedNode, mutation : mutation})
									}
								});
							}else if (mutation.type === "attributes"){
								var collectedAttributes = (Mold.isArray(collection.attribute)) ? collection.attribute : [collection.attribute]
								Mold.each(collectedAttributes, function(selectedAttribute){
									if(mutation.attributeName === selectedAttribute){
										output.trigger('attribute.changed',  { name: selectedAttribute, mutation : mutation});
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
								output.trigger("html.change", { name: contentName, mutation : mutation})
							});
						}
					}

				}else if(collection.attribute){

					var collectedAttributes = (Mold.isArray(collection.attribute)) ? collection.attribute : [collection.attribute]
					Mold.each(collectedAttributes, function(selectedAttribute){

						
						if(!scope.getAttribute(selectedAttribute)){
							scope[selectedAttribute] = false;
						}
						var attribute = Mold.is(scope[selectedAttribute]) ? scope[selectedAttribute] : scope.getAttribute(selectedAttribute);
						
						/*
						if(!attribute){
							attribute = false;
						}*/
						var attributeName = selectedAttribute.name || selectedAttribute;
						output[attributeName] = attribute;
						if(watchable){
							_watch(scope, function(mutation){

								if(
									mutation.type === "attributes" 
									&& mutation.attributeName === attributeName
								){
									output[attributeName] = mutation.target.getAttribute(attributeName);

									output.trigger("attribute.changed", { name: attributeName, mutation : mutation})
								}
							});
						}
						
					});
				}
			}
			return output;
		}

		var _add = function(directive, scope, fromtemplate){
			if(!directive._id){
				directive._id = Mold.getId();
			}
		
			directive.apply = function(node, element, template, index, style){

				if(!element.hasDirective || !element.hasDirective(directive._id)){
					directive.scope = element;
					if(directive.seed){

						if(directive.collect){

							var collection = _collect(directive.scope, directive.collect, Mold.mixin({}, new Mold.Lib.Event({})), directive.watchable);
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
						directive.instance = new seed(scope, new Mold.Lib.Element(element), collection);
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
							return  Mold.contains(element.directives, id);
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
		
			_that.trigger("directive.added", {
				directive : directive,
				scope : scope,
				template : fromtemplate
			 });
		}

		var _appendStyleProperty = function(element){
			Mold.each(_directives, function(directive){
				if(element.nodeType !== 1){
					return false;
				}
				if(directive.at !== "style-property"){
					return false;
				}
				var elementStyles = cssParser.getElementsByStyleProperty(directive.name);
			
				Mold.each(elementStyles, function(selected){
					
					if(!selected.element.hasDirective || !selected.element.hasDirective(directive._id)){
						styleAttributes = selected.properties;
						element = selected.element;
						node = element;
						directive.apply(
							node,
							element,
							false,
							0,
							(styleAttributes) ? styleAttributes : false
						);
						
					}
				});
					
				
			})
		}

		var _appendElement = function(element){
			
			var cacheName = element.nodeName,
				template = false,
				styleAttributes = false;

			Mold.each(_directives, function(directive){

				if(element.nodeType !== 1){
					return false;
				}

				if(!!element.hasDirective && element.hasDirective(directive._id)){
					return false;
				}

				if(directive.at === "element" && directive.name.toUpperCase() !== element.nodeName){
					return false;
				}

				if(directive.at === "attribute" && element.getAttribute &&!element.getAttribute(directive.name)){
					return false;
				}
					
				if(directive.at === "class"){

				}

				if(directive.at === "style-property"){
					return false;
				}

				var index = _cache[cacheName+"len"];
				if(directive.at === "attribute"){
					node =  element.getAttributeNode(directive.name);
				}else{
					node = element;
				}
				
				directive.apply(
					node,
					element,
					template,
					index,
					(styleAttributes) ? styleAttributes[index] : false
				);
				_cache[cacheName+"len"]++;
					
				
			});
		}


		this.on("directive.added", function(e){
			
			var directive = e.data.directive,
				scope = e.data.scope || document;

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

					var elementStyles = cssParser.getElementsByStyleProperty(directive.name),
						elements = [],
						styleAttributes = [];

					Mold.each(elementStyles, function(selected, name){
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
					cacheName = false,
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
						
						directive.apply(
							node,
							element,
							template,
							index,
							(styleAttributes) ? styleAttributes[index] : false
						);

						cacheName = node.nodeName
						index++;
					}
				});
				_cache[cacheName+"len"] = index; 
			}
		});


		Mold.Lib.Observer.sub("create.element", function(e){
			_appendElement(e.data.element);
		});

		new Mold.Lib.Event(document).on("DOMNodeInserted", function(e){
			_appendElement(e.target);
			_appendStyleProperty(e.target);
		});

		return {
			on : this.on,
			trigger : this.trigger,
			appendElement : _appendElement,
			add : function(directive, scope, template){
				
				if(!directive.overwrite){
					directive = this.get(directive.at, directive.name) || directive;
				}
				if(directive.at !== "style-property"){
					_add(directive, scope, template);
					
				}else{
					cssParser.at("ready", function(){
						_add(directive, scope, template);
					});
				}
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