
Seed({
		name : "Mold.Lib.Template",
		dna : "class",
		version : "0.0.3",
		include : [
			"Mold.Lib.Tree",
			"Mold.Lib.TreeFactory",
			"Mold.Lib.Event",
			"Mold.Lib.TemplateFilter",
			"Mold.Lib.Sanitize"
		],
		browserInclude : [
			"Mold.Lib.Directive",
			"Mold.Defaults.TemplateDirectives"
		],
		nodeInclude : [
			"Mold.Lib.Document"
		]
	},
	function(content, config){

		var that = this,
			_config = config || {},
			_templateContent = "",
			_shadowTemplate = false,
			_compiledTemplate = false,
			_container = false,
			_viewModel = {},
			_snatched = {},
			_contentType = false,
			_doc = false,
			_testMode = false,
			_target = false,
			_tid = Mold.getId(),
			undefined;

		Mold.mixin(this, new Mold.Lib.Event(this));
			
		if(Mold.isNodeJS || _testMode){
			_doc = new Mold.Lib.Document();
		}else{
			_doc = document;
		}

		var _hideTemplate = function(element){
		
			Mold.each(element, function(element){
				if(element.childs && element.childs[0]){
					_hideTemplate(element.childs[0]);
				}
				element.hide();
			});

		}

		var _parseTemplate = function(templateContent){
			_applyToDom(templateContent);
			Mold.Lib.TreeFactory.preParseTemplate(_shadowTemplate);
			var tree = _buildTree();
			if(!Mold.isNodeJS){
				that.on("after.init", function(){
					var addDirectives = function(scope){
						Mold.each(Mold.Defaults.TemplateDirectives, function(directive){
							directive._id = directive.name +"_"+that._eid;
							Mold.Lib.Directive.add(
								directive,
								scope,
								that
							);	
						});
						
					}

					addDirectives(_shadowTemplate);
				});
			}
			return tree;
		}

		var _parseElement = function(templateElement){
			_shadowTemplate = templateElement;
			Mold.Lib.TreeFactory.preParseTemplate(_shadowTemplate);
			var tree = _buildTree();
			return tree;
		}

		var _copyNodesToElements = function(target, node){
			while (node.hasChildNodes()) {
  				target.appendChild(node.removeChild(node.firstChild))
			}
		}


		var _applyToDom = function(template){
			_shadowTemplate =  _doc.createElement("div"); //_doc.createDocumentFragment();
			var sanitizer =  new Mold.Lib.Sanitize();
			_shadowTemplate.innerHTML = sanitizer.html(template);
			_shadowTemplate.moldTemplate = that;
			_target = _shadowTemplate;
		}

		var _firstElement = function(){
			var next = _target.firstChild;
			var selected = false;
			while (next) {
				if(next.nodeType === 1){
					selected = next;
				}
  				next = next.nextSibling;
			}
			return selected;
		}

		var _appendTo = function(target){

			var addDirectives = function(){
				Mold.each(Mold.Defaults.TemplateDirectives, function(directive){
					Mold.Lib.Directive.add(
						directive,
						target,
						that
					);	
				});
			}
			target.moldTemplate = _shadowTemplate.moldTemplate;
			while(_shadowTemplate.hasChildNodes()){
				var targetObserver = new Mold.Lib.Event(_shadowTemplate.firstChild);
				targetObserver.on("DOMNodeInserted", addDirectives);
				target.appendChild(_shadowTemplate.removeChild(_shadowTemplate.firstChild));

			}
			_target = target;
		}
		
		var _buildTree = function(){
			var tree = Mold.Lib.TreeFactory.parseDomTree(_shadowTemplate, new Mold.Lib.Tree("root", false, false, false, that), that);
			return tree;
		}


		

		var _triggerEvent = function(name, e){
			var data = _viewModel;
			if(_snatched[name]){
				var result = _snatched[name].call(this, data);
				if(result === false){
					return false;
				}
			}
			Mold.mixin(data, e);
			this.trigger(name.split("@")[1], data)
		}

		var _hasVar = function(name, tree){
			name = name.replace("{{", "").replace("}}", "");
			var output = false;
			Mold.each(tree, function(treeValue, treeName){
				if(name === treeName){
					 output = true;
					 return "break";
				}else{
					if(treeValue.childs.length){
						Mold.each(treeValue.childs, function(child){
							output = (_hasVar(name, child)) ? true : output
						})
						
					}
				}

			});
			return output;
		}


	

		var _viewModelObject = {
			set : function(model, name, value){
				_viewModel[model] = _viewModel[model] || {};
				_viewModel[model][name] = value;
				that.trigger("viewmodel.change", { model : _viewModel, modelname : model, name : name, value : value })
				return _viewModel[model][name];
			},
			get : function(model, name){
				if(!model && !name){
					return _viewModel;
				}
				if(_viewModel[model] && _viewModel[model][name]){
					return _viewModel[model][name];
				}
				return false;
			},
			remove : function(model, name){
				if(_viewModel[model] && _viewModel[model][name]){
					delete _viewModel[model][name];
					return true;
				}
				return false;
			}
		}


		var _addData = function(template, data, bind){
				Mold.each(template, function(element, name){

					if(data[name] != undefined){

						if(Mold.isArray(data[name])){
							if(bind){
								data[name].on("list.item.add", function(e){
									var filterResult = true;
									
									if(element.filter && element.filter.length){
										//_applyFilter(element);
									}
							
									//if(filterResult){
										if(!element.childs[e.data.index]){
											element.add();
										}else{
											element.show();
											
										}
										_addData(element.childs[e.data.index], e.data.value, bind);
									//}
									
								}).on("list.item.remove", function(e){
									element.remove(e.data.index);
								}).on("list.item.change", function(e){
									_addData(element.childs[e.data.index], e.data.value, bind)
								});
							}
							Mold.each(data[name], function(selectedData, index){
								if(!element.childs[index]){
									element.add();
								}else{
									element.show();		
								}
								_addData(element.childs[index], selectedData, bind);
							})
						}else{
							element.setValue(data[name])

							if(bind){
								data.on("property.change."+name, function(e){
									element.setValue(e.data.value)
								});
							}
						}
						
					}
	
				});
		}

		var _each = function(element, callback){
			
			if(element.childs && element.childs.length){
				Mold.each(element.childs, function(childElement){
					
					Mold.each(childElement, function(selected, name){
						callback.call(this, selected, name);
						_each(selected, callback);
					});
				});
			}
		}

		var _visibility = function(element, callback){
			var rowcount = -1; 
			if(element.childs && element.childs.length){
				var i = 0,
					len = element.childs.length;

				for(; i < len; i++){
					var selected = element.childs[i];
					rowcount++;
					if(
						Mold.some(selected, function(selectedChild, name){
							var output = callback.call(this, selectedChild, rowcount);
							if(output === "exit"){
								i = len;
								return false;
							}
							return output;
						})
					){
						element.show(false, i);
					}else{
						element.hide(i);
					}
				}
			}
		}



		var _applyFilter = function(element){

			if(element.filter && element.filter.length){
				Mold.each(element.filter, function(filterName){
					var filterParts = filterName.split(":");
					filterName =  filterParts[0];
					var filterParameter = (filterParts[1]) ? filterParts[1] : false;

					var filter = Mold.Lib.TemplateFilter.get(filterName);
					if(filter){
						switch (filter.select){
							case "child":
								switch (filter.type){
									case "visibility" :
										_visibility(element, function(child, rowcount){
											return filter.action.call(this, that, {
												child : child,
												viewModel : _viewModel,
												element : element, 
												rowcount : rowcount,
												parameter : filterParameter
											});
										});
										break;
									default:
										break;
								}
								break;
							default:
								break;
						}
					}
				});	
			}
		}

		var _refresh = function(){

			switch(_contentType){
				case "string":
					_compiledTemplate = _parseTemplate(_templateContent);
					break;
				case "node":
					_compiledTemplate = _parseElement(_templateContent);
					break;
				default:
					break;
			}
		}


		if(_config.parseAsString){
			_shadowTemplate = {}
			_compiledTemplate = Mold.Lib.TreeFactory.parseString(_shadowTemplate, content);
			this.trigger("ready");
		}else{
			if(typeof content === "function"){
				
				_templateContent = content.toString().replace(/(^function\s*\(\)\s*\{\s*\/\*\|)([\s\S]*)(\|\*\/\s*\})$/g, function(){
					return arguments[2];
				});

				//Safari Bugfix 
				_templateContent = _templateContent.replace(/^function\s*\(\)\s*\{\s*\/\*\|/g, '');
				_templateContent = _templateContent.replace(/\|\*\/\s*\}$/g, '');

				_templateContent = _templateContent.replace(/ style=/g, ' mold-style=');
		
				_contentType = "string";
				_compiledTemplate = _parseTemplate(_templateContent);
				this.trigger("ready");
			}else if(Mold.isNode(content)){
				_templateContent = content;
				_contentType = "node"
				_compiledTemplate = _parseElement(_templateContent);
			}else{
				console.log("is nothing")
			}
		}


	

		




		this.publics = {
			viewModel : _viewModelObject,
			triggerEvent : _triggerEvent,
			applyFilter : _applyFilter,
			visibility : _visibility,
			each : function(callback){
				_each(_compiledTemplate, callback);
			},
			refresh : function(){
				_refresh();
			},
			snatch : function(data){
				Mold.each(data, function(callback, name){
					_snatched[name] = callback;
				});
				return this;
			},
/**
* @namespace Mold.Lib.Template
* @methode bind
* @desc  bind a Mold model to the Template
* @public
* @return (Object)  returns this;
* @param (model) object - the modelt
**/
			bind : function(model){
				if(!_compiledTemplate){
					throw "Template not compiled!";
				}
				_addData(_compiledTemplate.childs[0], model.data, true);	
				return that;
			},
/**
* @namespace Mold.Lib.Template
* @methode unbind
* @desc  unbind a Mold model from the Template
* @public
* @return (Object)  returns this;
* @param (model) object - the modelt
**/
			unbind : function(model){

				return this;
			},
/**
* @namespace Mold.Lib.Template
* @methode append
* @desc  append a Mold model to the Template, without bindings
* @public
* @return (Object)  returns this;
* @param (model) object - the model
**/
			append : function(model){
				if(!_compiledTemplate){
					throw "Template not compiled!";
				}
				if(model.className && model.className === "Mold.Lib.Model"){
					_addData(_compiledTemplate.childs[0], model.data, false);	
				}else{
					_addData(_compiledTemplate.childs[0], model, false);
				}
				return this;
			},
/**
* @namespace Mold.Lib.Template
* @methode tree
* @desc  returns the template-tree
* @public
* @return (Object)  the template-tree;
**/
			tree : function(){
				return _compiledTemplate;
			},

			hasVar : function(name){
				return _hasVar(name, _compiledTemplate.childs[0]);
			},
			
/**
* @namespace Mold.Lib.Template
* @methode get
* @desc  returns the parsed templates main dom node
* @public
* @return (node)  returns the parsed Template
**/
			get : function(){
				if(_config.parseAsString){
					return _shadowTemplate.nodeValue;
				}
				if(Mold.isNodeJS){
					return _shadowTemplate.innerHTML;
				}else{
					return _shadowTemplate;
				}
			},
			getFirst : function(){
				return _firstElement();
			},
			appendTo : function(target){
				return _appendTo(target);
			},
/**
* @namespace Mold.Lib.Template
* @methode getInner
* @desc  returns the parsed template dom nodes without main node
* @public
* @return (node)  returns the parsed Tempalte inner nodes
**/
			getInner : function(){
				return _shadowTemplate.childNodes;
			}

		}
		
	}
);