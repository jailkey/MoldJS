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

		_add("topath", function(data, conf){
			var target = (conf.prefix) ? conf.prefix : "" + data.replace(/./g, "/");
			return target + (conf.ending) ? conf.ending : '.js';
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
			console.log("data", data)

			if(Mold.isArray(data) && !data.length){
				return false;
			}

			if(Mold.isObject(data)){
				var test = 0;
				for(var prop in data){
					test++;
					if(data.hasProperty(prop)){
						
					}
				}
				if(test === 0){
					return false;
				}
			}

			if(data == undefined && data == null && data == false){
				return false;
			}

			return true;
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