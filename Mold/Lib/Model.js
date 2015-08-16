"use strict";
Seed({
		name : "Mold.Lib.Model",
		dna : "class",
		version : "0.0.4",
		include : [

			{ Event : "Mold.Lib.Event" },
			{ ArrayObserver : "Mold.Lib.ArrayObserver" },
			{ ObjectObserver : "Mold.Lib.ObjectObserver" },
			{ Validation : "Mold.Lib.Validation" }

		],
		test : "Mold.Test.Lib.Model"
	},
	function(config){

		var _dataId = false;
		var _that = this;
		var _data = {};

		Mold.mixin(this, new Event(this));

		var _watchData = function(data, name){

			if(Mold.isArray(data)){

				Object.defineProperty(data, '__name', {
					value : name
				});

				var observabelArray = new ArrayObserver(data);
				observabelArray.observe(function(e){
					
					_that.trigger("array.changed", e)
					_that.trigger(data.__name + ".changed", e);
					_that.trigger(data.__name + e.index + ".changed", e);
					
					if(e.type === "splice"){
						for(var i = e.index; i < e.index + e.addedCount; i++){
							_watchData(e.object[i], name + "." + i);
						}
					}

				});

				for(var i = 0; i < data.length; i++){
					_watchData(data[i], name + "." + i);
				}

			}else if(Mold.isObject(data)){


				Object.defineProperty(data, '__name', {
					value : name
				});

				var objectObserver = new ObjectObserver(data);

				objectObserver.observe(function(e){
					_that.trigger("object.changed", e)
					_that.trigger(data.__name + ".changed", e);
					_that.trigger(data.__name + "." + e.name + ".changed", e);
					_watchData(e.object[i], name + "." + e.name);
				})

				for(var prop in data){
					_watchData(data[prop], name + "." + prop);
				}
			}else{

			}

		}

		//_watchProperties(config.properties, "root");


		this.publics = {
			data : _data,
			getId : function(){
				return _dataId;
			},
			validation : function(state){
				
			},
			resetInvalidValue : function(state){
			
			},
			isValid : function(){
			},
/**
 * save  saves the model
 * @param  {[type]} id [description]
 * @return {promise} returns a promise
 */
			save : function(id){
	
				if(!_adapter){
					throw new Error("Can not save data without adapter!");
				}

				var data = _cleanData(_data, _properties);
				if(!_dataId){
					var promise = _adapter.insert(data, id);
					promise.then(function(id){
						_dataId = id;
					})
				}else{
					var promise = _adapter.update(data, _dataId);
				}
				
				return promise;
			},
/**
 * load loads data by the specified resourceID
 * @param  {number|string} id [description]
 * @returns {promise} - returns a promise
 */
			load : function(id){
				
			},

			remove : function(){
				_data = {};
				this.data = _data;
				return _adapter.remove(_dataId);
			},

/**
 * [bind description]
 * @param  {[type]} model [description]
 * @return {[type]}       [description]
 */
			bind : function(model){
				
			},
/**
 * update replace the model with new data
 * @param  {mixed} newData [description]
 */
			update : function(newData){
				Mold.each(newData, function(value, index){
					_data[index] = value;
				});
				
				_watchData(_data, "data");
			},
/**
 * json description]
 * @return {[type]} [description]
 */
			json : function(){
				
			}

		}
	}
)