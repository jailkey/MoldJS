Seed({
		name : "Mold.Lib.List",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(data){

		var _array = data || [];

		Mold.each(_array, function(element, index){

			Mold.watch(_array, index, function(property, oldValue, newValue){
				console.log("change", property, oldValue, newValue)
				_array.trigger("list.item.change."+index, { index : property, oldValue : oldValue, value : newValue });
				return newValue;
			})
		});

	    Mold.mixing(_array, new Mold.Lib.Event(_array));

		_array.oldPush = _array.push;
		_array.oldPop = _array.pop;
		_array.oldShift = _array.shift;
		_array.oldSplice = _array.splice;


		_creatListItem = function(element){
			if(Mold.isArray(element)){
				Mold.each(element, function(item, index){
					Mold.watch(element, index, function(property, oldValue, newValue){

						_array.trigger("list.item.change."+property, { index : property, oldValue : oldValue, value : newValue });
						return newValue;
	    			});
				});
			}else if(Mold.isObject(element)){
				Mold.mixing(element, new Mold.Lib.Event(element));
			}

			Mold.watch(_array, _array.length -1, function(property, oldValue, newValue){
				console.log("array value changed", property, oldValue, newValue)
				_creatListItem(newValue);
				_array.trigger("list.item.change", { list: _array, index : property, oldValue : oldValue, value : newValue });
				return newValue;
			});
		}

		_array.push = function() {
    		Mold.each(arguments, function(element){
    			_array.oldPush(element);
    			_creatListItem(element);
    			_array.trigger("list.item.add", { length : _array.length, index : _array.length -1, value : element});
    			
    		});
    	};

    	_array.pop = function(){
    		 var value = _array[_array.length -1];
    		 var len = (_array.length > 1 ) ? _array.length -1 : 0;
    		 _array.trigger("list.item.remove", { length : _array.length, index : len, value : value});
    		 _array.oldPop();
    		 return value;
    	}

    	_array.shift = function(){
    		 var value = _array[0];
    		 _array.oldShift();
    		 _array.trigger("list.item.remove", { length : _array.length, index : 0, value : value});
    		 return value;
    	}

	   
	    return _array;
	}
);