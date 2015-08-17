Seed({
		name : "Mold.Lib.Filter",
		dna : "static"
	},
	function(){

		var _filter = {};

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

		return {
			add : _add,
			get : _get
		}
	}
)