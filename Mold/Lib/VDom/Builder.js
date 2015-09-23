/**
 * @author Jan Kaufmann <jan@moldjs.de>
 * @description build a vdom from a content-template string
 * @example Mold/Test/Lib/VDom/Builder#build
 */

"user strict";
Seed({
		name : "Mold.Lib.VDom.Builder",
		dna : "class",
		test : "Mold.Test.Lib.VDom.Builder",
		include : [
			"Mold.Lib.Dom",
			"Mold.Tools.Dev.CodeInclude",
			".ProtoNode",
			[
				{ DomNode : ".DomNode" },
				{ BlockNode : ".BlockNode" },
				{ ValueNode : ".ValueNode" },
				{ TextNode : ".TextNode" },
				{ AttributeNode : ".AttributeNode" },
				{ RootNode : ".RootNode" },
				{ Doc : ".VDoc"}
			]
		]
	},
	function(content, config){

		var config = config || {};

		var _dom = new Mold.Lib.Dom(content);
		var _newDoc = Doc;
		var _doc = _dom.get();
		var _template = [];
		var undefined;

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

		var _parseAsText = function(content){
			
		}

		var _getFilter = function(name){
			var filter = {};
			if(~name.indexOf("|")){
				var nameParts = name.split("|");
				name = nameParts.shift();
				var i = 0, len = nameParts.length;

				for(; i < len; i++){
					if(~nameParts[i].indexOf("(")){
						var filterName = nameParts[i].substring(0, nameParts[i].indexOf("("))
						var expression = nameParts[i].substring(nameParts[i].indexOf("(") + 1, nameParts[i].lastIndexOf(")"));
						filter[filterName] = {
							expression : expression
						};
					}else{
						var filterParts = nameParts[i].split(':');
						var y = 1, paramLength = filterParts.length;
						var filterName = filterParts[0];

						filter[filterName] = {};

						for(; y < paramLength; y++){
							var paramParts = filterParts[y].split("=");
							filter[filterName][paramParts[0]] = (paramParts[1]) ? paramParts[1] : true;
						}
					}
				}
			}
			return { name : name, filter : filter}
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
							
							var parts = _getFilter(name);
							var blockNode = new BlockNode({
								name : parts.name,
								filter : parts.filter
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
							var parts = _getFilter(name);
							var valueNode = new ValueNode({
								name : parts.name,
								filter : parts.filter,
								isPointer : (parts.name === ".") ? true : false
							});

							vDom.addNode(valueNode);
							break;
						}

						//Standard text
						if(selected.nodeValue !== undefined && selected.nodeValue !== null && selected.nodeValue !== false){
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

		var rootNode = new RootNode({
			name : "root",
			protoDom : _doc,
			services : {
				template : config.template
			},
		});

		this.dom = _parseNode(_doc, rootNode);

		this.publics = {
		/**
		 * @method render
		 * @description trigger the renderservice
		 * @return {object} returns the renderd vdom
		 * @example Mold/Test/Lib/VDom/Builder.js#render
		 */
			render : function(){
				return rootNode.render();
			},
		/**
		 * @method reRender 
		 * @description reRenders the vdom, recreat dom elements only if needed
		 */
			reRender : function(){
				rootNode.reRender();
			},

		/**
		 * @method renderString 
		 * @description renders the vdom as a string
		 * @return {string} returns a string from the renderd vdom
		 */
			renderString : function(){
				return rootNode.renderString();
			}
		}
	}
)