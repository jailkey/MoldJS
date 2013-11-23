"use strict";
Seed({
		name : "Mold.Lib.DomPointer",
		dna : "class",
		compiler : {
			preparsePublics : true
		}
	},
	function(config){

		var _name = config.name,
			_type = config.type,
			_node = config.node,
			_nodeValue = _node.nodeValue,
			_oldValue = _nodeValue,
			_subnodes = config.subnodes,
			_subnodeValues = [],
			_lastShadowNode = config.lastShadowNode,
			_lastNode = config.lastNode,
			_parentElement = config.parentElement || _node.parentElement,
			_shadowDom = config.shadowDom || false,
			_isVisible = false,
			_valueStore = false,
			_filter = config.filter,
			_childIndex = false;

			_node.nodeValue = ""

		

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
							_valueStore = document.createElement("div");
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
						_valueStore = document.createElement("div");
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
						_parentElement.insertBefore(subnode, _lastShadowNode);

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
						// referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
						console.log("append")
						fragment.appendChild(element)
						//_parentElement.insertBefore(element, _lastNode);
					}
				});
			}
			return fragment;
		}

		var _add = function(shadowDom){
			if(shadowDom){
				//var frament = document.createDocumentFragment();
				Mold.each(shadowDom, function(element){
			
					if(Mold.isArray(element)){
						_add(element);
					}else{
						// referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
						_parentElement.insertBefore(element, _lastNode);
					}
				});
				
				
				//_parentElement.insertBefore(_getFragment(shadowDom, document.createDocumentFragment()), _lastNode);
			}
		}

		var _copy = function(nodes, doNotCopy){
			var newBlock = [];
			Mold.each(nodes, function(element){
				if(Mold.isArray(element)){
					newBlock.push(_copy(element, doNotCopy));
				}else{
					if(!doNotCopy || element !== doNotCopy){
						newBlock.push(element.cloneNode(true));
					}
				}
			});

			return newBlock;
		}

		var _clone = function(node, subnodes, shadowDom){

			var shadowCopy = shadowDom || (_shadowDom) ? _copy(_shadowDom) : false;
			var subnodeCopy = subnodes || (_subnodes) ? _copy(shadowCopy)  : false;
			var lastShadowNode = (subnodeCopy) ? _getLastShadowNode(subnodeCopy) : _lastNode;			

			var pointer = new Mold.Lib.DomPointer({
				name : _name,
				type : _type,
				node : node || _node.cloneNode(true),
				parentElement : _parentElement,
				shadowDom : shadowCopy,
				lastShadowNode : lastShadowNode,
				lastNode : _lastNode,
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


		if(!_lastShadowNode){
			_lastShadowNode = _getLastShadowNode(_subnodes)
		}


		this.publics = {
			node : _node,
			subnodes : _subnodes,
			shadowDom : _shadowDom,
			name : _name,
			filter : _filter,
			getNode : function(){
				return _node;
			},
			setChildIndex : function(index){
				_childIndex = index;
			},
			getChildIndex : function(){
				return _childIndex;
			},
			getType : function(){
				return _type;
			},
			getSubnodes : function(){
				return _subnodes;
			},
			getLastNode : function(){
				return _lastNode;
			},
			getFirsNode : function(){
				if(_shadowDom){

				}else{
					return false;
				}
			},
			remove : function(){
				_remove(_subnodes);
				_remove(_shadowDom);
			},
			clone : function(node, subnodes, shadowDom){
				return _clone(node, subnodes, shadowDom);
			},
			add : function(){
				_add(_subnodes);
			},
			show : function(value){
				_isVisible = true;
				if(_type === "value"){
					if(value !== false && value !== "" && value !== undefined){
						_nodeValue = _node.nodeValue;
						_node.nodeValue = value;
					}else{
						_node.nodeValue = _nodeValue;
					}
					
				}else{
					_show(_valueStore)
				}
			},
			hide : function(){
				_isVisible = false;
				if(_type === "value"){
					_nodeValue = _node.nodeValue;
					_node.nodeValue = "";
				}else{
					if(_subnodes){
						_hideList(_subnodes, _lastShadowNode)
						
					}
				}

			},
			isVisible : function(){
				return _isVisible;
			},
			test : function(){
				return "twst"
			}
		}


	}
)