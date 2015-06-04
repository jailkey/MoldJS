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
		var DOM_NODE = 5;
		var TEXT_NODE = 6;
		var ATTRIBUTE_NODE = 6;
		var STRING_NODE = 8;

		//document
		var _doc = document;

		var _createProtoDom = function(content, parent){
			var containerNode = _doc.createElement('div');
			containerNode.innerHTML = content;
			var vdom = Mold.Lib.VDom.DomParser(containerNode.childNodes, parent);
			return vdom
		}

		var _createProtoString = function(content){
			return Mold.Lib.VDom.NodeBuilder(
					Mold.Lib.VDom.StringParser(content),
					true,
					false,
					true
			);
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
								parent : parent || false,
								isString : isStringNode
							}));
							break;

						case BLOCK_NODE:

							if(isStringNode){
								var vdom = _createProtoString(selected.value);
							}else{
								console.log("create block node", parent)
								var vdom = _createProtoDom(selected.value, parent)[1];
							}
							_addToCollection(vDomNodes, getArray, selected.name, new BlockNode({
								name : selected.name,
								parent : parent || false,
								isString : isStringNode
							}));
							break;
					}
				}else{

					if(isStringNode){
				
						var name = "string" + Mold.getId();
						_addToCollection(vDomNodes, getArray, name, new StringNode({
							name : name,
							data : selected.value,
							isString : isStringNode
						}));

					}else{

						var dummy = _doc.createElement("div");
						var i = 0;
						dummy.innerHTML = selected.value;
						var len = dummy.childNodes.length;
						for(; i < len; i++){
							var name = "text" + Mold.getId();
							_addToCollection(vDomNodes, getArray, name, new DomNode({
								name : name,
								isString : isStringNode
							}));
						}
					}
					
				}
			}
			return vDomNodes;
		}
	}
)