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
			is : function(path){
				if(typeof path === "string"){
					if(this.isHTTP || this.isFile){
						return true;
					}

					if(!~path.indexOf("\n") && ~path.indexOf("/") && ~path.indexOf(".") && !~path.indexOf("<")){
						return true;
					}
				}
				return false;
			},
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
			},
			getRelativePathName : function(path){
				path = path.replace("http://", "").replace("https://", "");
				if(Mold.startsWith(path, "/")){
					path = path.substring(1, path.length);

				}
				if(Mold.contains(path, "?")){
					path = path.split("?")[0]
				}
				return path;
			}
		}
	}
)