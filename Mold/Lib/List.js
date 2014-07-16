Seed({
		name : "Mold.Lib.List",
		dna : "class",
		version : "0.1.1",
		include : [
			"Mold.Lib.Event"
		],
        compiler : {
            disableWrapping : true
        }
	},
	function(data){
		
		var _array = data || [];

		Mold.each(_array, function(element, index){

			Mold.watch(_array, index, function(property, oldValue, newValue){
				_array.trigger("list.item.change." + property, { 
                    index : property,
                    oldValue : oldValue,
                    value : newValue
                });
				return newValue;
			})
		});

	    Mold.mixin(_array, new Mold.Lib.Event(_array));

		_array.oldPush = _array.push;
		_array.oldPop = _array.pop;
		_array.oldShift = _array.shift;
		_array.oldUnShift = _array.unshift;
		_array.oldSplice = _array.splice;
		_array.oldConcat = _array.concat;


		var _creatListItem = function(element, parent, name){
			if(Mold.isArray(element)){
                var oldElement = element;
                element = new Mold.Lib.List();
			}else if(Mold.isObject(element)){
                Mold.each(element, function(subelement, index, value){
                    _creatListItem(subelement, element, index);
                })
			
			}

			Mold.watch(_array, _array.length -1, function(property, oldValue, newValue){
				_creatListItem(newValue);

                _array.trigger("list.item.change", { 
                    list: _array,
                    index : property,
                    oldValue : oldValue,
                    value : newValue,
                    list : _array 
                });

				_array.trigger("list.item.change."+property, { 
                    list: _array,
                    index : property,
                    oldValue : oldValue,
                    value : newValue,
                    list : _array 
                });

                /*ugly workaround for webkit*/
                if(_array.length - 1 === +property){
                    _array.pop();
                    _array.push(newValue);
                }

				return newValue;
			});
            return element;
		}


		_array.push = function() {

            var i = 0,
                len = arguments.length,
                element = false;
    		
            for(; i < len; i++){
                element = arguments[i];
    			_array.oldPush(element);
    			element = _creatListItem(element);
    			_array.trigger("list.item.add", { 
                    length : _array.length,
                    index : _array.length -1,
                    value : element,
                    list : _array
                });
    		};
    	};

    	_array.pop = function(){
    		var value = _array[_array.length -1];
    		var len = (_array.length > 0 ) ? _array.length -1 : 0;
    		
            _array.trigger("list.item.remove", { 
                length : len,
                index : len,
                value : false,
                oldValue : value
            });

    		_array.oldPop();
    		return value;
    	}

    	_array.shift = function(){
    		var value = _array[0];
    		var value = _array[_array.length -1];
    		_array.oldShift();
            var len = (_array.length > 0 ) ? _array.length -1 : 0;
    		_array.trigger("list.item.remove", {
                length : len,
                index : len, 
                value : false,
                oldValue : value
            });
    		return value;
    	}

    	_array.unshift = function(){   
    		var argumentsArray = [];
    		Mold.each(arguments, function(element){
    			argumentsArray.push(element);
    		})
    		argumentsArray = argumentsArray.reverse();
    		Mold.each(argumentsArray, function(element){
    			_array.oldUnShift(element);
    			_creatListItem(element);
    			_array.trigger("list.item.add", { 
                    length : _array.length ,
                    index : _array.length -1,
                    value : _array[_array.length -1]
                });
    			
    		});
    	}

    	_array.concat = function(newArray){
    		Mold.each(newArray, function(element){
    			_array.push(element);
    		});
    	}

    	_array.splice = function(from, len){
    		var argumentsArray = [];
    		var to = from + len -1;
    		var arrayLen = _array.length;

    		Mold.each(arguments, function(element, index){
    			if(index > 1) {
    				argumentsArray.push(element);
    			}
    		});

    		_array.oldSplice.apply(this, arguments);
    		var toDelete = len - argumentsArray.length;
    		for(var i = 0; i < toDelete; i++){
    			var outLen = _array.length + toDelete -i;
    			_array.trigger("list.item.remove", {
                    length : _array.length,
                    index : outLen -1,
                    value : false,
                    oldValue : _array[_array.length - (i+1)]
                });
    		}

    	}

        _array.remove = function(){
            while(_array.length){
                _array.pop();
            }
        }

        _array.each = function(callback){
            Mold.each(_array, callback);
        }

        _array.some = function(callback){
            Mold.some(_array, callback);
        }

        _array.update = function(index, value){
            if(_array[index]){
                _array[index] = value;
            }else{
                _array.push(value)
            }
        }

	   return _array;
	}
);