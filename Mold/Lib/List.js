Seed({
		name : "Mold.Lib.List",
		dna : "class",
		version : "0.1.1",
		include : [
			"Mold.Lib.Event"
		],
		test : "Mold.Test.Lib.List",
		compiler : {
			disableWrapping : true
		}
	},
	function(data){
		
		var _array = data || [];
		var _blacklist = [
			"require", "global", "__filename", "__dirname",
			"module", "exports", "Buffer", "setTimeout", 
			"clearTimeout", "setInterval", "clearInterval", 
			"_eid", "when", "at", "delegate", "bubble", 
			"once", "on", "off"
		]

		Mold.mixin(_array, new Mold.Lib.Event(_array));


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

		var _triggerListChange = function(index, oldValue, newValue){
			_array.trigger("list.item.change." + index, { 
				index : index,
				oldValue : oldValue,
				value : newValue
			});
		}

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
					if(!~_blacklist.indexOf(index)){
						_creatListItem(subelement, element, index);
					}
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
			var len = (_array.length > 0 ) ? _array.length : 0;
			
			_array.trigger("list.item.remove", {
				length : len,
				index : (len > 0) ? len -1 : 0, 
				value : false,
				oldValue : value
			});
			if(Mold.isNodeJS){
				_triggerListChange(0, value, _array[0]);
			}
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
				if(Mold.isNodeJS){
					Mold.each(_array, function(value, index){
						_triggerListChange(index, value, value);
					})
					
				}
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
					if(Mold.isArray(element)){
						argumentsArray = argumentsArray.concat(element);
					}else{
						argumentsArray.push(element);
					}
				}
			});

			var callArgs = [from, len];
			callArgs = callArgs.concat(argumentsArray);
			var lenBefore = _array.length;

			//trigger changes
			var changeLen = from + argumentsArray.length;
			if(changeLen > lenBefore){
				changeLen = lenBefore;
			}
	
			for(var i = from; i < changeLen; i++){
				_array.trigger("list.item.change", {
					index : i,
					oldValue : _array[i],
					value : argumentsArray[i - from],
					list : _array 
				});

				_array.trigger("list.item.change."+i, { 
					index : i,
					oldValue : _array[i],
					value : argumentsArray[i - from],
					list : _array 
				});
			}

			var toDelete = len - argumentsArray.length;		
			for(var i = 0; i < len; i++){
				var outLen = lenBefore + toDelete -i;
				if(!argumentsArray[i]){
					console.log("remove")
					_array.trigger("list.item.remove", {
						length : _array.length,
						index : outLen -1,
						value : false,
						oldValue : _array[_array.length - (i+1)]
					});
				}
			}
			_array.oldSplice.apply(this, callArgs)
			var lenAfter = _array.length;
			var toAdd = lenAfter - lenBefore;
			//moved
			for(var y = lenBefore; y < lenAfter; y++){
		
				_array.trigger("list.item.add", { 
					length : y + 1,
					index : y,
					value : _array[y],
					list : _array
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
				_array.splice(index, 1, value)
			}else{
				_array.push(value)
			}
		}

		_array.replace = function(newArray){
			var lenDif = _array.length - newArray.length;
			_array.splice(0, newArray.length, newArray);
			
			for(var i = 0; i < lenDif; i++){
				_array.pop();
			}
		}

	   return _array;
	}
);