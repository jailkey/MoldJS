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
		var _config = config;
		var _validation = false;

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
					_that.trigger(name + ".changed", e);
					_that.trigger(name + e.index + ".changed", e);
					
					if(e.type === "splice"){
						for(var i = e.index; i < e.index + e.addedCount; i++){
							_watchData(e.object[i], name + "." + i, properties[0]);
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
					//console.log("trigger", name)
					if(!Mold.isArray(properties[e.name]) && !Mold.isObject(properties[e.name])){
						//console.log("is not object and not array validate it", e, properties[e.name])
						_validateValue(e.object[e.name], properties[e.name]);
					}

					_that.trigger(name + ".changed", e);
					_that.trigger(name + "." + e.name + ".changed", e);

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
				
			_watchData(_data, "data", _config.properties);
		}


		_update(_initProperties(_config.properties));

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
			data : _data,
			getId : function(){
				return _dataId;
			},
			validation : function(state){
				_validation = state;
			},
			getProperties : function(){
				return _config.properties;
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
			connect : function(model){
				
			},
/**
 * update replace the model with new data
 * @param  {mixed} newData [description]
 */
			update : function(newData){
				_update(newData)
			},
/**
 * json description]
 * @return {[type]} [description]
 */
			json : function(){
			
			},

			triggerUpdate : _triggerUpdate

		}
	}
)