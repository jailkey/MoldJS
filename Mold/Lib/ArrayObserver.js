/**
 * @module Mold.Lib.ArrayObserver
 * @description class creates an observer used for ansynchronously observing changes to an array
 * @param {array} data the array to observe
 * @event change fires when the array has changed, the event data has following properties:  
	
	- type : splice or update,  
	- object : the changed object after the,  
	- name : name of the property wich changed,  
	- oldValue : the value before changed only available for update, 
	- index : the start index, only available for split,  
	- removed : an array of the removed elements, only available for split,
	- addedCount : the number of added elements, only available for split,
	
 * @example Mold/Test/Lib/ArrayObserver.js#observer
 */
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
			var i = 0, len = changes.length;
			for(; i < len; i++){
				that.trigger("change", changes[i])
			}
		}


		var _observeItem = function(index){
			
			Mold.watch(_array, index, function(property, oldValue, newValue){
				if(!that.arrayMethodCalled){
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
			});
		}

		var _observe = function(){
			if(Mold.Lib.Info.isSupported('arrayObserve')){
				Array.observe(_array, _observerMethod);
				return this;
			}
			
	
			Mold.each(_array, function(element, index){
				_observeItem(index);
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
			
			_array.push = function() {
				_array.splice.apply(_array, [_array.length, arguments.length].concat(Array.prototype.slice.call(arguments) ));
				return _array;
			};

			_array.pop = function(){	
				return _array.splice(_array.length -1, 1);
			}

			_array.shift = function(){
				return _array.splice(0, 1);
			}

			_array.unshift = function(){
				_array.splice.apply(_array, [0, 0].concat(Array.prototype.slice.call(arguments)));
			}

			_array.concat = function(newArray){
				_array.splice.apply(_array, [_array.length, 0].concat(newArray) );
			}

			_array.splice = function(from, len){
				that.arrayMethodCalled = true;
				var argumentsArray = [];
				var to = from + len -1;
				var arrayLen = _array.length;
				var addCount = 0;

				Mold.each(arguments, function(element, index){
					if(index > 1) {
						argumentsArray.push(element);
						addCount++;
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
			}
			
		}

		var _unobserve = function(){
			if(Mold.Lib.Info.isSupported('arrayObserve')){
				Array.unobserve(_array, _observerMethod);
				return this;
			}
		}
		


		this.publics = {

			/**
			 * @method observe
			 * @description start observing the array 
			 * @param  {function} callback a callback wich will be executed when the array changed
			 */
			observe : function(callback){

				that.on('change', function(e){
					callback.call(this, e.data)
				});
				_observe();
			},

			/**
			 * @method unobserve 
			 * @description end observing the array
			 * @param {function} callback the callback that h
			 * @return {[type]}            [description]
			 */
			unobserve : function(callback){
	
				that.off('change')
				_unobserve();
			}
	   	};
	}
);