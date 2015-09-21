Seed({
		name : "Mold.Lib.Filter",
		dna : "static"
	},
	function(){

		var _filter = {};
		var undefined;

		var _add = function(name, code){
			_filter[name] = code;
		}

		var _get = function(name){
			return _filter[name] || false;
		}

		_add("currency", function(value){
			value = +value;
			value = value.toFixed(2).replace(".", ",");
			value = value.substring(0, value.lastIndexOf(",") - 3) 
					+ "." + value.substring(value.lastIndexOf(",") - 3, value.lastIndexOf(",")) 
					+ value.substring(value.lastIndexOf(","))

			return value;
		});

		_add("maxlen", function(data, conf){
			if(Mold.isArray(data)){
				data = data.splice(0, conf.len);
			}
			return data;
		})

		_add("sort", function(data, conf){
			if(Mold.isArray(data)){
				if(conf.value){
					data.sort(function (a, b) {
						a = a[conf.value];
						b = b[conf.value];

						if (a > b) {
							return 1;
						}
						if (a < b) {
							return -1;
						}
						return 0;
					});
				}

				if(conf.desc){
					data.reverse();
				}
			}
			return data;
		});

		_add("exists", function(data, conf){
			if(data !== undefined && data !== null && data !== false){
				return true;
			}else{
				return false;
			}
			
		})

		_add("case", function(data, conf){
			for(var prop in conf){
				break;
			}
			if(data === prop){

				return true;
			}else{
				return false;
			}
		})

		_add("if", function(data, conf){
			if(conf.expression){
				conf.expression = conf.expression.replace(/this/g, "data");
				if(eval(conf.expression)){
					return data;
				}
				return false;
			}else{
				return true;
			}
		});

		return {
			add : _add,
			get : _get
		}
	}
)