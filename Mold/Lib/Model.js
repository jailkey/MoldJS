"use strict";
Seed({
		name : "Mold.Lib.Model",
		dna : "class",
		version : "0.0.2",
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
			_isValidation = false;

		Mold.mixing(this, new Mold.Lib.Event(this));
		Mold.mixing(_data, new Mold.Lib.Event(_data));
	
		var _createProperty = function(element, name, data){
			var validationError = _notValid(element, data[name], "property");
			console.log("create property", name, element, data, validationError)
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
			
			data[name] = new Mold.Lib.List();
			data[name].on("list.item.add", function(e){

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
					Mold.mixing(value, new Mold.Lib.Event(value));
				}
			}else{
				if(!data[index].on){
					Mold.mixing(data[index], new Mold.Lib.Event(data[index]));
				}
			}
			_createModel(element, value);
		}

		var _createObject = function(element, name, data){

			_notValid(element, data[name], "object");
			if(!data[name]){
				data[name] = {};
			}
			Mold.mixing(data[name] , new Mold.Lib.Event(data[name]));
			Mold.watch(data, name, function(e){
				
				_createModel(element, arguments[2]);
				Mold.mixing(data[name], arguments[2]);
				Mold.mixing(arguments[2] , new Mold.Lib.Event(arguments[2]));
				
				data[name].trigger("object.change", { value : arguments[2], name : name });
				
				return arguments[2];
			});

			_createModel(element, data[name]);
			return data;
		}

		var _createItem = function(element, name, data){
			if(Mold.isArray(element)){
				data = _createList(element, name, data);
			}else if(Mold.isObject(element)){
				data = _createObject(element, name, data);
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
							if(model[name]){
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
		}

		//var _modelAddContent

		if(_adapter){
			//console.log("adapter")
			var that = this;
			_adapter.on("update", function(e){
				
				_update(_data, e.data.data);
				console.log("data updated", e.data, _data);
				that.trigger("update", e.data);
			})
		}

		this.publics = {
			data : _data,
			validation : function(state){
				_isValidation = state;
			},
			isValid : function(){

			},
			save : function(id){
				if(!_adapter){
					throw "Can not save data without adapter!"
				}
				if(!id){
					id = _dataId;
				}
				_dataId = _adapter.save(this.data, id);
				console.log("save datae", this.data, id);
			},
			load : function(id){
				if(!_adapter){
					throw "Can not load data without adapter!"
				}
				_dataId = id;
				var data = _adapter.load(id);
				//console.log("model data loaded", id, data);
			},
			remove : function(){
				if(!_adapter){
					throw "Can not remove data without adapter!"
				}
				_adapter.remove();
			},
			add : function(){
				if(!_adapter){
					throw "Can not add data without adapter!"
				}
				_dataId = _adapter.add();
			},
			bind : function(model){
				
			},
			update : function(newData){
				_update(_data, newData);

			},
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