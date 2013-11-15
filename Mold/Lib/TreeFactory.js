"use strict";
Seed({
		name : "Mold.Lib.TreeFactory",
		dna : "static"
	},
	function(){


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

		var _parseDomTree = function(node, tree){
			var varName;

			switch(node.nodeType){
				//Parse Attributenodes
				case 2:
					if((varName = _containsVar(node.nodeValue))){
					//	var entryProperies = _createDomLessTree(node.nodeValue, parent, node);
					//	tree = _appendToTree(tree, entryProperies);
					};
					break;

				//Parse Textnodes and add them to the tree
				case 3:
					if((varName = _containsVar(node.nodeValue))){
						if(_isVar(varName)){
							console.log("find var", varName)
							var pointer = new Mold.Lib.DomPointer({
								name : varName,
								type : "value",
								node : node,
								subnodes : false,
								stringValue : node.nodeValue
							});
							
							tree.addChild(varName, pointer)
							

						}else if(_isBlock(varName) || _isNegativBlock(varName)){
							console.log("find block", varName)
							var	subnodes = _getBlockNodes(node, varName),
								blockType = (_isBlock(varName)) ? "block" : "negativblock",
								cleanName = _cleanVarName(varName),
								lastNode = _dom.getLastNode(subnodes);

							var pointer = new Mold.Lib.DomPointer({
								name : varName,
								type : blockType,
								node : node,
								shadowDom : _copyNodeBlock(subnodes, lastNode),
								lastNode : lastNode,
								subnodes : subnodes
							});

							var subtree = tree.addChild(cleanName, pointer);
							

							tree = _setOpenedTree(_cleanVarName(varName), subtree);
							node.nodeValue = "";

						}else if(_isBlockEnd(varName)){
							console.log("find endblock", varName)
							var opend = _getOpenedTree(_cleanVarName(varName));
							
							if(opend){
								tree = opend.parent() || tree;
							}
							node.nodeValue = "";
						}
						//node.nodeValue = "";
					}
					break;
				default:
					break;
			}

			if(node.hasChildNodes && node.hasChildNodes() && node.nodeType != 2){

				var nodeLen = node.childNodes.length,
					i =0,
					subnode = false,
					attributeLen = (node.attributes) ? node.attributes.length : 0;
			
				for(; i < nodeLen; i++){
					subnode = node.childNodes[i];
					tree = _parseDomTree(subnode, tree);	
				}
				i = 0;
				for(; i < attributeLen; i++){
					subnode = node.attributes[i];
					//	_parseDomTree(subnode, tree);
				}
			}
			
			return tree;
		}

		var _parseFromTo = function(fromNode, toNode, tree){
			var nextNode = fromNode;
			while(nextNode != null){
				_parseDomTree(nextNode, tree);
				if(nextNode === toNode){
					nextNode = null;
					break;
				}
				nextNode = nextNode.nextSibling;
			}

		}

		var _parseCollection = function(collection, tree){
			var i = 0,
				len = collection.length;
			
			for(; i < len; i++){
				if(Mold.isArray(collection[i])){
					_parseCollection(collection[i], tree)
				}else{
					console.log("parse Node", collection[i])
					_parseDomTree(collection[i], tree);
					
				}
			}
			return tree;
		}



		return {
			parseCollection : _parseCollection,
			parseDomFromTro : _parseFromTo,
			parseDomTree : _parseDomTree
		}
	}
)