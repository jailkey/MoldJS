"use strict";
Seed (
	{ 
		name : "Mold.Lib.Document",
		dna : "class",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.DomNode",
			"Mold.Lib.DomParser"
		],
		version : 0.1,
		test : "Mold.Test.Lib.Document"
	},
	function(markup){
		
		var _root = false,
			that = this;


		if(typeof markup === "function"){
			markup = markup.toString().replace(/(^function\s*\(\)\s*\{\s*\/\*\|)([\s\S]*)(\|\*\/\s*\})/g, function(){
				return arguments[2];
			});

		}

		var _getElementByPropertieValue = function(callback, elements){
			var output = [];
			elements = elements || _root.childNodes;
			Mold.each(elements, function(node){
				var value = node.nodeValue;
				if(callback.call(this, node)){

					if(node.nodeType === 2){
						output.push(node.parentNode);
					}else if(node.nodeType === 1){
						output.push(node);
					}
				}
				if(node.childNodes.length > 0 ){
					output = output.concat(_getElementByPropertieValue(callback, node.childNodes));
				}
				if(node.attributes.length > 0 ){
					output = output.concat(_getElementByPropertieValue(callback, node.attributes));
				}
			});
			return output;
		}

		var _createElement = function(name){
			return new Mold.Lib.DomNode(1, name);
		}

		var _createAttribute = function(name){
			return new Mold.Lib.DomNode(2, name);
		}

		var _createTextNode = function(text){
			var textNode = new Mold.Lib.DomNode(3);
			textNode.nodeValue = text;
			return textNode;
		}

		var _createDocumentFragment = function(){
			return new Mold.Lib.DomNode(11);
		}
		
		
		_root = Mold.Lib.DomParser.parse(markup);

		this.publics = {
			get : function(){
				return _root;
			},
			getElementById : function(id){
				var elements = _getElementByPropertieValue(function(node){
					if(node.nodeType === 1){
						var nodeId = node.getAttribute('id');
						if(nodeId === id){
							return true;
						}else{
							return false;
						}
					}
				});
				return (elements[0]) = elements[0] || false;
			},
			getElementsByTagName : function(tagname){
				var elements = _getElementByPropertieValue(function(node){
					if(node.nodeType === 1){
						if(node.nodeName === tagname){
							return true;
						}else{
							return false;
						}
					}
				});
				return elements
			},
			createElement : function(name){
				return _createElement(name);
			},
			createAttribute : function(name){
				return _createAttribute(name);
			},
			createTextNode : function(text){
				return _createTextNode(text);
			},
			createDocumentFragment : function(){
				return _createDocumentFragment();
			}

		}
	}
);