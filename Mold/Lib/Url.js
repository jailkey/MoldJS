Seed({
		name : "Mold.Lib.Url",
		dna : "class"
	},
	function(url){

		var _parameter = {};

		if(!url){
			if(!Mold.isNodeJS){
				
				Mold.each(window.location.search.replace("?", "").split("&"), function(parameter){
					//console.log("ADD", parameter.split("=")[0], parameter.split("=")[1])
					_parameter[parameter.split("=")[0]] = parameter.split("=")[1];
					
				});
				//console.log("para", _parameter);
			}else{
				throw new Error("No url given!");
			}
		}

		this.publics = {
			parameter : function(){
				//console.log("PAREA;", _parameter);
				return _parameter;
			}
		}
	}
)