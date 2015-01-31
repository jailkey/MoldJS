"use strict";
Seed({
		name : "Mold.Lib.Model",
		dna : "class",
		version : "0.0.3",
		include : [ 
			"Mold.Lib.Event",
			"Mold.Lib.List",
			"Mold.Lib.Validation"
		]
	},
	function(config){

		var _properties = config.properties,
			_data = {},
			that = this,
			_adapter = config.adapter,
			_dataId =  false,
			_registerd = [],
			_isValidation = false;

		Mold.mixin(this, new Mold.Lib.Event(this));
		Mold.mixin(_data, new Mold.Lib.Event(_data));


		var _register = function(instance){
			_registerd.push(instance);
		
			instance.on("all", function(e){
				that.trigger(e.event, e, { exclude : ["data", "destroy"] });
			});

			return instance;
		}
	
		var _createProperty = function(element, name, data){
			var validationError = _notValid(element, data[name], "property");
			
			if(validationError){
				if(data.on){

					var result = data.trigger("validation.error", { 
						error : validationError,
						value : data[name],
						oldValue : data[name],
						name : name,
						element : data
					});

				}
				that.trigger("validation.error", { 
					error : validationError,
					value : data[name],
					oldValue : data[name],
					name : name,
					element : data
				});
			}

			data[name] = data[name] || "";

			Mold.watch(data, name, function(){

				data.trigger("property.change."+name, {
					value : arguments[2],
					name : name
				});

				data.trigger("property.change", {
					value : arguments[2],
					name : name 
				});


				var validationError = _notValid(element, arguments[2], "property");
				if(validationError){
					
					var result = data.trigger("validation.error", { 
						error : validationError,
						value : arguments[2],
						oldValue : arguments[1],
						name : name,
						element : data
					});
					

					that.trigger("validation.error", {
						error : validationError,
						value : arguments[2],
						oldValue : arguments[1],
						name : name,
						element : data
					});

					that.trigger("validation.error."+name, {
						error : validationError,
						value : arguments[2],
						oldValue : arguments[1],
						name : name,
						element : data
					});

					if(!Mold.isObject(result)){
						arguments[2] = result;
					}
				}

				return arguments[2];
			});
			return data;
		}

		var _createList = function(element, name, data){
			_notValid(element, data[name], "list");

			if(data[name] && data[name][0]){
				var listValue = data[name];
			}
			
			if(!Mold.isObject(data)){
				throw new Error("Data '" + data + "' is not an object, can't create property '" + name + "'!");
			}

			data[name] = new Mold.Lib.List();

			data[name]
				.on("list.item.add", function(e){

					if(Mold.isObject(e.data.value)){
						 _createListItem(element[0], e.data.index, e.data.value, e.data.list);
					}else{
						_createModel(element[0], e.data.value);
					}

				}).on("list.item.change", function(e){

					if(Mold.isObject(e.data.value) && !Mold.isArray(e.data.value)){
						 _createListItem(element[0], e.data.index, e.data.value, e.data.list, true);
					}else{
						
					}
					_createModel(element[0], e.data.value);
				});

			if(listValue){
				Mold.each(listValue, function(element){
					data[name].push(element);
				});
			}

			return data;
		}


		var _createListItem = function(element, index, value, data, useValue){
			_notValid(element, value, "itemlist");
			if(useValue){
				if(!value.on){
					Mold.mixin(value, new Mold.Lib.Event(value));
				}
			}else{
				if(!data[index].on){
					Mold.mixin(data[index], new Mold.Lib.Event(data[index]));
				}
			}
			_createModel(element, value);
		}

		var _createObject = function(element, name, data){

			_notValid(element, data[name], "object");
			if(!data[name]){
				data[name] = {};
			}
			Mold.mixin(data[name] , new Mold.Lib.Event(data[name]));
			Mold.watch(data, name, function(e){

				_createModel(element, arguments[2]);
				Mold.mixin(data[name], arguments[2]);
				Mold.mixin(arguments[2] , new Mold.Lib.Event(arguments[2]));
				
				data[name].trigger("object.change", { value : arguments[2], name : name });
				
				return arguments[2];
			});

			_createModel(element, data[name]);
			return data;
		}

		var _createFunction = function(element, name, data){
			data.on('object.change', function(){
				console.log("object change");
				/*
				data.trigger("property.change."+name, {
					value : element(data),
					name : name
				});

				data.trigger("property.change", {
					value : element(data),
					name : name 
				});*/
			});
			data[name] = element(data);
			return data;
		}

		var _createEventTrap = function(element, name, data){
			data = _createProperty(element, name, data);
			element.on('change', function(){
				data[name] = element.execute(data);
			});
			data[name] = element.execute(data);
			return data;
		}

		var _createItem = function(element, name, data){
			if(element.className && element.className == "Mold.Lib.EventTrap"){
				console.log("EventTrap found",  element.className)
				data = _createEventTrap(element, name, data);
				
			}else if(Mold.isArray(element)){
				data = _createList(element, name, data);
			}else if(Mold.isObject(element)){
				
				

				data = _createObject(element, name, data);
			}else if(typeof data === "string" && Mold.startsWith(Mold.cleanSeedName(data), "Mold.") ){
				//not implemented yet
				//var relationSeed = Mold.getSeed(Mold.cleanSeedName(data));
			
			}else if(typeof element === 'function'){
				_createFunction(element, name, data);
			}else{

				data = _createProperty(element, name, data);
			}
			return data;
		}

		var _createModel = function(model, data){

			var name = "",
				element ="";

			for(name in model){
				element = model[name];
				data = _createItem(element, name, data);
			}
		}



		var _notValid = function(model, value, type){
			var output = false;
			if(_isValidation){
				switch(type){
					case "property" :
						var valids = model.split("|");
						Mold.each(valids, function(validation){
							var validate = Mold.Lib.Validation.get(validation);
							if(validate){
								if(!validate(value)){
									output =  validation;
								}
							}
						});

						break;
					default:
						break;

				}
			}
			return output;
		}

		
		_createModel(_properties, _data);


		var _protected = {
			trigger : true,
			off : true,
			on : true,
			once : true,
			bubble : true,
			delegate : true,
			at : true,
			when : true,
			_eid : true,
			then : true
		}
		
		var _add = function(model, data){

			//Mold.each(data, function(element, name){
			
				if(Mold.isArray(data)){
					
					Mold.each(data, function(item){
						model.push(item);
					})
				}else if(Mold.isObject(data)){

					Mold.each(data, function(item, name){
						
						if(Mold.isObject(item) || Mold.isArray(item)){

							if(model[name]){
								_add(model[name], item);
							}
						}else{
							if(Mold.is(model[name])){
								model[name] = item;
							}
						}
					})
					
				}
			
			//return model;
		}


		var _clean = function(model){
			if(Mold.isArray(model)){
				model.remove();
			}else if(Mold.isObject(model)){
				Mold.each(model, function(item, name){
					if(Mold.isObject(model[name]) || Mold.isArray(model[name])){
						_clean(model[name]);
					}else{
						if(!_protected[name]){
							model[name] = false;
						}
					}
				})
			}
		}

		var _refresh = function(){
			Mold.each(_data, function(selected){
				if(Mold.isArray(selected)){
					Mold.each(selected, function(element){
						
					})
				}
			})
		}

		var _update = function(model, data){
			_clean(model);
			_add(model, data);
			that.trigger("update");
		}

		//var _modelAddContent

		if(_adapter){
			var that = this;
			_adapter.on("update", function(e){
				_update(_data, e.data);
			})
		}

		this.publics = {
			data : _data,
			validation : function(state){
				_isValidation = state;
			},
			isValid : function(){

			},
/**
 * save  saves the model
 * @param  {[type]} id [description]
 */
			save : function(){
				if(!_adapter){
					throw "Can not save data without adapter!"
				}
				
				if(!_dataId){
					//insert
					_dataId = _adapter.insert(_data);
				}else{
					_adapter.update(_data, _dataId);
				}
				
			
			},
/**
 * load loads data by the specified resourceID
 * @param  {number|string} id [description]
 */
			load : function(id){
				if(!_adapter){
					throw "Can not load data without adapter!"
				}
				_dataId = id;
				_adapter.load(id);
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
				_update(_data, newData);
			},
/**
 * json description]
 * @return {[type]} [description]
 */
			json : function(){
				return JSON.stringify(_data, function(key, value){
					if(key == "_eid"){
						return undefined;
					}
					return value;
				})
			}

		}
	}
)