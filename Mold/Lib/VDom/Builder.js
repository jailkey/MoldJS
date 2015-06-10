"user strict";
Seed({
		name : "Mold.Lib.VDom.Builder",
		dna : "class",
		test : "Mold.Test.Lib.VDom.Builder",
		include : [
			"->Mold.Lib.Dom",
			"->Mold.Tools.Dev.CodeInclude",
			"Mold.Lib.VDom.ProtoNode",
			[
				{ DomNode : "Mold.Lib.VDom.DomNode" },
				{ BlockNode : "Mold.Lib.VDom.BlockNode" },
				{ ValueNode : "Mold.Lib.VDom.ValueNode" },
				{ TextNode : "Mold.Lib.VDom.TextNode" },
				{ AttributeNode : "Mold.Lib.VDom.AttributeNode" }
			]
		]
	},
	function(content){

		var _dom = new Mold.Lib.Dom(content);
		var _newDoc = document;
		var _doc = _dom.get();
		var _template = [];

		var BLOCK_START = "{{#";
		var BLOCK_NEGATIV = "{{^";
		var BLOCK_END = "{{/";
		var VALUE = "{{";
		var END = "}}";

		var _parseAttributes = function(attributes, domNode){
			
			var output = {};
			var i = 0, len = attributes.length;

			for(; i < len; i++){

				var selected = attributes[i];
				var newAttribute = new AttributeNode({
					name : selected.nodeName
				})

				domNode.addAttribute(newAttribute);
				newAttribute.addData(selected.nodeValue)

			}
			
		}
		
		var _parseNode = function(node, vDom, level){

			var level = level || 0;
			var parentNode = false;
			var collectedProtoDom = {};
			var i = 0, len = node.childNodes.length; 

			for(; i < len; i++){
				var selected = node.childNodes[i];
				switch(selected.nodeType){

					//handel Elementnode 
					case 1:
				
						var domNode = new DomNode({
							name : selected.nodeName
						});
						
						vDom.addNode(domNode);
						_parseAttributes(selected.attributes, domNode);
						_parseNode(selected, domNode)

						break;

					//handel Textnode
					case 3:
						//Block Node
						if(Mold.startsWith(selected.nodeValue, BLOCK_START)){

							var name = selected.nodeValue.replace(BLOCK_START, "").replace(END, "");
							var blockNode = new BlockNode({
								name : name
							});
							vDom.addNode(blockNode);
							parentNode = vDom;
							vDom = blockNode;

							break;
						}

						//Block Negativ
						if(Mold.startsWith(selected.nodeValue, BLOCK_NEGATIV)){
							var name = selected.nodeValue.replace(BLOCK_NEGATIV, "").replace(END, "");
							var blockNode = new BlockNode({
								name : name,
								isNegative : true
							});
							vDom.addNode(blockNode);
							parentNode = vDom;
							vDom = blockNode;
							break;
						}

						//Block End
						if(Mold.startsWith(selected.nodeValue, BLOCK_END)){
							vDom = vDom.parent;
							break;
						}



						//Value
						if(Mold.startsWith(selected.nodeValue, VALUE)){
							var name = selected.nodeValue.replace(VALUE, "").replace(END, "");
							var valueNode = new ValueNode({
								name : name
							});

							vDom.addNode(valueNode);
							break;
						}

						//Standard text
						if(Mold.trim(selected.nodeValue)){
							var textNode = new TextNode({
								name : "Text" + Mold.getId(),
								data : selected.nodeValue
							});

							vDom.addNode(textNode);
						}

						break;
				}
			}
			return vDom;
		}

		this.dom = _parseNode(_doc, new DomNode({
			name : "root",
			protoDom : _doc
		}));

		this.publics = {

		}
	}
)