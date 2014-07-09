"use strict";
Seed({
		name : "Mold.Lib.Watcher",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(data, config){

		var _data = data,
			_config = config,
			_that = this;

		Mold.mixing(this, new Mold.Lib.Event(this));

		var _observeProperty = function(data, propertyName, eventName){
			Mold.watch(data, propertyName, function(property, oldval, val){
				eventName = eventName || "property.change";
				if(oldval !== val){
					if(typeof eventName === "function"){
						eventName.call(this, property, val, oldval, "property")
					}else{
						_that.trigger(eventName, { property : property, oldValue : oldval, value : val, type : "property"});
					}
				}
				return val;
			});
		}

		var _observeList = function(data, eventName, listName){
			eventName = eventName || "list.change";
			Mold.watch(data, "len", function(property, oldval, val){
				if(typeof eventName === "function"){
					eventName.call(this, listName, val, oldval, "list")
				}else{
					_that.trigger(eventName, { property : listName, oldValue : oldval, value : val, type : "list"});
				}
				return val;
			});
		}

		var _observeAll = function(data, eventName){
			eventName = eventName || "data.change";
			Mold.each(data, function(item, name){
				if(Mold.isArray(item)){
					_observeList(item, eventName, name);
					_observeAll(item, eventName)
				}else if(Mold.isObject(item)){
					_observeAll(item, eventName);
				}else{
					_observeProperty(data, name, eventName);
				}
			})
		}

	

		var _parseWildcard = function(pattern, eventName, data){
			Mold.each(data, function(value, name){
				_parseObserverPattern(pattern, eventName, value);
			});
		}

		var _parseObserverPattern = function(pattern, eventName, data){
			
			var parts = pattern.split("."),
				len = parts.length,
				i = 0,
				observeData = data;
			
			for(; i < len; i++){
				var value = parts[i];

				if(value === "*" && i +1 < len){
					observeData = observeData;
					_parseWildcard(parts.slice(i +1, parts.length).join("."), eventName, observeData)
					break;
				}else if(i +1 < len){
					observeData = data[value];
				}
				if(i + 1 === len){
					var property = parts[i];
					switch(property){
						case "*":
							_observeAll(observeData, eventName);
							break;
						case "len":
						case "length":
							_observeList(observeData, eventName, property);
							break;
						default:
							_observeProperty(data, property, eventName)
							break;
					}
				}
			};
		}

		var _observe = function(data, config){
			if(!config){
				_observeAll(data);
			}else{
				Mold.each(config, function(value, name){
					
					value = (typeof value === "function") 
						? value : (value.indexOf("@") > -1) 
						? value.split("@")[1] : value;

					_parseObserverPattern(name, value, data);
				});
			}
		}

		_observe(_data, _config);
		
		this.publics = {
			observer : function(){

			}
		}
	}
)