"use strict";
Seed({
		name : "Mold.Lib.Tree",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		],
		compiler : {
			preparsePublics : true
		}
	},
	function(name, parent, valuePath, index, template, filter){

		var _childs = [],
			_name = name.split("|")[0],
			_value = "",
			_pointer = [],
			_filter = filter,
			_parent = parent || false,
			_isHidden = false,
			_setValueListener = [],
			_valuePath = valuePath || "",
			_index = index || false,
			_template = template || false,
			_visibileChilds = 0,
			that = this,
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


		var _showPointer = function(pointer, value){
			var oldVisibility = pointer.isVisible();
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
			if(oldVisibility !== pointer.isVisible()){
				_visibileChilds++;
			}
		}

		var _showPointerValue = function(pointerList, value){
			var len = pointerList.length,
				i = 0;

			for(; i < len; i++){
				var pointer = pointerList[i];
				_showPointer(pointer, value)

			}
		}

		var _hidePointer = function(pointer, value){
			var oldVisibility = pointer.isVisible();
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
			if(oldVisibility !== pointer.isVisible()){
				_visibileChilds--;
			}
		}

		var _hidePointerValue = function(pointerList, value){

			var len = pointerList.length,
				pointerUpdates = [],
				i = 0;

			for(; i < len; i++){
				var pointer = pointerList[i];
				_hidePointer(pointer, value);
			}
		}



		var _clone = function(){
			
			var newTree = new Mold.Lib.Tree(_name, _parent, _valuePath, 0, _template, _filter),
				selfPointerClone = _pointer[0].clone(),
				index = _childs.length;

				Mold.Lib.TreeFactory.parseCollection(selfPointerClone.subnodes, newTree, template, index, _filter);
				_childs.push(newTree.childs[0]);
				_pointer.push(selfPointerClone);
				
				selfPointerClone.add();
			return newTree;
		}


		var _getVisibleChilds = function(){
			var output = 0,
				i = 0,
				len  = _pointer.length;
			for(; i < len; i++){
				output += (_pointer[i].isVisible()) ? 1 : 0;
			};
			return output;
		}

		this.publics = {

			
			childs : _childs,
			pointer : _pointer,
			name : _name,
			valuePath : _valuePath,
			filter : _filter,
			visibleChildLength : function(){
				return _visibileChilds;
			},
			isHidden : function(){
				return _isHidden;
			},
			isChildHidden : function(index){
				return !_pointer[index].isVisible();
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
				if(index === undefined) {
					_isHidden = true;
					_hidePointerValue(_pointer);
				}else{
					if(_pointer[index]){
						_hidePointer(_pointer[index]);
					}
				}
			},

			show : function(value, index){
				if(index === undefined){
					_isHidden = false;
					_showPointerValue(_pointer, value);
				}else{
					if(_pointer[index]){
						_showPointer(_pointer[index], value);
					}
				}
			},
			addChild : function(name, value, index, valuePath, filter, childIndex){
				var index = index || 0;
				_childs[index] = _childs[index] || {};
				if(!_childs[index][name]){
					_childs[index][name] = new Mold.Lib.Tree(name, this, valuePath, index, _template, filter);
				}
				_childs[index][name].addPointer(value);
				_childs[index][name].setIndex(childIndex);
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