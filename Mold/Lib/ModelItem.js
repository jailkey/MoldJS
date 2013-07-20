Seed({
		name : "Mold.Lib.ModelItem",
		dna : "class",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(){
		var that = this;
		
		var _getPropertyType = function(name, model){
			
			if(name != ""){
				if(model.properties[name]){
					var modelProperty = model.properties[name];
				}else{
					var modelProperty = name;
				}

				if(typeof +modelProperty === "number" &&  !isNaN(+modelProperty) ){
					return "item";
				}else if(modelProperty === "string"){
					return "string"
				}else if(typeof modelProperty === "object" ){
					if(modelProperty instanceof Array){
						return "collection";
					}else{
						return "object";
					}
				}else if(modelProperty.substring && modelProperty.substring(0,"relation".length) === "relation"){
					return model.type;
					//return "relation";
				}
			}else{
				return model.type;
			}
			return false;
		}
		
		
		var _isRelation = function(name, model){
			if(name != ""){
				if(model.properties[name]){
					var modelProperty = model.properties[name];
				}else{
					var modelProperty = name;
				}
				if(modelProperty.substring && modelProperty.substring(0, "relation".length) === "relation"){
					return true;
				}
			}
			return false;
		}
		
		var _getRelationModel = function(relation){
			if(relation.indexOf("->*") > -1){
				return  relation.split("->*")[1];
			}
			return false;
		}	
		
		var _modelCache = {};
		
		var _item = function(name, value, model, id, parent) {
			id = (id) ? id + "/" + name : name;
			var item = {};
			item.id = id;
			item.isFirstLevel = (!parent) ? true : false;
			item.parent = parent || model;
			item.isRelation = _isRelation(name, model);
			
			item.model = (item.isRelation) ? _getRelationModel(model.properties[name]) : false;
				
			if(item.isRelation){
				var oldModel = model;
				var modelSeed = Mold.getSeed(item.model);
				model = new modelSeed();
				oldModel.register(model)
			}
			
			Mold.mixing(item, new Mold.Lib.Event(item));
			
			model.register(item);
			
			
			if(typeof value === "object"){
				for(var prop in model.properties){
					if(!value[prop]){
						if(typeof model.properties[prop] === "function"){
							value[prop] = model.properties[prop](value);
						}else{
							value[prop] = "";
						}
					}
				}
			}

			item.value = value;
			item.length = (item.value instanceof Array) ? item.value.length : false;
			item.type = _getPropertyType(name, model);
			
			if(!item.value){
				if(item.type === "object"){
					item.value = model.properties[name];
				}
			}
			
			item.name = name;
			
			item.cached = {}
			
			item.get = function(property){

				if(property != "undefined"){

					if(!item.cached[property]){
						if(! item.value ){
							return false;
						}
						var newItem = _item(property, item.value[property], model, id, item);
						item.cached[property] = newItem;
					}
					return item.cached[property];
				}else{
					return  item;
				}
			}

			item.destroy = function(){
				model.destroy();
			}
			
			item.hasProperty = function(property){
				return (item.value && item.value[property]) ? true : false;
			}

			item.save = function(){
				model.save();
			}
			
			item.remove = function(){
				var parent = item.parent;
				if(parent.type === "collection"){
					//console.log("remove", item.name, parent.value, parent.cached)
					parent.value.splice(item.name, 1);
					parent.length = parent.value.length;
					parent.cached = {};
					if(item.isFirstLevel){
						console.log("isFirstLevel")
						_modelCache = {};
					}
					_modelCache[item.name];
					item.trigger("remove", { 
						item : item
					});
				}
			}

			item.each = function(id, callback){
				if(typeof id === "function"){
					callback = id;
					if(model.order){
						model.order.execute(item, callback);
					}else{

						if(item.type === "collection"){
							for(var i = 0; i < item.length; i++){
								callback(item.get(i));
							}
						}else{
							for(var prop in item.value){
								callback(item.get(prop));
							}
						}
					}
				}else{
					var element = model.getById(id);
					if(element.type === "item"){
						callback(element);
					}
					var parent = element.parent;
					while(parent){
						if(parent.type === "item"){
							callback(parent);
						}
						parent = parent.parent;
					}
				}
			}
			
			item.set = function(value){
				var oldValue = item.value;
	
				if(item.type === "item"){
					item.value = value;
					item.parent.value.push(value);
					item.parent.length = item.parent.value.length;
					var selectedItem = item;
				}else{
					item.value = value;
				}

				item.trigger("change", { 
					item : selectedItem,
					value : item.value,
					oldValue : oldValue
				});				
				return item;
			}
			
			item.isType = function(type){
				if(item.type === type){
					return true;
				}else{
					return false;
				}
			}
			
			return item;
		}
		
		
		return {
			create : function(name, value, model){
				if(!_modelCache[name]){
					var item = _item(name, value, model);
					_modelCache[name] = item;
				}else{
					var item = _modelCache[name];
				}
				return item;
			},
			clearCache : function(){
				_modelCache = {};
			}
		}
	}
)