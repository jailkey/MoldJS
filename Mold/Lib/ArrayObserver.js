Seed({
		name : "Mold.Lib.ArrayObserver",
		dna : "class",
		version : "0.0.1",
		include : [
			"Mold.Lib.Info",
			"Mold.Lib.Event"
		],
		test : "Mold.Test.Lib.ArrayObserver",
	},
	function(data){
		var _array = data || [];
		var that = this;

		Mold.mixin(this, new Mold.Lib.Event(this));

		var _observerMethod = function(changes){
			that.trigger("change", changes[0])
		}

		var _observe = function(){
			if(Mold.Lib.Info.isSupported('arrayObserve')){
				Array.observe(_array, _observerMethod);
				return this;
			}
			
	
			Mold.each(_array, function(element, index){
				
				Mold.watch(_array, index, function(property, oldValue, newValue){
					if(!that.arrayMethodCalled){
						console.log("trigger change")
						that.trigger("change", {
							index : false,
							type : "update",
							object : _array,
							name : property + "",
							oldValue : oldValue,
							removed : false,
							addedCount : false
						});
					}
					return newValue;
				})
			});

			var _triggerListChange = function(index, oldValue, newValue){
				that.trigger("change", {
					index : false,
					type : "update",
					object : _array,
					name : index,
					oldValue : oldValue,
					removed : false,
					addedCount : false
				})
					
			}

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
					/*
					that.trigger("change", {
						index : false,
						type : "update",
						object : _array,
						name : property,
						oldValue : oldValue,
						removed : false,
						addedCount : false
					})*/
				/*
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
					});*/

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
				_array.splice(_array.length, arguments.length, Array.prototype.slice.call(arguments));
				return _array;
			};

			_array.pop = function(){	
				return _array.splice(_array.length -1, 1);
			}

			_array.shift = function(){
				return _array.splice(0, 1);
			}

			_array.unshift = function(){
				_array.splice(0, 0, Array.prototype.slice.call(arguments));
			}

			_array.concat = function(newArray){
				Mold.each(newArray, function(element){
					_array.push(element);
				});
			}

			_array.splice = function(from, len){
				that.arrayMethodCalled = true;
				var argumentsArray = [];
				var to = from + len -1;
				var arrayLen = _array.length;
				var addCount = 0;

				Mold.each(arguments, function(element, index){
					if(index > 1) {
						if(Mold.isArray(element)){
							argumentsArray = argumentsArray.concat(element);
							addCount = addCount + element.length;
						}else{
							argumentsArray.push(element);
							addCount++;
						}
						
					}
				});
		

				var callArgs = [from, len];
				callArgs = callArgs.concat(argumentsArray);
				var removed = Array.prototype.splice.apply(_array, callArgs);
				that.trigger("change", {
					type : "splice",
					object : _array,
					name : false,
					oldValue : false,
					index : from,
					removed : removed,
					addedCount : addCount
				})
				that.arrayMethodCalled = false;
					console.log("remove method call")
			}
			
		}

		var _unobserve = function(){
			if(Mold.Lib.Info.isSupported('arrayObserve')){
				Array.unobserve(_array, _observerMethod);
				return this;
			}
		}
		


		this.publics = {
			observe : function(callback){
				that.on('change', function(e){
					callback.call(this, e.data)
				});
				_observe();
			},
			unobserve : function(callback){
				that.off('change')
				_unobserve();
			}
	   	};
	}
);