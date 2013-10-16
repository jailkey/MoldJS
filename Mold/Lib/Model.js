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

		//if(!_data){var _watchModelProperties

		var _getDataType = function(name){
			
			if(Mold.isArray(_propertys[name])){
				
				return _propertys[name][0];
			}else{
				if(_propertys[name]){
					return _propertys[name];
				}else{
					return false;
				}
			}
		}

		var _createModel = function(propertys, data){
			Mold.each(propertys, function(element, name){

				if(Mold.isArray(element)){
					data[name] = new Mold.Lib.List();
					data[name].on("change", function(e){
						
						that.trigger("change", { property: name, oldValue :  e.data.oldValue, value : e.data.value, index: e.data.index, data : _data, action : "change" });
					
					}).on("add", function(e){
						
						that.trigger("change", { property: name, oldValue :  e.data.oldValue, value : e.data.value, index: e.data.index, data : _data, action : "add" });
					
					}).on("remove", function(e){
						
						that.trigger("change", { property: name, oldValue :  e.data.oldValue, value : e.data.value, index: e.data.index, data : _data, action : "remove" });
					})
				}else if(typeof element === "object"){
					console.log("element ist object")
					data[name] = {};
					Mold.watch(data, name, function(){
						console.log("watchobject", arguments)
						var data = _data;
						data[name] = arguments[2];
						that.trigger("change", { property: arguments[0], oldValue :  arguments[1], value : arguments[2], data : _data});
						return arguments[2];
					});
					console.log("recreate", element, data[name])
					_createModel(element, data[name]);
				}else{
					console.log(name)
					data[name] = "";
					console.log("watch", name)
					Mold.watch(data, name, function(){
						console.log("watch", name, arguments)
						//var data = _data;
						//data[name] = arguments[2];
						that.trigger("change", { property: arguments[0], oldValue :  arguments[1], value : arguments[2], data : data});
						return arguments[2];
					});
				}
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