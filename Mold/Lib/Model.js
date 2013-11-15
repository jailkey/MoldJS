"use strict";
Seed({
		name : "Mold.Lib.Model",
		dna : "class",
		include : [ 
			"Mold.Lib.Event",
			"Mold.Lib.List",
			"Mold.Lib.Validation"
		]
	},
	function(config){

		

		var _propertys = config.propertys;
		var _data = {};
		var that = this;
		var _isValidation = false;

		Mold.mixing(this, new Mold.Lib.Event(this));
		Mold.mixing(_data, new Mold.Lib.Event(_data));
	
		var _createProperty = function(element, name, data){
			var validationError = _notValid(element, data[name], "property");
			if(validationError){
				
				if(data.on){

					var result = data.trigger("validation.error", { error : validationError, value : data[name], oldValue : data[name], name : name, element : data});

				}
				that.trigger("validation.error", { error : validationError, value : data[name], oldValue : data[name], name : name, element : data})
			}
			data[name] = data[name] || "";
			Mold.watch(data, name, function(){
				data.trigger("property.change."+name, { value : arguments[2], name : name });
				data.trigger("property.change", { value : arguments[2], name : name });
				var validationError = _notValid(element, arguments[2], "property");
				
				if(validationError){
					var result = data.trigger("validation.error", { error : validationError, value : arguments[2], oldValue : arguments[1], name : name, element : data})
					

					that.trigger("validation.error", { error : validationError, value : arguments[2], oldValue : arguments[1], name : name, element : data});

					if(!Mold.isObject(result)){
						console.log("result", result)
						//arguments[2]
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
			}).on("list.item.remove", function(e){
				
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
				data[name] = {}
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
			var name = "", element ="";
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

		
		_createModel(_propertys, _data);
		
		var _update = function(model, data){
			Mold.each(data, function(element, name){
				if(Mold.isObject(element) || Mold.isArray(element) ){
					_update(model[name], element);
				}else{
					if(model[name] &&  model[name] !== element){
				
						model[name] = element;
					}
				}
			});
		} 

		this.publics = {
			data : _data,
			validation : function(state){
				_isValidation = state;
			},
			isValid : function(){

			},
			save : function(){

			},
			load : function(){

			},
			bind : function(model){
				
			},
			update : function(newData){
				_update(_data, newData);
			},
			json : function(){
				return JSON.stringify(model.data, function(key, value){
					if(key == "_eid"){
						return undefined;
					}
					return value;
				})
			}

		}
	}
)