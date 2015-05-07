Seed({
		name : "Mold.Lib.VDom.DomParser",
		dna : "static",
		include : [
			{ StringParser : "Mold.Lib.VDom.StringParser" },
			{ AttrNode : "Mold.Lib.VDom.AttributeNode" }
		],
		test : "Mold.Test.Lib.VDom.DomParser"
	},
	function(){


		//nodetypes
		var VALUE_NODE = 1;
		var BLOCK_NODE = 2;
		var NEGATIVE_BLOCK_NODE = 3;
		var ROOT_NODE = 4;


		var _doc = document;

		var _parseAttributes = function(attributes, parent){
			var i = 0, len = attributes.length, attributeNodes = {};
			for(; i < len; i++){

				var selected = attributes[i];
				var vDom = Mold.Lib.VDom.NodeBuilder(StringParser(selected.nodeValue), true, false, true);

				var newAttribute = new AttrNode({
					name : "attr" + Mold.getId(),
					pointer : selected,
					parent : parent,
					protoDom : vDom,
					attributeName : selected.nodeName.toLowerCase()
				});

				attributeNodes[newAttribute.name] = newAttribute;
			}
			return attributeNodes;
		}


		var _concatValueObject = function(objOne, objTwo){

			Mold.each(objTwo, function(value, name){
				if(objOne[name]){
					objOne[name].addPointer(value.getPointer());
				}else{
					objOne[name] = value;
				}
			})

			return objOne;
		}

		return function(domNodeCollection){
			
			var domNodes = _doc.createDocumentFragment();
			var vDomNodes = {};

			//parse dom node collection
			for(;domNodeCollection.length;){
				var selected = domNodeCollection[0];
				
				switch(selected.nodeType){

					//parse text nodes
					case 3:
						var vDom = Mold.Lib.VDom.NodeBuilder( StringParser(selected.textContent) );
						vDomNodes =  _concatValueObject(vDomNodes, vDom);
						break;

					//parse element node
					case 1:
						var childResult = [];
						var attributeResult = [];

						

						//parse childnodes
						if(selected.childNodes){
							childResult = childResult.concat(Mold.Lib.VDom.DomParser(selected.childNodes));
						}


						var name = "dom" + Mold.getId();
						
						var vDom = new Mold.Lib.VDom.DomNode({
							name : name,
							protoDom : selected,
							children : childResult[1]
						});

						//parse attributes
						if(selected.attributes){
							vDom.attributes = _parseAttributes(selected.attributes, vDom);
						}
			
						var obj = {};
						obj[vDom.name] = vDom;
						vDomNodes =  _concatValueObject(vDomNodes, obj);
						
						break;
				}

				//if output is an array add each item to domNodes fragment
				if(selected.nodeType !== 2){
					if(Mold.isArray(selected)){
						for(;selected.length;){
							domNodes.appendChild(selected.shift());
						}
					}else{
						domNodes.appendChild(selected);
					}
				}
			}
		

			return [domNodes, vDomNodes];
		}
	}
)