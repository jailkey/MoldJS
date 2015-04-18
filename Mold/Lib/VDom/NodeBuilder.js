Seed({
		name : "Mold.Lib.VDom.NodeBuilder",
		dna : "static",
		include : [
			{ BlockNode : "Mold.Lib.VDom.BlockNode" },
			{ ValueNode : "Mold.Lib.VDom.ValueNode" },
			{ DomNode : "Mold.Lib.VDom.DomNode" }
		]
	},
	function(){

		//nodetypes
		var VALUE_NODE = 1;
		var BLOCK_NODE = 2;
		var NEGATIVE_BLOCK_NODE = 3;
		var ROOT_NODE = 4;
		var DOM_NODE = 6;

		//document
		var _doc = document;


		var _createProtoDom = function(content){

			var containerNode = _doc.createElement('div');
			containerNode.innerHTML = content;

			var vdom = Mold.Lib.VDom.DomParser(containerNode.childNodes);

			return vdom
		}

		return function(parts){
			var vDomNodes = {};

			for(;parts.length;){

				var selected = parts.shift();
			
				if(selected.type === "node"){
					switch(selected.nodeType){

						case VALUE_NODE:
				
							vDomNodes[selected.name] = new ValueNode({
								name : selected.name,
								protoDom : _doc.createTextNode("pointer")
							});
					

							break;
						case BLOCK_NODE:
						
							var vdom = _createProtoDom(selected.value);
							
							vDomNodes[selected.name] = new BlockNode({
								name : selected.name,
								content : selected.value,
								type : selected.nodeType,
								protoDom :  vdom[1]
							});
							break;
					}
				}else{
					var dummy = _doc.createElement("div");
					var i = 0;
					dummy.innerHTML = selected.value;
					var len = dummy.childNodes.length;
					
					for(; i < len; i++){
						var name = "dom" + Mold.getId();
						vDomNodes[name] = new DomNode({
							name : name,
							protoDom : dummy.childNodes[i]
						});
					}
				

					
				}
			}
			return vDomNodes;
		}
	}
)