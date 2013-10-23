Seed({
		name : "Mold.Lib.Model",
		dna : "class",
		include : [ 
			"Mold.Lib.Event",
			"Mold.Lib.List"
		]
	},
	function(config){

		Mold.mixing(this, new Mold.Lib.Event(this));
		var _propertys = config.propertys;
		var _data = {};
		var that = this;

		Mold.mixing(_data, new Mold.Lib.Event(_data));

	
		var _createProperty = function(element, name, data){
			//console.log("Watch Property -->", element, name, data);
			//data[name].stop = "true"

			Mold.watch(data, name, function(){
				console.log("property do change", name)
				data.trigger("property.change."+name, { value : arguments[2], name : name });
				
				return arguments[2];
			});
			return data;
		}

		var _createList = function(element, name, data){
			data[name] = new Mold.Lib.List();
			data[name].on("change", function(e){
				console.log("list change");
				//that.trigger("change", { property: name, oldValue :  e.data.oldValue, value : e.data.value, index: e.data.index, data : _data, action : "change" });
			
			}).on("list.item.add", function(e){
				console.log("list.item.added", e.data.value);
				_createModel(element[0], e.data.value);
				//that.trigger("change", { property: name, oldValue :  e.data.oldValue, value : e.data.value, index: e.data.index, data : _data, action : "add" });
			
			}).on("remove", function(e){
				
				that.trigger("change", { property: name, oldValue :  e.data.oldValue, value : e.data.value, index: e.data.index, action : "remove" });
			}).on("list.item.change", function(e){
				_createModel(element[0], e.data.value)
			});
			return data;
		}


		var _createObject = function(element, name, data){
			Mold.mixing(data[name] , new Mold.Lib.Event(data[name]));
			//console.log("create Object")
			Mold.watch(data, name, function(){
				//console.log("object changed")
				Mold.mixing(data[name], arguments[2]);
				data[name].trigger("object.change", { value : arguments[2] });
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
			Mold.each(model, function(element, name){
				
				data = _createItem(element, name, data);
				//console.log("created", name, element, data)
			});
		}

		_createModel(_propertys, _data);



		this.publics = {
			data : _data,
			save : function(){

			}
		}
	}
)