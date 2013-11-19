"use strict";
Seed({
		name : "Mold.Lib.Tree",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		],
		compiler : {
			//preparsePublics : true
		}
	},
	function(name, parent, valuePath, index, template){

		var _childs = [],
			_name = name,
			_value = false,
			_pointer = [],
			_parent = parent || false,
			_isHidden = false,
			_setValueListener = [],
			_valuePath = valuePath || false,
			that = this,
			_index = index || false,
			_template = template || false;
			undefined;


	

		var _checkThisValue = function(name, parent){
			
			if(name.indexOf("this.") > -1){
				var lastParent = parent,
					itemList = name.split("."),
					len = itemList.length,
					i = 1;

				while(parent){
					lastParent = parent;
					parent = lastParent.parent();
				}

				for(; i < len; i++){
					lastParent = lastParent.childs[0][itemList[i]];
				}

				if(lastParent){
					lastParent.onValue(function(updateValue){
						that.setValue(updateValue);
					});
				}
			}
		}

		_checkThisValue(_name, _parent);

		var _setValuePath = function(){
			if(_valuePath){
				if(_valuePath == "."){
					_parent.onValue(function(updateValue){
						that.setValue(updateValue);
					});
				}else{
					if(_index !== false){
						var countPathes = _valuePath.split("./").length,
							i = 1,
							valueParent = _parent;
						
						for(; i < countPathes; i++){
							valueParent = valueParent.parent();
						}
					
						valueParent.childs[_index][_name].onValue(function(updateValue){
							that.setValue(updateValue);
						});
					}
				}
			}
		}

		var _onSetValue = function(value){
			var i = 0,
				len = _setValueListener.length;

			for(; i < len; i++){
				_setValueListener[i].call(this, value);
			} 
		}

		var _onValue = function(callback){
			_setValueListener.push(callback);
		}

		var _showPointerValue = function(pointerList, value){
			var len = pointerList.length,
				pointerUpdates = [],
				i = 0;


			for(; i < len; i++){
				var pointer = pointerList[i];
				switch(pointer.getType()){
					case "string-value":
						pointer.show(value);
						break;
					case "string-block":
						pointer.show(value);
						break;
					case "string-negativblock":
						pointer.hide(value);
						break;
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

		var _hidePointerValue = function(pointerList, value){

			var len = pointerList.length,
				pointerUpdates = [],
				i = 0;

			for(; i < len; i++){
				var pointer = pointerList[i];
				switch(pointer.getType()){
					case "string-value":
						pointer.hide();
						break;
					case "string-block":
				
						pointer.hide();
						break;
					case "value":
						pointer.hide();
						break;
					case "block":
						pointer.hide();
						break;
					case "string-negativblock":
					
						pointer.show(value);
						break;
					case "negativblock":
						pointer.show(value);
						break;
					default:
						break;
				}
			}
		}



		var _clone = function(){
			
			var newTree = new Mold.Lib.Tree(_name, _parent, _valuePath, 0, _template),
				selfPointerClone = _pointer[0].clone();
				_index = _childs.length;
				Mold.Lib.TreeFactory.parseCollection(selfPointerClone.shadowDom, newTree, template, _index);
				_childs.push(newTree.childs[0])
				_pointer.push(selfPointerClone);
				
				selfPointerClone.add();
			return newTree;
		}

		_hidePointerValue(_pointer);

		this.publics = {

			
			childs : _childs,
			pointer : _pointer,
			name : _name,
			valuePath : _valuePath,

			isHidden : function(){
				return _isHidden;
			},
			parent : function(){
				return _parent;
			},
			addPointer : function(value){
				_pointer.push(value);
				return this;
			},
			getPointer : function(){
				return _pointer;
			},
			onValue : function(callback){
				_onValue(callback)
			},
			setValue : function(value){
				_value = value;
				if(value != "" && value !== false && value !== undefined){
					_showPointerValue(_pointer, value);
				}else{
					_hidePointerValue(_pointer, value);
				}
				_onSetValue(_value);
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

			remove : function(index){
				if(index === null || index === undefined)  { throw "Index is not defined!" }
				if(index === 0){
					this.hide(0);
				}else{
					if(_pointer && _pointer[index]){
						_pointer[index].remove();
						_pointer.splice(index, 1);
					}
					if(_childs[index]){
						_childs.splice(index);
					}
				}
			},

			hide : function(index){
				if(!index){
					_isHidden = true;
					_hidePointerValue(_pointer);
				}
			},

			show : function(index){
				if(!index){
					_isHidden = false;
					_showPointerValue(_pointer);
				}
			},
			addChild : function(name, value, index, valuePath){
				var index = index || 0;
				_childs[index] = _childs[index] || {};
				if(!_childs[index][name]){
					_childs[index][name] = new Mold.Lib.Tree(name, this, valuePath, index, _template);
				}
				_childs[index][name].addPointer(value);
				_childs[index][name].setIndex(index);
				value.setChildIndex(index);
				return _childs[index][name];
			},

			hasChilds : function(){

				return !!_childs.length;
			},

			getChild : function(name, index){
				index = index || 0;
				return _childs[index][name];
			},

			getChilds : function(){
				return _childs;
			},
			setIndex : function(value){
				_index = value;
				_setValuePath();
			},
			getIndex : function(value){
				return _index;
			},
			getChildIndex : function(){
				return _childs.length -1;
			},
			clone : function(notrecusiv){
				return _clone(notrecusiv);
			}			
		}
		
	}
)