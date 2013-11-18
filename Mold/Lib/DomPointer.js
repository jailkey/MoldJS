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
			_lastNode = config.lastNode,
			_parentElement = config.parentElement || _node.parentElement,
			_shadowDom = config.shadowDom || false,
			_isVisible = false,
			_valueStore = false,
			_childIndex = false;
			//_node.nodeValue = "";

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

		var _hide_bak = function(pointer, dontremove){
			_isVisible = false;
			if(Mold.isArray(pointer)){
				Mold.each(pointer, function(element){
					if(Mold.isArray(element)){
						_hide(element, dontremove);
					}else{
						if(element.parentNode && element !== dontremove){
							_valueStore.appendChild(element)
						}
					}
				});
			}else{
				_valueStore.appendChild(pointer);
			}

		}

		var _show = function(value){
			if(value.hasChildNodes && value.hasChildNodes()){

				var  subnode = value.firstChild;
				
				while(subnode != null){
				
					var nextNode = subnode.nextSibling;
					if(subnode.hasChildNodes()){
						_show(_show)
					}
					if(subnode){
						_parentElement.insertBefore(subnode, _lastNode);
						_subnodes.push(subnode);
					}

					subnode = nextNode;
				}
			}				
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

			var pointer = new Mold.Lib.DomPointer({
				name : _name,
				type : _type,
				node : node || _node.cloneNode(true),
				parentElement : _parentElement,
				shadowDom : shadowDom || (_shadowDom) ? _copy(_shadowDom) : false,
				lastNode : _lastNode,
				subnodes : subnodes || (_subnodes) ? _copy(_subnodes) : false
			});
	
			return pointer;
		}


		this.publics = {
			node : _node,
			subnodes : _subnodes,
			shadowDom : _shadowDom,
			name : _name,
			getNode : function(){
				return _node;
			},
			setChildIndex : function(index){
				_childIndex = index;
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
				_add(_shadowDom);
			},
			show : function(value){
				if(_type === "value"){
					if(value){
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
				if(_type === "value"){
					_nodeValue = _node.nodeValue;
					_node.nodeValue = "";
				}else{
					_hide(_node.nextSibling, _lastNode, _lastNode);
					/*
					if(_subnodes){
						_hide(_subnodes, _lastNode )
					}
					*/
				}

			}
		}


	}
)