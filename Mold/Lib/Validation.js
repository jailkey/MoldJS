Seed({
		name : "Mold.Lib.Validation",
		dna : "static"
	},
	function(){

		var _validations = {};

		_validations["string"] = function(value){
			return (typeof value === "string") ? true : false;
		}

		_validations["number"] = function(value){
			return !isNaN(parseFloat(value)) && isFinite(value);
		}

		_validations["required"] = function(value){
			return (value === "") ? false : true;
		}

		_validations["yesno"] = function(value){
			if(value === "yes" || value === "no"){
				return true;
			}
			return false;
		}

		return {
			get : function(name){
				if(name){
					return _validations[name];
				}else{
					return _validations;
				}
			},
			add : function(name, validator){
				_validations["string"] = validator;
			}
		}
	}
)