Seed ({ 
		name : "Mold.Lib.Elements",
		dna : "class",
		include : [
			"Mold.Lib.Element"
		]
	},
	function(selector, object){

		var object = object || document;
		var selection = object.querySelectorAll(selector);
		var collection = [];
		var that = this;


		Mold.each(selection, function(element, name){
			if(name !== "length"){
				collection.push(new Mold.Lib.Element(element));
			}
		});

		if(collection.length > 0){
			var keys = Mold.keys(collection[0]);
			
			for(var i = 0; i < keys.length; i++){
				var name = keys[i];

				try {				
					var func = collection[0][name];
				}catch(e){
					var func = false;
				}

				
				if(typeof func === "function"){
					if(Mold.is(collection[0][name])){
						collection[name] = function(){
							var args = arguments;
							Mold.each(collection, function(element){
								if(typeof element[name] === "function"){
									element[name].apply(that, args);
								}
							});
							return collection;
						}
					}
				}
			}
			/*
			Mold.each(collection[0], function(func, name){
				if(typeof func === "function"){
					collection[name] = function(){
						var args = arguments;
						Mold.each(collection, function(element){
							element[name].apply(that, args);
						});
						return collection;
					}
				}
			}, false, true);*/
		}else{
			var copyElement = new Mold.Lib.Element('div');
			Mold.each(copyElement, function(func, name){
				if(typeof func === "function"){
					collection[name] = function(){}
				}
			});
		}

		collection.each = function(callback){
			Mold.each(collection, callback, collection);
		}

		collection.get = function(number){
			if(collection[number]){
				return new Mold.Lib.Element(collection[number]);
			}else{
				return false;
			}
		}		
		
		return collection;
	}
)