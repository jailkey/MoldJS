Seed({
		name : "Mold.Lib.Directive",
		dna : "static",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Controller",
			//"Mold.Lib.CssParser",
			"Mold.Lib.Element",
			"Mold.Lib.Info",
			"Mold.Lib.DomObserver",
			//"Mold.Lib.Stack",
		]
	},
	function(){

		var _directives = [],
			_directivesIndex = {},
			_cache = {},
			_events = {},
			doc = (Mold.isMoldJS) ? false : document,
			_events = new Mold.Lib.Event(_events);
			//cssParser = new Mold.Lib.CssParser(document);

		//Mold.mixin(this, new Mold.Lib.Event(this));
			

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
		
			//if(!_isInWatchList(element)){
				
				var that = this;
				
				/*
				var selected = Mold.Lib.DomObserver.observeAttributes(element);
				
				selected
					.on("attribute.changed", function(e){
						console.log("changed")
						//callback.call(that, e.data.mutation);
					})
				*/
				_watchList.push(element);
				
			//}
			
		}

		var _watchAttribute = function(element, attribute, callback){
			Mold.watch(element, attribute, function(){
				callback(element, attribute);
			})
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
										output.trigger("element.added", { name: elementName, node : selectedNode, mutation : mutation},  { disableSaveTrigger : true})
									}
								});
							}else if (mutation.type === "attributes"){
								var collectedAttributes = (Mold.isArray(collection.attribute)) ? collection.attribute : [collection.attribute]
								Mold.each(collectedAttributes, function(selectedAttribute){
									if(mutation.attributeName === selectedAttribute){
										output.trigger('attribute.changed',  { name: selectedAttribute, mutation : mutation},  { disableSaveTrigger : true});
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
								output.trigger("html.change", { name: contentName, mutation : mutation},  { disableSaveTrigger : true})
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
							_watchAttribute(scope, attributeName, function(element, attribute){
								output[attributeName] = element.getAttribute(attributeName);
								output.trigger(attributeName + ".changed", { name: attributeName, value : output[attributeName]},  { disableSaveTrigger : true})
								output.trigger("attribute.changed", { name: attributeName, value : output[attributeName]},  { disableSaveTrigger : true})
			
							})
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

			if(typeof directive.seed === "string"){
				directive.controller = Mold.getSeed(directive.seed);
			}else{
				directive.controller = new Mold.Lib.Controller(directive.seed);
				
			}

	
			directive.apply = function(node, element, template, index, style){
				window.testTime = window.testTime || 0;
				var startTime = performance.now();
				if(!element.hasDirective || !element.hasDirective(directive._id)){
					
					directive.scope = element;
					
					if(!element.hasDirective){
						element.hasDirective = function(id){
							return  Mold.contains(element.directives, id);
						}
					}
					if(!element.directives){
						element.directives = [];
					}
					element.directives.push(directive._id)
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
				
						var seed = directive.controller;
						
						directive.instance = new seed(scope, new Mold.Lib.Element(element), collection, directive.component);
						if(directive.register){
							switch(directive.register){
								case 'collection':
									directive.instance.register(collection);
									break;
								case 'component':
									directive.instance.register(directive.component);
									break;
								case 'all':
									directive.instance.register(collection);
									directive.instance.register(directive.component);
									break;

							}
						}
					
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
					

					if(directive.action){
						directive.action.call(directive, node, element, template, index);
					}
					
				}
				window.testTime +=  performance.now()- startTime;
			}
			
			directive.appendElement = function(child){
				return directive.scope.appendChild(child);
			}

			directive.replaceElement = function(child){
				return directive.scope.parentNode.replaceChild(child, directive.scope);
			}

			_directives.push(directive);
			_directivesIndex[directive.at] = _directivesIndex[directive.at] || {};
			_directivesIndex[directive.at][directive.name] = _directivesIndex[directive.at][directive.name] || [];
			_directivesIndex[directive.at][directive.name].push(_directives[_directives.length -1]);
			_events.trigger("directive.added", {
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
				//var elementStyles = cssParser.getElementsByStyleProperty(directive.name);
			
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

				if(
					directive.at === "attribute" 
					&& element.getAttribute 
					&&!element.getAttribute(directive.name)
					|| (directive.value && directive.value !== element.getAttribute(directive.name))
				){

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
				setTimeout(function(){
					directive.apply(
						node,
						element,
						template,
						index,
						(styleAttributes) ? styleAttributes[index] : false
					);
				}, 1);
				
				_cache[cacheName+"len"]++;
			});
		}


		_events.on("directive.added", function(e){
			var directive = e.data.directive,
				scope = e.data.scope || document;


			switch(directive.at){
				case "element":
					var elements = scope.querySelectorAll(directive.name);
					break;
				case "attribute":
					if(directive.value){
						var elements = scope.querySelectorAll('['+directive.name+'~="' + directive.value + '\"]');
					}else{
						var elements = scope.querySelectorAll("["+directive.name+"]");
					}
					break;
				case "class":
					var elements = scope.getElementsByClassName(directive.name);
					break;
				/*
				case "style-property":
					
					var elementStyles = cssParser.getElementsByStyleProperty(directive.name),
						elements = [],
						styleAttributes = [];

					Mold.each(elementStyles, function(selected, name){
						elements.push(selected.element)
						styleAttributes.push(selected.properties)
					});

					break;*/
				default:
					break;
			}
			var styleAttributes = [];
			
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

		//var bodyElement = new Mold.Lib.Element(document.body);
		//Mold.Lib.DomObserver.observe(bodyElement, { childList: false, characterData : false, subtree : true});

		var _appendSubElements = function(element){
			for(var i = 0, len = element.childNodes.length; i < len; i++){
				if(element.childNodes[i].nodeType === 1){
					_appendElement(element.childNodes[i]);
					_appendSubElements(element.childNodes[i]);
				}
			}
		}
		/*
		bodyElement.on("attribute.changed", function(e){
			_appendElement(e.data.mutation.target);
			_appendStyleProperty(e.data.mutation.target);
		});

		bodyElement.on("element.inserted", function(e){
			
			_appendElement(e.data.mutation.target);
			_appendSubElements(e.data.mutation.target);
			_appendStyleProperty(e.data.mutation.target);
		});
		*/

		
		Mold.Lib.Observer.on("element.created", function(e){
		//	var startTime = performance.now()
			_appendElement(e.data.element);
			//_appendStyleProperty(e.data.element);

		})

		return {
			on : _events.on,
			trigger : _events.trigger,
			appendElement : _appendElement,
			add : function(directive, scope, template){
				/*
				if(!directive.overwrite){
					directive = this.get(directive.at, directive.name. directive.value) || directive;
				}*/
				if(directive.at !== "style-property"){

					_add(directive, scope, template);
					
				}else{
					/*
					cssParser.at("ready", function(){
						_add(directive, scope, template);
					});*/
				}
			},
			
			get : function(type, name, value){
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