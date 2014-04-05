Seed ({ 
		name : "Mold.Lib.Elements",
		dna : "class",
		include : [
			"Mold.Lib.Element"
		]
	},
	function(selector){

		var selection = document.querySelectorAll(selector);
		var collection = [];
		var that = this;

		Mold.each(selection, function(element, name){
			if(name !== "length"){
				collection.push(new Mold.Lib.Element(element));
			}
		});

		if(collection.length > 0){
			Mold.each(collection[0], function(func, name){
				if(typeof func === "function"){
					collection[name] = function(){
						var args = arguments;
						Mold.each(collection, function(element){
							element[name].apply(that, args);
						});
					}
				}
			});
		}

		collection.each = function(callback){
			Mold.each(collection, callback);
		}
		
		return collection;
	}
)