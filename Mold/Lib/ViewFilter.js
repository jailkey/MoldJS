Seed({
		name : "Mold.Lib.ViewFilter",
		dna : "class",
		author : "Jan Kaufmann",
		include : []
	},
	function(filterProperty){

		var _convertProperty = function(value, filter){
			if(typeof filter === "string"){
				return filter;
			}else if(typeof filter === "function"){
				return filter(value);
			}else if(typeof filter === "object"){
				return filter[value];
			}
			return value;

		}
		
		this.publics = {
			get : function(item){
				var filter = filterProperty[item.name],
					value = false, 
					name = false;


				if(filter){

					if(typeof filter === "object"){

						if(filter.name){
							name = _convertProperty(item.name, filter.name);
						}
						if(filter.value){
							value = _convertProperty(item.value, filter.value);
						}
					}else{
						name = _convertProperty(item.name, filter);
					}
				}else{
					value = item.value,
					name = item.name
				}



				return {
					value : value || item.value,
					name : name || item.name
				};
			}
		}
	}
);