Seed({
		name : "Mold.Lib.LocalStore",
		dna : "class"
	},
	function(){

		if(!Mold.isSupported('localStorage')){
			throw "Your Browser does not support localStorage!"
		}

		var _data = false;

		var _idExists = function(id){
			return !!localStorage.getItem(id);
		}

		var _save = function(data, id){
			if(Mold.isObject(data)){
				data = JSON.stringify(data);
			}
			console.log("save:", id, data);
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

		var _add = function(data){
			var id =  _getUniqueID();
			_save(data, id);
			return id;
		}

		this.publics = {
			save : function(data, id){
				console.log("save local", data, id);
				if(id){
					_save(data, id);
					return id;
				}else{
					return _add(data);
				}
			},
			load : function(id){
				var data = localStorage.getItem(id);
				return JSON.parse(data);
			},
			remove : function(id){
				return localStorage.removeItem(id);
			},
			add : function(data){
				return _add(data);
			}

		}
	}
)