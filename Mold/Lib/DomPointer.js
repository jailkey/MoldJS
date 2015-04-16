"use strict";
Seed({
		name : "Mold.Lib.DomPointer",
		dna : "static",
		nodeInclude : [
			"Mold.Lib.Document",
			"Mold.Lib.DomNode"
		],
		compiler : {
			//preparsePublics : true
		}
	},
	function(){
		return function(config){

			var _name = config.name,
				_type = config.type,
				_node = config.node,
				_nodeValue = _node.nodeValue,
				_oldValue = _nodeValue,
				_subnodes = config.subnodes,
				_subnodeValues = [],
				_lastShadowNode = config.lastShadowNode,
				_lastNode = config.lastNode,
				_parentElement = config.parentElement || _node.parentNode,
				_shadowDom = config.shadowDom || false,
				_shadowString = config.shadowString || false,
				_isVisible = false,
				_valueStore = false,
				_filter = config.filter,
				_childIndex = false,
				_doc = false;

				_node.nodeValue = "";


			if(Mold.isNodeJS){
				
				_doc = new Mold.Lib.Document();
			}else{
				_doc = document;
			}

			var _cleanSubnodes = function(){
				var i = 0, len = _subnodes.length;
				for(; i < len; i++){
					_subnodes[i].nodeValue = "";
				}
			}

			var _remove = function(pointer, dontremove){
				Mold.each(pointer, function(element){
					if(Mold.isArray(element)){
						_remove(element, dontremove);
					}else{
						if(element.parentNode && element !== dontremove){
							element.parentNode.removeChild(element);
						}
					}
				});
			}

			var _hideList = function(pointer, dontremove){
				Mold.each(pointer, function(element){
					if(Mold.isArray(element)){
						_hideList(element, dontremove);
					}else{
						if(element.parentNode && element !== dontremove){
							if(!_valueStore){
								_valueStore = _doc.createElement("div");
							}
							_valueStore.appendChild(element);
						}
					}
				});
			}

			var _hide = function(from, to, dontremove){
				var node = from, nextNode;
				while(node != null){

					nextNode = node.nextSibling;
					if(node.parentNode && node !== dontremove){
						if(!_valueStore){
							_valueStore = _doc.createElement("div");
						}
						_valueStore.appendChild(node);
					}
					if(node === to){
						node = null;
						break;
					}else{
						node = nextNode;
					}
				}
			}


			var _show = function(value){
		
				if(value.hasChildNodes && value.hasChildNodes()){
					_subnodes = [];
					var  subnode = value.firstChild;
					
					while(subnode != null){
						
						var nextNode = subnode.nextSibling;
						if(subnode.hasChildNodes()){
							_show(subnode.childNodes)
						}
						if(subnode){
							var lastNode = _getLastShadowNode(_subnodes);
							if(_parentElement){
								if(!_parentElement.parentElement && _lastShadowNode.parentElement){
									_parentElement = _lastShadowNode.parentElement;
								}
								_parentElement.insertBefore(subnode, _lastShadowNode);
							}
							_subnodes.push(subnode);
						}
						subnode = nextNode;
					}
				}				
			}


			var _getFragment = function(shadowDom, fragment){
				if(shadowDom){

					Mold.each(shadowDom, function(element){
				
						if(Mold.isArray(element)){
							_getFragment(element, fragment);
						}else{
							fragment.appendChild(element)
						}
					});
				}
				return fragment;
			}

			var _add = function(shadowDom){
				if(shadowDom){
					Mold.each(shadowDom, function(element){
				
						if(Mold.isArray(element)){
							_add(element);
						}else{
							_parentElement.insertBefore(element, _lastNode);
						}
					});
				}
			}

			var _copy = function(nodes, doNotCopy){
				var newBlock = [], len = nodes.length, i = 0;
				for(;i < len; i++){
					if(Mold.isArray(nodes[i])){
						newBlock.push(_copy(nodes[i], doNotCopy));
					}else{
						if(!doNotCopy || nodes[i] !== doNotCopy){
							newBlock.push(nodes[i].cloneNode(true));
						}
					}
				}

				return newBlock;
			}

			var _clone = function(node, subnodes, shadowDom){
			
				
				if(Mold.isNodeJS){
					var fragment =  new Mold.Lib.DomNode(1, "div");
					fragment.innerHTML = _shadowString;
					var subnodeCopy = fragment.childNodes;
				}else{
					var fragment = document.createElement("div");
					var shadowCopy = shadowDom || (_shadowDom) ? _copy(_shadowDom) : false;
					var subnodeCopy = subnodes || (_subnodes) ? _copy(shadowCopy)  : false;
				}

			
				/*
				var shadowCopy = shadowDom || (_shadowDom) ? _copy(_shadowDom) : false;
				var subnodeCopy = subnodes || (_subnodes) ? _copy(shadowCopy)  : false;
				*/

				var lastShadowNode = (subnodeCopy) ? _getLastShadowNode(subnodeCopy) : _lastNode;	
				
				var pointer = new Mold.Lib.DomPointer({
					name : _name,
					type : _type,
					node : node || _node.cloneNode(true),
					parentElement : _parentElement,
					shadowDom : shadowCopy,
					lastShadowNode : lastShadowNode,
					lastNode : _lastNode,
					shadowString : _shadowString,
					subnodes : subnodeCopy
				});

				
					
				return pointer;
			}

			var _getLastShadowNode = function(element){
				if(Mold.isArray(element)){
					return _getLastShadowNode(element[element.length -1])
				}else{
					return element;
				}
			}

			var _addValue = function(value){
				value = (value !== false && value !== "" && value !== undefined) ? value : _nodeValue;
				if(Mold.isNode(value)){
					_node =_node.parentNode.replaceChild(value, _node);
				}else{
					_node.nodeValue = value;
				}
			}


			if(!_lastShadowNode){
				_lastShadowNode = _getLastShadowNode(_subnodes)
			}


			
			this.node = _node;
			this.subnodes = _subnodes;
			this.shadowDom = _shadowDom;
			this.name = _name;
			this.filter = _filter;
			this.getNode = function(){
					return _node;
			};
			this.setChildIndex = function(index){
				_childIndex = index;
			};
			this.getChildIndex = function(){
				return _childIndex;
			};
			this.getType = function(){
				return _type;
			};
			this.getSubnodes = function(){
				return _subnodes;
			}
			this.getLastNode = function(){
				return _lastNode;
			},
			this.getFirsNode = function(){
				if(_shadowDom){

				}else{
					return false;
				}
			};
			this.remove = function(){
				_remove(_subnodes);
				_remove(_shadowDom);
			};
			this.clone = function(node, subnodes, shadowDom){
				return _clone(node, subnodes, shadowDom);
			};
			this.add = function(){
				_add(_subnodes);
			}
			this.show = function(value){
				_isVisible = true;
				if(_type === "value"){
					_addValue(value);
				}else{
					_show(_valueStore)
				}
			}
			this.hide = function(){
				_isVisible = false;
				if(_type === "value"){
					_nodeValue = _node.nodeValue;
					_node.nodeValue = "";
				}else{
					if(_subnodes){
						_hideList(_subnodes, _lastShadowNode)
						
					}
				}
			}
			this.isVisible = function(){
				return _isVisible;
			}
			this.test = function(){
				return "test"
			}
			
		}

	}
)