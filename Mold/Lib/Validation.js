Seed({
		name : "Mold.Lib.Validation",
		dna : "static"
	},
	function(){

		var _validations = {};
		var _defaultValidationValues = {};

		_validations["string"] = function(value){
			return (typeof value === "string") ? true : false;
		}

		_defaultValidationValues["string"] = "";

		_validations["number"] = function(value){
			return !isNaN(parseFloat(value)) && isFinite(value);
		}

		_defaultValidationValues["number"] = 0;

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
				if(Mold.is(_validations[name])){
					throw "You can not overwrite validation methods!"
				}
				_validations[name] = validator;
			},
			getDefault : function(name){
				return _defaultValidationValues[name];
			},
			addDefault : function(name, value){
				if(Mold.is(_defaultValidationValues[name])){
					throw "You can not overwrite default values!"
				}
				_defaultValidationValues[name] = value;
			}
		}
	}
)