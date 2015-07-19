"use strict";

Seed({
		name : "Mold.Lib.ObjectObserver",
		dna : "class",
		test : "Mold.Test.Lib.ObjectObserver",
		include :  [
			"Mold.Lib.Event"
		]
	},
	function(data){

		var that = this;
		var _object = data;

		Mold.mixin(this, new Mold.Lib.Event(this));

		var _observerMethod = function(changes){
			var i = 0, len = changes.length;
			for(; i < len; i++){
				that.trigger("change", changes[i])
			}
		}

		var _observe = function(){

			if(Mold.Lib.Info.isSupported('objectObserve')){
				Object.observe(_object, _observerMethod);
				return this;
			}

			for(var prop in _object){
				Mold.watch(_object, prop, function(property, oldValue, newValue){
					_object[property] = newValue;
					that.trigger("change", {
						index : false,
						type : "update",
						object : _object,
						name : property,
						oldValue : oldValue,
						removed : false,
						addedCount : false
					});

					return newValue;
				});
			}
		}

		var _unobserve = function(){
			if(Mold.Lib.Info.isSupported('objectObserve')){
				Object.unobserve(_array, _observerMethod);
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
)