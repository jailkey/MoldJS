Seed({
		name : "Mold.Lib.LocalStore",
		dna : "class",
		include : [
			".Info",
			".Promise",
			".Sanitize"
		]
	},
	function(){

		if(!Mold.Lib.Info.isSupported('localStorage')){
			throw "Your Browser does not support localStorage!"
		}

		var _data = false;
		var _sanitizer = new Mold.Lib.Sanitize();

		var _idExists = function(id){
			return !!localStorage.getItem(id);
		}

		var _sanitize = function(data){
			var output = (Mold.isArray(data)) ? [] : {};
			Mold.each(data, function(value, name){
				if(!Mold.startsWith(name, "_")){
					if(Mold.isArray(value) || Mold.isObject(value)){
						output[name] = _sanitize(value);
					}else if(typeof value === "string"){
						output[name] = _sanitizer.text(value + "");
					}else if(typeof value !== "function"){
						output[name] = value;
					}
				}
			})
			return output;
		}

		var _save = function(data, id){

			if(Mold.isObject(data)){
				data = _sanitize(data);
				data = JSON.stringify(data);

			}
			
			return localStorage.setItem(id, data);
		}

		var _getUniqueID = function(){

			var id = 1,
				heightsNumber = 0,
				key = false;

			for(var i = 0; i < localStorage.length; i++){
				if(!_idExists(id)){
					return id;
				}
				key = +localStorage.key(i);

				if(
					key !== NaN 
					&& key > heightsNumber
				){
					heightsNumber = key;
				}
				id++;
			}

			return heightsNumber++;
		}	

		var _add = function(data, id){
			var id =  id || _getUniqueID();
			_save(data, id);
			return id;
		}

		this.publics = {
			save : function(data, id){
				return new Mold.Lib.Promise(function(fullfill, reject){
					if(id){
						_save(data, id);
						fullfill(id);
					}else{
						fullfill(_add(data));
					}
				});
			},
			load : function(id){
				return new Mold.Lib.Promise(function(fullfill, reject){
					var data = localStorage.getItem(id);
					try {
						var result = JSON.parse(data);
					}catch(e){
						reject(e);
					}finally{
						fullfill(result)
					}

				});
			},
			remove : function(id){
				return new Mold.Lib.Promise(function(fullfill, reject){
					fullfill(localStorage.removeItem(id));
				});
			},
			add : function(data){
				return new Mold.Lib.Promise(function(fullfill, reject){
					var id = _add(data);
					fullfill(id);
				});
			}

		}
	}
)