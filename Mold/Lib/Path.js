Seed({
		name : "Mold.Lib.Path",
		dna : "static"
	},
	function(){

		var _normalize = false;

		if(Mold.isNodeJS){
			var path = require("path");
			_normalize = path.normalize;
		}else{
			_normalize = function(path){
				path = path.replace(/\/\//g, "/");
				if(Mold.startsWith(path, "/")){
					path = path.replace(/\.\./g, "");
				}
				return path;
			}
		}

		return {
			normalize : _normalize,
			isHTTP : function(path){
				if(Mold.startsWith(path, "http://") || Mold.startsWith(path, "https://")){
					return true;
				}

				return false;
			},
			isFile : function(path){
				if(Mold.startsWith(path, "file://")){
					return true;
				}
				return false;
			},
			isAbsolute  : function(path){
				if(this.isHTTP(path)){
					return true;
				}

				if(Mold.startsWith(path, "/")){
					return true;
				}

				return false;
			}
		}
	}
)