"use strict";
Seed({
		name : "Mold.Lib.TreeFactory",
		dna : "static",
		version : "0.0.1",
		include : [
			"Mold.Lib.DomPointer",
			"Mold.Lib.DomLessPointer",
			"Mold.Lib.TemplateDirective",
			"Mold.Lib.Event"
		]
	},
	function(){

		var _shadowTemplate = false,
			_compiledTemplate = false,
			_directive = Mold.Lib.TemplateDirective,
			undefined;

		Mold.mixing(this, new Mold.Lib.Event(this))

/*Add some Textnodes, after this step every templatevariable exists in a single node, without other content*/

		var _preParseTemplate = function(node){
			var expString, regExp, result, targetNode, afterTargetNode, i, jumpSteps;
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
						name = name.replace("^","\\^").replace(/\|/gm, "\\|");
						expString = '([\\s\\S]*?)('+name+')([\\s\\S]*)';
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


		var _trimCache = {};
		var _trim = function(phrase){
			if(_trimCache[phrase]){
				return _trimCache[phrase];
			}

			phrase = phrase.replace(/\n*/gm, "");
			phrase = phrase.replace(/^\s+|\s+$/g, "");
			_trimCache[phrase] = phrase;
			return phrase;
		}

		var _cleanNameCache = {};
		var _cleanVarName = function(name){
			var cache;
			if((cache = _cleanNameCache[name])){
				return cache;
			}
			name = name.split("|")[0];
			_cleanNameCache[name] = name.replace("^", "").replace("#", "").replace("./", "").replace("/", "");
			return _cleanNameCache[name];
		}


		var _isVarCache = {}
		var _isVar = function(phrase){
			var cache = false;
			if(!(cache = _isVarCache[phrase])){
				phrase = phrase.split("|")[0];
				var firstChar = phrase.substring(0,1);
				if( firstChar !== "#" 
					&& firstChar !== "$" 
					&& firstChar != "^" 
					&& firstChar != "/" 
					&& firstChar != ""
				){
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

		var _subContentCache = {};
		var _getSubContent = function(content, beginn, end){
			
			if(_subContentCache[content+beginn+end]){
				return _subContentCache[content+beginn+end];
			}
			var regString = beginn
								.replace("{{", "\{\{")
								.replace("}}", "\}\}")
								.replace("^", "\\^")+'(.*?)'
							+end
								.replace("{{", "\{\{")
								.replace("}}", "\}\}")
								.replace("/","\/");

			var regExp = new RegExp(regString, "g");
			var regresult = regExp.exec(content);
			if(regresult && regresult[1]){
				_subContentCache[content+beginn+end] = regresult[1];
				return regresult[1];
			}else{
				return false;
			}
		}


		var _blockEndCache = {};
		var _checkBlockEnd = function(phrase, needle){
			if(_blockEndCache[phrase+needle] != null){
				return _blockEndCache[phrase+needle];
			}
			var varName = false;
			if(varName = _containsVar(phrase)){
				varName = _trim(varName);
				if(needle == varName){
					_blockEndCache[phrase+needle] = true;
					return true;
				}
			};
			_blockEndCache[phrase+needle] = false;
			return false;
		}

		var _valuePathCache = {};
		var _hasValuePath = function(name){
			if(_valuePathCache[name]){
				return _valuePathCache[name];
			}
			var result = /([\.\/]*)/gm.exec(name);
			if(result && result[1] && result[1] != ""){
				_valuePathCache[name] = result[1];
				return result[1]
			}
			result[1] = false;
			return false;
		}


		var _getBlockNodes = function(node, name){
			var blockList = [];
			name = name.split("|")[0];
			while (node) {
				if(_checkBlockEnd(node.nodeValue, "/"+name.replace("^", "").replace("#", ""))){
					return [node, blockList]
				}
				node = node.nextSibling;
				blockList.push(node);
			}

			return false;
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

		var _nodeBlockCache = {};
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
			//_nodeBlockCache[nodes] = newBlock;
			return newBlock;
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
					var plainName = _cleanVarName(varName);
					if(!ignore){

						if(_isVar(varName)){
							if(data[plainName] && data[plainName].value  && data[plainName].value != ""){
								output += data[plainName].value;
							}
						}
						if(_isBlock(varName) || _isNegativBlock(varName)){
							ignore = true;
						
							if(	
								data[plainName] && data[plainName].value && _isBlock(varName) 
								|| (!data[plainName] || !data[plainName].value && _isNegativBlock(varName))
							){	
								if(data[plainName].subvalue){
										var subContent = _getSubContent(content, "{{"+varName+"}}", "{{/"+plainName+"}}");
										output += _parseStringContent(subContent, data[plainName].subvalue);
								}else{
									var subContent = _getSubContent(content, "{{"+varName+"}}", "{{/"+plainName+"}}");
									output += subContent;
								}
								
							}else{
								var subContent = _getSubContent(content, "{{"+varName+"}}", "{{/"+plainName+"}}");
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
			}
		}

		var that = this;
		
		var _parseDomTree = function(node, tree, template, element, index){

			var varName =  _containsVar(node.nodeValue);
			var directive;
			var nodeName = node.nodeName;
			var nodeType = node.nodeType;
			var nodeValue =  node.nodeValue;

			index = index || 0;

			switch(nodeType){
				//Parse Elementnodes
				case 1:
					element = node;
					if((directive = _directive.get("element", nodeName))){
						directive.apply(node, element, template, index);
					}
					break;
				//Parse Attributenodes
				case 2:
				
					if((directive = _directive.get("attribute", nodeName))){
						directive.apply(node, element, template, index);
					}

					if(varName){
						var pointer = _parseDomLessTree(node, tree, tree);
					};
					break;

				//Parse Textnodes and add them to the tree
				case 3:
					
					if(varName){
						
						var cleanName = _cleanVarName(varName),
							filter = varName.split("|");
							filter.shift();

						if(_isVar(varName)){
						
							var pointer = new Mold.Lib.DomPointer({
								name : varName,
								type : "value",
								node : node,
								subnodes : false,
								stringValue : nodeValue
							});

							
							var valuePath = _hasValuePath(varName);
							tree.addChild(cleanName, pointer, false, valuePath, filter, index);
					

						}else if(_isBlock(varName) || _isNegativBlock(varName)){

							var	subnodes = _getBlockNodes(node, varName),
								blockType = (_isBlock(varName)) ? "block" : "negativblock",
								lastNode = _dom.getLastNode(subnodes),
								shadowDom = _copyNodeBlock(subnodes, lastNode);

							var pointer = new Mold.Lib.DomPointer({
								name : varName.split("|")[0],
								type : blockType,
								node : node,
								shadowDom : shadowDom,
								lastNode : lastNode.nextSibling || lastNode,
								subnodes : subnodes
							});
						
							
							var valuePath = _hasValuePath(varName),
								subtree = tree.addChild(cleanName, pointer, false, valuePath, filter, index);
								tree = _setOpenedTree(cleanName, subtree),
								node.nodeValue = "";

						}else if(_isBlockEnd(varName)){
							var opend = _getOpenedTree(_cleanVarName(varName));
							
							if(opend){
								tree = opend.parent() || tree;
							}
							node.nodeValue = "";
						}
					}
					break;
				default:
					break;
			}

			var i =0,
				subnode = false,
				attributeLen = (node.attributes) ? node.attributes.length : 0;

			if(node.hasChildNodes && node.hasChildNodes() && nodeType != 2){
				var childsNodes =  node.childNodes;
				var nodeLen = childsNodes.length;
				
				for(; i < nodeLen; i++){
					subnode = childsNodes[i];
					tree = _parseDomTree(subnode, tree, template, element, index);	
				}
			}

			i = 0;
			for(; i < attributeLen; i++){
				subnode = node.attributes[i];
				_parseDomTree(subnode, tree, template, element, index);
			}
			
			
			return tree;
		}

		var _parseDomLessTree = function(node, tree, mainTree){
			var content = node.nodeValue;
			var result = content.split(/(\{\{.*?\}\})/gm);
			var i = 0, len = result.length;
			
			//Mold.each(result, function(varName){
			for(; i < len; i++){
				var parent = tree;
				var varName = result[i];
				if((varName = _containsVar(varName))){
				
					if(_isVar(varName)){

						var pointer = new Mold.Lib.DomLessPointer({
							name : varName,
							type : "string-value",
							node : node,
							parent : tree,
							mainTree : mainTree,
							stringValue : node.nodeValue
						});
					
						var valuePath = _hasValuePath(varName)
						tree.addChild(varName, pointer, false, valuePath);
						
					}
					if(_isBlock(varName) || _isNegativBlock(varName)){
					
						var blockType = (_isBlock(varName)) ? "string-block" : "string-negativblock";
						var cleanName =  _cleanVarName(varName);
						var pointer = new Mold.Lib.DomLessPointer({
							name : varName,
							type : blockType,
							node : node,
							parent : tree,
							mainTree : mainTree,
							stringValue : node.nodeValue
						});



						var valuePath = _hasValuePath(varName)
						var subtree = tree.addChild(cleanName, pointer, false, valuePath);
						tree = _setOpenedTree(cleanName, subtree);

					}
					if(_isBlockEnd(varName)){
						var opend = _getOpenedTree(_cleanVarName(varName));	
						if(opend){
							tree = opend.parent() || tree;
						}
					}
				}
			};
		
			return tree;
		}


		var _parseFromTo = function(fromNode, toNode, tree){
			var nextNode = fromNode;
			while(nextNode != null){
				_parseDomTree(nextNode, tree, this);
				if(nextNode === toNode){
					nextNode = null;
					break;
				}
				nextNode = nextNode.nextSibling;
			}

		}


		var _parseCollection = function(collection, tree, template, index){
			var i = 0,
				len = collection.length;
			
			for(; i < len; i++){
				if(Mold.isArray(collection[i])){
					_parseCollection(collection[i], tree, template, index)
				}else{
					_parseDomTree(collection[i], tree, template, false, index);
					
				}
			}
			return tree;
		}


	

		return {
			getCleanName : _cleanVarName,
			preParseTemplate : _preParseTemplate,
			parseStringContent : _parseStringContent,
			parseCollection : _parseCollection,
			parseDomFromTro : _parseFromTo,
			parseDomTree : _parseDomTree,
		}
	}
)