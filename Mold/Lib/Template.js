"use strict";
Seed({
		name : "Mold.Lib.Template",
		dna : "class",
		version : "0.0.3",
		include : [
			"Mold.Lib.Tree",
			"Mold.Lib.TreeFactory"
		]
	},
	function(content){

		var that = this,
			_templateContent = "",
			_shadowTemplate = false,
			_compiledTemplate = false,
			undefined;
			
		
		var _parseTemplate = function(templateContent){
			_applyToDom(templateContent);
			Mold.Lib.TreeFactory.preParseTemplate(_shadowTemplate);
			return _buildTree()
		}


		var _applyToDom = function(template){
			_shadowTemplate = document.createElement("div");
			_shadowTemplate.id = "test";
			_shadowTemplate.innerHTML = template;
			_shadowTemplate.type = "text"
		}

		var _buildTree = function(){
			var tree = Mold.Lib.TreeFactory.parseDomTree(_shadowTemplate, new Mold.Lib.Tree("root"));
			return tree;
		}


		var _addData = function(template, data, bind){
			
			//binddata
		}


		if(typeof content === "function"){
			_templateContent = content.toString().replace(/(^function\s*\(\)\s*\{\s*\/\*\|)([\s\S]*)(\|\*\/\s*\})/g, function(){
				return arguments[2];
			});
		}

		_compiledTemplate = _parseTemplate(_templateContent);

		this.publics = {
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
				_addData(_compiledTemplate, model.data, true);	
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