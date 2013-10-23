Seed({
		name : "Mold.Lib.Template",
		dna : "class",
		include : [
			"lib->../../external/mustache.js"
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
			//document.getElementsByTagName("body")[0].appendChild(_shadowTemplate);
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
						var oname = name
						name = "{{"+name+"}}";
						expString = '([\\s\\S]*)('+name+')([\\s\\S]*)';
						regExp  = new RegExp(expString, "gm")
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

		var _containsVar = function(textString){
			if(textString){
				var result = textString.match(/\{\{(.*?)\}\}/gm);
				
				if(result && result[0]){
				
					return result[0].replace("{{","").replace("}}", "");
				}
			}
			return false;
		}

		var _trim = function(phrase){
			phrase = phrase.replace(/\n*/gm, "");
			phrase = phrase.replace(/^\s+|\s+$/g, "");
			return phrase;
		}

		var _isVar = function(phrase){
			
			var firstChar = phrase.substring(0,1);
			if( firstChar !== "#" && firstChar !== "$" && firstChar != "^" && firstChar != "/" && firstChar != ""){
				return true;
			}

			return false;
		}

		var _isBlock = function(phrase){
			var firstChar = phrase.substring(0,1);
			if( firstChar === "#"){
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
				if(_checkBlockEnd(node.nodeValue, "/"+name)){
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
			getLastNode : function(nodeList){
				if(Mold.isArray(nodeList)){
					var lastNode = nodeList[nodeList.length -1];
				}else{
					var lastNode = nodeList;
				}
				if(Mold.isArray(lastNode)){
					Mold.each(lastNode, function(element){
						lastNode = _dom.getLastNode(element);
					});
				}
				return lastNode;
			},

			getFirstNode : function(nodeList){
				if(Mold.isArray(nodeList)){
					var firstNode = nodeList[0];
				}else{
					var firstNode = nodeList;
				}
				if(Mold.isArray(firstNode)){
					Mold.each(firstNode, function(element){
						firstNode = _dom.getLastNode(element);
					});
				}
				return firstNode;
			},

			append : function(parent, reference, tree){
				var pointers = pointers || [];
				if(Mold.isNodeList(tree)){
					var len = tree.length;
					for(var i = 0; i < len; i++){
						var element = tree[0];
						if(!reference){
							parent.appendChild(element);
						}else{
							parent.insertBefore(element, reference);
						}
						pointers.push(element);
					}
				}else{
					if(!reference){
						parent.appendChild(tree);
					}else{
						parent.insertBefore(tree, reference);
					}
					pointers.push(tree);
				}
				return pointers
			},

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
			}

		}


		var _getBlockStringContent = function(blockname, content){
			var regExp = new RegExp('\\{\\{#'+blockname+'\\}\\}([\\s\\S]*)\\{\\{\\/'+blockname+'\\}\\}', 'gmi');
			var result = regExp.exec(content);
			return result[1];
		}

		var _getSubContent = function(content, beginn, end){
			return content.substring(content.lastIndexOf(beginn), content.lastIndexOf(end));
		}

		var _parseStingContent = function(content, data){
			var output = "";
			var result = content.split(/(\{\{.*?\}\})/gm);
			var ignore = false;
			Mold.each(result, function(entry){
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
								Mold.each(data[plainName].childs, function(childElements){
									var subContent = _getSubContent(content, "{{#"+plainName+"}}", "{{/"+plainName+"}}");
									output += _parseStingContent(subContent, childElements)
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
			})
			return output;
		}



		var _createDomLessTree = function(content, parent, parentElement){
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
							stringContent : parentElement.nodeValue,
							isStringContent : true,
							_value : varName,
							value : varName
						}

						Object.defineProperty(entryProperies, "value", {
							get: function(){
								return this._value;
							}, 
							set: function(value){
								this._value = value;
								var newContent = _parseStingContent(this.stringContent, this.mainTree)
								this.parentElement.nodeValue = newContent;
								return this._value;
							},
							enumerable: true,
							configurable: true
						});
						//entryProperies.value = varName;
						tree = _appendToTree(tree, entryProperies, varName);
						mainTree = tree;
					}
					if(_isBlock(varName)){
						varName = varName.replace("#", "");
						var entryProperies = {
							name : varName,
							childs : [],
							parent : parent,
							parentElement : parentElement,
							type : "block",
							parentTree : tree,
							mainTree : mainTree,
							isStringContent : true,
							_value : varName,
							value : varName
						}
						Object.defineProperty(entryProperies, "value", {
							get: function(){
								return this._value;
							}, 
							set: function(value){
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


		var _searchElements = function(node, parent, tree){
			parent = parent || false;
			var varName;
			switch(node.nodeType){
				//Parse Attributenodes
				case 2:
					if((varName = _containsVar(node.nodeValue))){
						var entryProperies = _createDomLessTree(node.nodeValue, parent, node, tree);
						tree = _appendToTree(tree, entryProperies);
					};
					break;
				//Parse Textnodes
				case 3:
					
					
					if((varName = _containsVar(node.nodeValue))){
						varName = _trim(varName);
						if(_isVar(varName)){
							var entryProperies = {
								name : varName,
								parentElement : node.parentElement,
								parent : parent,
								element : node,
								type : "value"
							}

							Object.defineProperty(entryProperies, "value", {
								get: function(){
									return this.element.nodeValue;
								}, 
								set: function(value){
									this.element.nodeValue = value;
									return value;
								},
								enumerable: true,
								configurable: true
							});
							
							tree = _appendToTree(tree, entryProperies, varName);
							node.nodeValue = "";
							
						}else if(_isBlock(varName)){
							varName = _trim(varName.replace("#", ""));
							var blockContent = _getBlockStringContent(varName, node.parentElement.innerHTML);
							var blockNodes = _getBlockNodes(node, varName);
							var lastNode =  _dom.getLastNode(blockNodes);
							var entryProperies = {
								name : varName,
								parentElement : node.parentElement,
								element : node,
								parent : parent,
								content : blockContent,
								nodes : blockNodes[0],
								type : "block",
								value : node.nodeValue,
								lastNode : lastNode,
								childs : [],
								childsPointer : [],
								add : function(element, name){
									var newContent = this.content,
										shadowElement = document.createElement("div");

									shadowElement.innerHTML = newContent;
									_preParseTemplate(shadowElement);
									var newTree = _searchElements(shadowElement, false, {});
									if(this.childsPointer.length < 1){
										this.childs[0] = newTree[0];
									}else{
										this.childs.push(newTree[0]);
									}
									
									this.childsPointer.push(_dom.append(this.parentElement, this.lastNode, shadowElement.childNodes));
								},
								remove : function(index){
									if(index == undefined){
										return false;
									}

									if(!this.childsPointer[index]){
										return false;
									}
									 
									_dom.remove(this.childsPointer[index], this.lastNode);
									this.childsPointer.splice(index, 1);
									if(index !== 0){
										this.childs.splice(index, 1);
									}
								}
							}
							node.nodeValue ="";
							entryProperies.childsPointer.push(blockNodes);
							tree = _appendToTree(tree, entryProperies, varName);
							parent = tree;
							
							if(Mold.isArray(tree)){
								tree = tree[0][varName].childs;
							}else{
								tree = tree[varName].childs;
							}
							
						}else if(_isBlockEnd(varName)){
							varName = _trim(varName.replace("/", ""));
							tree = parent;
							node.nodeValue ="";
							if(Mold.isArray(tree)){
								parent = tree[0][varName].parent
							}else{
								parent = tree.parent
							}
						}
					}
					break;
				default:
					break;
			}
			if(node.hasChildNodes && node.hasChildNodes()){
			 	Mold.each(node.childNodes, function(subnode){
			 			var searchResult= _searchElements(subnode, parent, tree);
						tree = searchResult[0];
						parent = searchResult[1];
			 	});
			 	Mold.each(node.attributes, function(subnode){
			 		var searchResult= _searchElements(subnode, parent, tree);
					tree = searchResult[0];
					parent = searchResult[1];
			 	})
			}
			return [tree, parent];
		}

		var _buildTree = function(){
			var tree = _searchElements(_shadowTemplate, false, {});
			return tree;
		}


		var _addData = function(template, data, bind){
			
			Mold.each(template, function(element){
				if(data[element.name]){
					if(element.type === "value"){
						element.value = data[element.name];
						console.log("intemplate", element.name, element.value, data, bind);
						if(bind){
							data.on("property.change."+element.name, function(e){
								console.log("template property change", element.name, e.data);
								element.value = e.data.value;
							});
						}
					}
					if(element.type === "block"){
						if(Mold.isArray(data[element.name])){
							var index = 0;
							Mold.each(data[element.name], function(subElement, index){
								element.add();
								_addData(element.childs[index], subElement, bind);
							});
							while(data[element.name].length < element.childs.length){
								element.remove(element.childs.length - 1)
							}
							if(bind){
								data[element.name].on("list.item.add", function(e){
									console.log("template item added", e.data)
									element.add();
									_addData(element.childs[e.data.index], e.data.value, bind);
								}).on("list.item.change", function(e){
									console.log("template list Item Change", e.data)
									_addData(element.childs[e.data.index], e.data.value, bind)
								}).on("list.item.remove", function(e){
									console.log("remove", e.data.index)
									element.remove(e.data.index);
								});
							}
						}else{
							if(!element.childsPointer[0]){
								element.add();
							}
							_addData(element.childs[0], data[element.name]);
						}
					}
				}else{
					if(element.type === "value"){
						element.value = "";
					}
					if(element.type === "block"){
						element.remove(0);
					}
					
				}
			})
		}
		




		if(typeof content === "function"){
			_templateContent = content.toString().replace(/(^function\s*\(\)\s*\{\s*\/\*\|)([\s\S]*)(\|\*\/\s*\})/g, function(){
				return arguments[2];
			});
		}

		_compiledTemplate = _parseTemplate(_templateContent)[0];

		this.publics = {
			bind : function(model){
				if(!_compiledTemplate){
					throw "Tempate not compiled!";
				}
				_addData(_compiledTemplate, model.data, true);	
				return that;
			},
			append : function(data){
				if(!_compiledTemplate){
					throw "Tempate not compiled!";
				}
				_addData(_compiledTemplate, data);
			},
			tree : function(){
				return _compiledTemplate;
			},
			get : function(){
				return _shadowTemplate;
			}
		}
		
	}
);