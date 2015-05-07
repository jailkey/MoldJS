Seed({
		name : "Mold.Lib.VDom.NodeBuilder",
		dna : "static",
		include : [
			{ BlockNode : "Mold.Lib.VDom.BlockNode" },
			{ ValueNode : "Mold.Lib.VDom.ValueNode" },
			{ DomNode : "Mold.Lib.VDom.DomNode" },
			{ StringNode : "Mold.Lib.VDom.StringNode" }
		]
	},
	function(){

		//nodetypes
		var VALUE_NODE = 1;
		var BLOCK_NODE = 2;
		var NEGATIVE_BLOCK_NODE = 3;
		var ROOT_NODE = 4;
		var DOM_NODE = 6;
		var ATTR_NODE = 7;
		var STRING_NODE = 8;

		//document
		var _doc = document;


		var _createProtoDom = function(content){

			var containerNode = _doc.createElement('div');
			containerNode.innerHTML = content;

			var vdom = Mold.Lib.VDom.DomParser(containerNode.childNodes);

			return vdom
		}

		var _addToCollection = function(collection, getArray, name, newNode){
			if(getArray){
				collection.push(newNode);
			}else{
				collection[name] = newNode;
			}
			return collection;
		}


		return function(parts, isStringNode, parent, getArray){
			var vDomNodes = (getArray) ? [] : {};

			for(;parts.length;){
				var selected = parts.shift();

				if(selected.type === "node"){
					switch(selected.nodeType){

						case VALUE_NODE:

							_addToCollection(vDomNodes, getArray, selected.name, new ValueNode({
								name : selected.name,
								protoDom : (isStringNode) ? false : _doc.createTextNode("pointer"),
								protoString : (isStringNode) ? selected.name : false,
								parent : parent || false
							}));
							break;

						case BLOCK_NODE:
							
							var vdom = _createProtoDom(selected.value);
							_addToCollection(vDomNodes, getArray, selected.name, new BlockNode({
								name : selected.name,
								content : selected.value,
								type : selected.nodeType,
								protoDom :  vdom[1],
								parent : parent || false
							}));
							break;
					}
				}else{

					if(isStringNode){
				
						var name = "dom" + Mold.getId();
						_addToCollection(vDomNodes, getArray, name, new StringNode({
							name : name,
							data : selected.value
						}));

					}else{

						var dummy = _doc.createElement("div");
						var i = 0;
						dummy.innerHTML = selected.value;
						var len = dummy.childNodes.length;
						for(; i < len; i++){
							var name = "dom" + Mold.getId();
							_addToCollection(vDomNodes, getArray, name, new DomNode({
								name : name,
								protoDom : dummy.childNodes[i]
							}));
						}
					}
					
				}
			}
			return vDomNodes;
		}
	}
)