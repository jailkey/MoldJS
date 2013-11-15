"use strict";
Seed({
		name : "Mold.Lib.Template",
		dna : "class",
		version : "0.0.2",
		include : [
			"Mold.Lib.Tree",
			"Mold.Lib.DomPointer",
			"Mold.Lib.TreeFactory"
		]
	},
	function(content){
		var that = this;
		var _templateContent = "";
		var _view = {};
		var _templateTree = {};
		var _shadowTemplate = false;
		var _compiledTemplate = false;
		var undefined;

		var _applyToDom = function(template){
			_shadowTemplate = document.createElement("div");
			_shadowTemplate.id = "test";
			_shadowTemplate.innerHTML = template;
			_shadowTemplate.type = "text"
		}

/*Add some Textnodes, after this step every templatevariable exists in a single node, without other content*/
		var _preParseTemplate = function(node){
			var expString, regExp, result, targetNode, afterTargetNode, i, jumpSteps;
			node = node || _shadowTemplate;
			var name = "";
			var steps = 0;
			switch(node.nodeType){
				case 2:
					if((varName = _containsVar(node.nodeValue))){
						
						targetNode = document.createTextNode("test");
						afterTargetNode = document.createTextNode("test 2");
						node.insertBefore(afterTargetNode, node.nextSibling);
						node.insertBefore(targetNode, node.nextSibling);

						steps = 2;
					};
					break;
				case 3:

					if((name = _containsVar(node.nodeValue))){

						var oname = name;
						name = "{{"+name+"}}";
						expString = '([\\s\\S]*?)('+name.replace("^","\\^")+')([\\s\\S]*)';
						regExp  = new RegExp(expString, "gm");
						result = regExp.exec(node.nodeValue);
						targetNode = document.createTextNode(result[2]);
						afterTargetNode = document.createTextNode(result[3]);
						
						node.parentNode.insertBefore(afterTargetNode, node.nextSibling);
						node.parentNode.insertBefore(targetNode, node.nextSibling);
						node.nodeValue = result[1];
						steps = 1;
					}
					break;
				default:
					break;
			}

			if(node.hasChildNodes()){
				for(var i = 0; i < node.childNodes.length; i++){
			 		jumpSteps = _preParseTemplate(node.childNodes[i]);
			 		i = i + jumpSteps;
			 		if(i == 100){
			 			break;
			 		}
			 	}
			}
			return steps;

		}
		
		var _parseTemplate = function(templateContent){
			_applyToDom(templateContent);
			_preParseTemplate();
			return _buildTree()
		}

		var _containsCache = {}
		var _containsVar = function(textString){
			if(_containsCache[textString] != null){
				return _containsCache[textString];
			}
			if(textString){
				var result = textString.match(/\{\{(.*?)\}\}/gm);
				
				if(result && result[0]){
					
					return _containsCache[textString] = result[0].replace("{{","").replace("}}", "");
				}
			}
			return _containsCache[textString] = false;
		}

		var _trim = function(phrase){
			phrase = phrase.replace(/\n*/gm, "");
			phrase = phrase.replace(/^\s+|\s+$/g, "");
			return phrase;
		}

		var _cleanVarName = function(name){
			return name.replace("^", "").replace("#", "").replace("/", "");
		}


		var _isVarCache = {}
		var _isVar = function(phrase){
			var cache = false;
			if(!(cache = _isVarCache[phrase])){
				var firstChar = phrase.substring(0,1);
				if( firstChar !== "#" && firstChar !== "$" && firstChar != "^" && firstChar != "/" && firstChar != ""){
					return _isVarCache[phrase] = true;
				}

				return _isVarCache[phrase] = false;
			}else{
				return cache;
			}
		}

		var _isBlock = function(phrase){
			var firstChar = phrase.substring(0,1);
			if( firstChar === "#"){
				return true;
			}
			return false;
		}

		var _isNegativBlock = function(phrase){
			var firstChar = phrase.substring(0,1);
			if( firstChar === "^"){
				return true;
			}
			return false;
		}


		var _isBlockEnd = function(phrase){
			if(phrase){
				var firstChar = phrase.substring(0,1);
				if(firstChar === "/"){
					return true;
				}
			}
			return false;
		}

		var _checkBlockEnd = function(phrase, needle){
			var varName = false;
			if(varName = _containsVar(phrase)){
				varName = _trim(varName);
				if(needle == varName){
					return true;
				}
			};
			return false;
		}



		var _getBlockNodes = function(node, name){
			var blockList = [];
			while (node) {
				if(_checkBlockEnd(node.nodeValue, "/"+name.replace("^", "").replace("#", ""))){
					return [node, blockList]
				}
				node = node.nextSibling;
				blockList.push(node);
			}
			return false;
		}


		var _appendToTree = function(tree, value, name){
			if(!name){
				if(Mold.isArray(tree)){
					tree[0] = tree[0] || {}
					Mold.mixing(tree[0], value);
				}else{
					Mold.mixing(tree, value);
				}
			}else{
				if(Mold.isArray(tree)){
					tree[0] = tree[0] || {}
					tree[0][name] = value;
				}else{
					tree[name] = value;
				}
			}
			return tree;
		}

//Domfunction 
		var _dom = {





			remove : function(pointer, dontremove){
				Mold.each(pointer, function(element){
					if(Mold.isArray(element)){
						_dom.remove(element, dontremove);
					}else{
						if(element.parentNode && element !== dontremove){
							element.parentNode.removeChild(element);
						}
					}
				});
			},

			clean : function(pointer, dontremove){
				Mold.each(pointer, function(element){
					if(Mold.isArray(element)){
						_dom.clean(element, dontremove);
					}else{
						if(element !== dontremove){
							element.nodeValue ="";
						}
					}
				});
			},

			cleanBetween : function(start, end){
				while(start !== end){
					_dom.clean(start);
					start = node.nextSibling();
				}
			}

		}

		var _opendBlocksCache = {};
		var _setOpenedTree = function(name, value){

			_opendBlocksCache[name] = value;
			return value;
		}

		var _getOpenedTree = function(name){
			var openBlock = _opendBlocksCache[name];
			if(openBlock){
				delete _opendBlocksCache[name];
				return openBlock;
			}
			return false;
		}

		var _copyNodeBlock = function(nodes, doNotCopy){
			var newBlock = [];
			Mold.each(nodes, function(element){
				
				if(Mold.isArray(element)){
					newBlock.push(_copyNodeBlock(element, doNotCopy));
				}else{

					if(!doNotCopy || element !== doNotCopy){
						newBlock.push(element.cloneNode(true));
					}
				}
			});
			return newBlock;
		}

		var _blockStringContentCache = {}
		var _getBlockStringContent = function(blockname, content, node){
			var result = false;
			if(!(result = _blockStringContentCache[blockname+content])){
				var startBlockname = blockname.replace("^", "\\^");
				var endBlockname = blockname.replace("^", "").replace("#", "");
				var regExpString = '\\{\\{'+startBlockname+'\\}\\}([\\s\\S]*?)\\{\\{\\/'+endBlockname+'\\}\\}';
				var regExp = new RegExp(regExpString, 'gmi');
				result = regExp.exec(content);
				_blockStringContentCache[blockname+content] = result;
			}else{
				
			}
		
			return result[1];
		}

		var _getSubContent = function(content, beginn, end){
			return content.substring(content.lastIndexOf(beginn) +beginn.length, content.lastIndexOf(end));
		}

		var _checkParentEqualChildAndEmpty = function(childs, name){
			return Mold.some(childs, function(element) {
				if(element.name === name){
					if(!element.value){
						return true;
					}
				}
				return false;
			});
		}

		var _cachenContentPartsResults = {}
		var _parseStringContent = function(content, data){

			var output = "",
				result = "",
				cache = false;

			if(!(cache = _cachenContentPartsResults[content])){
				result = content.split(/(\{\{.*?\}\})/gm);
				_cachenContentPartsResults[content] = { result : result };
			
			}else{
				result = cache.result; 
			}

			var ignore = false,
				i =0,
				len = result.length,
				varName = false;

			for(; i < len; i++){
				var entry = result[i];
				if((varName = _containsVar(entry))){
					var plainName = varName.replace(/[#|^|\/]/, "");
					if(!ignore){
						if(_isVar(varName)){
							if(data[plainName]  && data[plainName].value != ""){
								 
								output += data[plainName].value;
							}
						}
						if(_isBlock(varName)){
							if(data[plainName]){

								ignore = true;
								Mold.each(data[plainName].childs, function(childElements, name){
									if(!_checkParentEqualChildAndEmpty(childElements, plainName)){
										var subContent = _getSubContent(content, "{{#"+plainName+"}}", "{{/"+plainName+"}}");
										output += _parseStringContent(subContent, childElements)
									}
								});
							}
						}

					}
					if(_isBlockEnd(varName)){
						ignore = false;
					}
				}else{
					if(!ignore){
						output += entry;
					}
				}
			}
			return output;
		}

		var _createShadowBlock = function(content){
			var shadowElement = document.createElement("div");
			shadowElement.innerHTML = content;
			_preParseTemplate(shadowElement);
			return shadowElement;
		}


		var _createDomLessTree = function(content, parent, parentElement, stringContent, parentMainTree){
			var tree = {};
			var mainTree = {};
			var result = content.split(/(\{\{.*?\}\})/gm);
		
			Mold.each(result, function(varName){
				
				if((varName = _containsVar(varName))){
					mainTree = tree;
					if(_isVar(varName)){
						var entryProperies = {
							name : varName,
							parent : parent,
							parentElement : parentElement,
							type : "value",
							parentTree : tree,
							mainTree : mainTree, 
							stringContent : stringContent || parentElement.nodeValue,
							isStringContent : true,
							_value : false,
							value : false
						}
						Object.defineProperty(entryProperies, "value", {
							get: function(){
								return this._value;
							}, 
							set: function(value){
								this._value = value;
								var newContent = _parseStringContent(this.stringContent, parentMainTree || this.mainTree)
								this.parentElement.nodeValue = newContent;
								return this._value;
							},
							enumerable: true,
							configurable: true
						});
						tree = _appendToTree(tree, entryProperies, varName);
						mainTree = tree;
					}
					if(_isBlock(varName) || _isNegativBlock(varName)){
						varName = varName.replace("#", "");
						var blockContent = _getBlockStringContent(varName, content);

						var entryProperies = {
							name : varName,
							childs : [],
							childsPointer : [],
							parent : parent,
							parentElement : parentElement,
							type : (_isNegativBlock(varName)) ? "negativblock" : "block",
							content : blockContent,
							parentTree : tree,
							mainTree : mainTree,
							stringContent : parentElement.nodeValue,
							isStringContent : true,
							_value : varName,
							value : varName,
							add : function(element, name){
								var newContent = this.content;
								
								var newTree = _createDomLessTree(this.content, this.parent, this.parentElement, this.stringContent, this.mainTree);
								if(this.childsPointer.length < 1){
									this.childs[0] = newTree;
								}else{
									this.childs.push(newTree);
								}
								this.childsPointer.push(newTree);
								var newContent = _parseStringContent(this.content, this.mainTree[this.name])
								this.parentElement.nodeValue = newContent;
								
							},
							remove : function(index){
							}
						}
						Object.defineProperty(entryProperies, "value", {
							get: function(){
								return this._value;
							}, 
							set: function(value){
								this._value = value;
								return this._value;
							},
							enumerable: true,
							configurable: true
						});
						entryProperies.value = varName;
						tree = _appendToTree(tree, entryProperies, varName);
						parent = tree;
						mainTree = tree;
						if(Mold.isArray(tree)){
							tree = tree[0][varName].childs;
						}else{
							tree = tree[varName].childs;
						}						
					}
					if(_isBlockEnd(varName)){
						varName = _trim(varName.replace("/", ""));
						mainTree = tree;
						tree = parent;
						if(Mold.isArray(tree)){
							parent = tree[0][varName].parent
						}else{
							parent = tree.parent
						}
					}
				}
			});
			mainTree = tree;
			return tree;
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