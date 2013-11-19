Seed({
		name : "Mold.Lib.DomLessPointer",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		],
		compiler : {
			preparsePublics : true
		}
	},
	function(config){
		
		var _name = config.name,
			_type = config.type,
			_mainTree = config.mainTree,
			_node = config.node,
			_stringValue = config.stringValue,
			_parent = config.parent,
			_value = "",
			_childIndex = false;


		var _getChildData = function(childs, data){
			data = data || {};
			Mold.each(childs, function(child){				
				Mold.each(child.pointer, function(pointer, index){
					if(pointer.className === "Mold.Lib.DomLessPointer" && pointer.getNode() === _node){
						var cleanName = Mold.Lib.TreeFactory.getCleanName(pointer.name);
						data[cleanName] = data[cleanName] || {};
						data[cleanName].value = pointer.getValue();
						if(child.childs && child.childs.length){
							if(child.childs[index]){
								var returntData = _getChildData(child.childs[index], false);
								data[cleanName].subvalue = returntData;
							}

						}
					}
				});
			});
			return data;
		}

		var _setChildValues = function(){
			var childs = _mainTree.childs[_childIndex];
			var data = {};
			var data = _getChildData(childs);
			var newValue = Mold.Lib.TreeFactory.parseStringContent(_stringValue, data);
			_node.nodeValue = newValue;
		}

		this.publics = {
			name : _name,
			getType : function(){
				return _type;
			},
			getNode : function(){
				return _node;
			},
			setChildIndex : function(index){
				_childIndex = index;
			},
			getValue : function(){
				return _value;
			},
			show : function(value){
				_value = value;
				_setChildValues();
			},
			hide : function(value){
				_value = value;
				_setChildValues();
			},
			_test : function(){
				if(irgendwas){
					
				}
			}
		}

	}
)