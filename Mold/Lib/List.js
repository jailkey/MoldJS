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
				_array.trigger("change", { index : property, oldValue : oldValue, value : newValue });
				return newValue;
			})
		});

	    Mold.mixing(_array, new Mold.Lib.Event(_array));

		_array.oldPush = _array.push;
		_array.oldPop = _array.pop;
		_array.oldShift = _array.shift;
		_array.oldSplice = _array.splice;

		_array.push = function() {
    		Mold.each(arguments, function(element){
    			_array.oldPush(element);
    			_array.trigger("add", { length : _array.length, index : _array.length -1, value : element});
    			if(Mold.isArray(element)){
    				Mold.each(element, function(item, index){
    					Mold.watch(element, index, function(property, oldValue, newValue){
							_array.trigger("change", { index : property, oldValue : oldValue, value : newValue });
							return newValue;
		    			});
    				});
    			}
    			Mold.watch(_array, _array.length -1, function(property, oldValue, newValue){
    				console.log("change", property, oldValue, newValue)
					_array.trigger("change", { index : property, oldValue : oldValue, value : newValue });
					return newValue;
    			});
    		});
    	};

    	_array.pop = function(){
    		 var value = _array[_array.length -1];
    		 _array.oldPop();
    		 _array.trigger("remove", { length : _array.length, index : _array.length -1, value : value});
    		 return value;
    	}

    	_array.shift = function(){
    		 var value = _array[0];
    		 _array.oldShift();
    		 _array.trigger("remove", { length : _array.length, index : 0, value : value});
    		 return value;
    	}

	   
	    return _array;
	}
);