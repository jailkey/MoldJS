"use strict";
Seed({
		name : "Mold.Lib.Tree",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(name, parent){

		Mold.mixing(this, new Mold.Lib.Event(this));

		var _childs = [],
			_name = name,
			_value = [],
			_pointer = [],
			_parent = parent || false,
			undefiend;

		var _showPointerValue = function(pointerList, value){

			var len = pointerList.length,
				pointerUpdates = [],
				i = 0;

			for(; i < len; i++){
				var pointer = pointerList[i];
				switch(pointer.getType()){
					case "value":
						pointer.show(value);
						break;
					case "block":
						pointer.show(value);
						break;
					case "negativblock":
						pointer.hide();
						break;
					default:
						break;
				}
			}
		}

		var _hiddePointerValue = function(pointerList, value){

			var len = pointerList.length,
				pointerUpdates = [],
				i = 0;

			for(; i < len; i++){
				var pointer = pointerList[i];
				switch(pointer.getType()){
					case "value":
						pointer.hide();
						break;
					case "block":
							pointer.hide();
					
						break;
					case "negativblock":
						pointer.show(value);
						break;
					default:
						break;
				}
			}
		}

		var _clone = function(notrecusiv){
			
			var newTree = new Mold.Lib.Tree(_name, _parent),
				selfPointerClone = _pointer[0].clone();

				Mold.Lib.TreeFactory.parseCollection(selfPointerClone.shadowDom, newTree);
				_childs.push(newTree.childs[0])
				_pointer.push(selfPointerClone);
				selfPointerClone.add();

			return newTree;
		}

		this.publics = {
			parent : function(){
				return _parent;
			},
			addPointer : function(value){
				_pointer.push(value);
				this.trigger("pointer.add", { node : this });
				return this;
			},
			getPointer : function(){
				return _pointer;
			},
			setValue : function(value){
				_value = value;
		
				if(value != "" && value != false && value !== undefiend){
					_showPointerValue(_pointer, value);
				}else{
					_hiddePointerValue(_pointer, value);
				}
				return this;
			},
			getValues : function(){
				return _value;
			},
			childExists : function(name, index){
				index = index || 0;
				return !!_childs[index][name];
			},
			add : function(){
				_clone();
			},
			addChild : function(name, value, index){
				var index = index || 0;
				_childs[index] = _childs[index] || {};
				if(!_childs[index][name]){
					_childs[index][name] = new Mold.Lib.Tree(name, this);
				}
				_childs[index][name].addPointer(value);


				this.trigger("child.add", { node : this })
				return _childs[index][name];
			},
			hasChilds : function(){
				return !!Mold.keys(_childs[0]).length;
			},
			getChild : function(name, index){
				index = index || 0;
				return _childs[index][name];
			},
			getChilds : function(){
				return _childs;
			},
			clone : function(notrecusiv){
				return _clone(notrecusiv);
			},
			childs : _childs,
			value : _value,
			pointer : _pointer,
			name : _name,
		}
	}
)