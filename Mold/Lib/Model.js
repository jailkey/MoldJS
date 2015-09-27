"use strict";
Seed({
		name : "Mold.Lib.Model",
		dna : "class",
		version : "0.0.4",
		include : [

			{ Event : "Mold.Lib.Event" },
			{ ArrayObserver : "Mold.Lib.ArrayObserver" },
			{ ObjectObserver : "Mold.Lib.ObjectObserver" },
			{ Validation : "Mold.Lib.Validation" },
			{ Promise : "Mold.Lib.Promise" }

		],
		test : "Mold.Test.Lib.Model"
	},
	function(config){

		var _dataId = false;
		var _that = this;
		var _data = {};
		var _config = config;
		var _validation = false;
		var _adapter = false;
		var undefined;
		var _lastSplice = false;

		this.id = false;

		Mold.mixin(this, new Event(this));

		/**
		 * @method  _validateValue
		 * @private
		 * @description validate model propertys 
		 * @param  {string|number} value - value to validate 
		 * @param  {string} validation - name of the validation method
		 * @return {boolean} boolean
		 */
		var _validateValue = function(value, validation){

			var validations = validation.split("|");
			var validator;

			for(var i = 0; i < validations.length; i++){
				if((validator = Validation.get(validations[i]))){
					if(!validator(value)){
						return false;
					}
				}
			}
			return true;
		}

		var _watchData = function(data, name, properties){
			
			if(Mold.isArray(data)){
				if(!Mold.isArray(properties)){
					throw new TypeError(name + " can not be an array!");
				}
	
				var observabelArray = new ArrayObserver(data);
				observabelArray.observe(function(e){
			
					if(e.type === "splice"){
						var spliceIdend = e.index + "." +  e.addedCount + "." + e.object.length + e.removed.length;
						if(spliceIdend !== _lastSplice){
							_that.trigger(name + ".changed", e);
							_that.trigger(name + "." + e.index + ".changed", e);
							
							for(var i = e.index; i < e.index + e.addedCount; i++){
								_watchData(e.object[i], name + "." + i, properties[0]);
							}
							_lastSplice = spliceIdend;
						}
					}

				});

				for(var i = 0; i < data.length; i++){
					_watchData(data[i], name + "." + i, properties[0]);
				}

			}else if(Mold.isObject(data)){

				if(!Mold.isObject(properties)){
					throw new TypeError(name + " can not be an object!");
				}
				
				var objectObserver = new ObjectObserver(data);

				objectObserver.observe(function(e){
					if(!Mold.isArray(properties[e.name]) && !Mold.isObject(properties[e.name]) && properties[e.name] !== undefined){
						_validateValue(e.object[e.name], properties[e.name]);
					}
					if(!Mold.isArray(e.object[e.name]) || e.type === "update"){

						_that.trigger(name + ".changed", e);
						_that.trigger(name + "." + e.name + ".changed", e);

					}
					_watchData(e.object[e.name], name + "." + e.name, properties[e.name]);
				})

				for(var prop in data){
					_watchData(data[prop], name + "." + prop, properties[prop]);
				}
			}else{

			}
		}

		var _initProperties = function(properties){
			var initData = {};
			Mold.each(properties, function(prop, index){
				if(Mold.isArray(prop)){
					initData[index] = [];
				}else if(Mold.isObject(prop)){
					initData[index] = _initProperties(prop);
				}else{
					initData[index] = false;
				}
			})
			return initData;
		}

		var _update = function(newData){
			Mold.each(newData, function(value, index){
				_data[index] = value;
			});
				
			_watchData(_data, "data", _config);
		}

		var _chechAdapterInterface = function(adapter){
			if(typeof adapter.insert !== "function"){
				throw new Error("Adapter has no 'insert' method!");
			}
			if(typeof adapter.update !== "function"){
				throw new Error("Adapter has no 'update' method!");
			}
			if(typeof adapter.remove !== "function"){
				throw new Error("Adapter has no 'remove' method!");
			}
			if(typeof adapter.load !== "function"){
				throw new Error("Adapter has no 'load' method!");
			}
		}


		_update(_initProperties(_config));

		_triggerUpdate = function(){
			Mold.each(_data, function(value, name){
				var e = {
					type : "update",
					object : value
				}
				_that.trigger("data." + name + ".changed", e);
			});
		}




		this.publics = {
/**
 * @method get
 * @description returns the model data by a given path
 * @parameter {string} an object path
 * @return {mixed} returns requested data or null
 */
 			get : function(path){
 				var parts = path.split(".");
 				var data = this;
 				var selected = false;

 				while(selected = parts.shift()){
 					if(data[selected]){
 						data = data[selected];
 					}else{
 						data = null;
 						break;
 					}
 				}
 				return data;
 			},

/**
 * @method set 
 * @description set the model data by a given path
 * @param {string} path the object path
 * @param {mixed} data the data
 */
 			set : function(path, data){
 				var prop = path.substring(path.lastIndexOf(".") + 1,  path.length);
 				var path = path.substring(0,  path.lastIndexOf("."));
 				var result = this.get(path);
 				if(Mold.isArray(result)){
 					result.splice(+prop, 1, data);
 				}else{
 					result[prop] = data
 				}
 			},

/**
 * @object data 
 * @description an object with the current model data
 * @type {object}
 */
			data : _data,
/**
 * @method validation 
 * @description enables the model validation
 * @param  {boolean} state - a boolean value with true enables the validation / false disable it
 */
			validation : function(state){
				_validation = state;
			},
/**
 * @method getProperties 
 * @description returns the model properties:
 * @return {object} properties
 */
			getProperties : function(){
				return _config;
			},
/**
 * @method save  
 * @async
 * @description saves the model data to the specified adapter
 * @return {promise} returns a promise
 */
			save : function(){
				var that = this;
				if(!_adapter){
					throw new Error("adapter is not specified!")
				}
				//check if model has id, if not use insert
				if(this.id !== false){
					var promise = _adapter.update(_data, this.id);
				}else{

					var promise = _adapter.insert(_data);
					promise.then(function(id){
						that.id = id;
					})
								
				}
				return promise;
			},
/**
 * @method load
 * @async
 * @description loads data by the specified resourceID
 * @param  {number|string} id - the resource id
 * @returns {promise} - returns a promise
 */
			load : function(id){
				this.id = id;
				var that = this
				var promise = _adapter.load(this.id)
				promise.then(function(data){
					that.update(data);
				});
				return promise;
			},
/**
 * @method  remove 
 * @async
 * @description removes model from the resource
 * @return {promise} returns a promise
 */
			remove : function(){
				var that = this;
				return _adapter.remove(this.id);
			},

/**
 * @method connect
 * @description connects a adapter to the model
 * @param  {object} adapter
 */
			connect : function(adapter){
				//check interface
				_chechAdapterInterface(adapter);
				_adapter = adapter;
			
			},
/**
 * update replace the model with new data
 * @param  {mixed} newData [description]
 */
			update : function(newData){
				_update(newData)
			},
/**
 * @method  json
 * @description returns a JSON string with the current model data
 * @return {[type]} [description]
 */
			json : function(){
				return JSON.stringifiy(_data);
			},

			triggerUpdate : _triggerUpdate

		}
	}
)