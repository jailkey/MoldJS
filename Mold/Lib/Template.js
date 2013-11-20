"use strict";
Seed({
		name : "Mold.Lib.Template",
		dna : "class",
		version : "0.0.3",
		include : [
			"Mold.Lib.Tree",
			"Mold.Lib.TreeFactory",
			"Mold.Lib.Event"
		]
	},
	function(content){

		var that = this,
			_templateContent = "",
			_shadowTemplate = false,
			_compiledTemplate = false,
			_viewModel = {},
			_snatched = {},
			undefined;

		Mold.mixing(this, new Mold.Lib.Event(this));
			
		


		var _hideTemplate = function(element){
		
				Mold.each(element, function(element){
					if(element.childs && element.childs[0]){
						_hideTemplate(element.childs[0]);
					}
					element.hide()
				
				});
			
		}

		var _parseTemplate = function(templateContent){
			_applyToDom(templateContent);
			Mold.Lib.TreeFactory.preParseTemplate(_shadowTemplate);
			var tree = _buildTree();
			_hideTemplate(tree.childs[0]);
			return tree;
		}


		var _applyToDom = function(template){
			_shadowTemplate = document.createElement("div");
			_shadowTemplate.id = "test";
			_shadowTemplate.innerHTML = template;
			_shadowTemplate.type = "text"
		}
		var that = this;
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
			Mold.mixing(data, e);
			this.trigger(name.split("@")[1], data)
		}


		if(typeof content === "function"){
			_templateContent = content.toString().replace(/(^function\s*\(\)\s*\{\s*\/\*\|)([\s\S]*)(\|\*\/\s*\})/g, function(){
				return arguments[2];
			});
		}


		var _addData = function(template, data, bind){
				Mold.each(template, function(element, name){
					if(data[name] != undefined){
						if(Mold.isArray(data[name])){
							data[name].on("list.item.add", function(e){
								if(!element.childs[e.data.index]){
									element.add();
								}else{
									if(element.isHidden()){
										element.show();
									}
								}
								_addData(element.childs[e.data.index], e.data.value, bind);
							}).on("list.item.remove", function(e){
								element.remove(e.data.index);
							}).on("list.item.change", function(e){
								_addData(element.childs[e.data.index], e.data.value, bind)
							});

						}else{
							element.setValue(data[name])
							data.on("property.change."+name, function(e){
								element.setValue(e.data.value)
							})
						}
						
					}
	
				});
		}

		_compiledTemplate = _parseTemplate(_templateContent);

		this.publics = {
			viewModel : {
				set : function(model, name, value){
					_viewModel[model] = _viewModel[model] || {};
					_viewModel[model][name] = value;
					return _viewModel[model][name];
				},
				get : function(model, name){
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
			},
			triggerEvent : _triggerEvent,
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
					throw "Tempate not compiled!";
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
				_addData(_compiledTemplate, model.data, false);	
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
/**
* @namespace Mold.Lib.Template
* @methode get
* @desc  returns the parsed templates main dom node
* @public
* @return (node)  returns the parsed Template
**/
			get : function(){
				return _shadowTemplate;
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