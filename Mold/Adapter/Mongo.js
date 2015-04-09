Seed({
		name : "Mold.Adapter.Mongo",
		dna : "class",
		platform : "node",
		include : [
			"Mold.Lib.Event",
			{ Promise : "Mold.Lib.Promise" }
		]
	},
	function(database, collection, key){

		if(!database){
			throw new Error("Mold.Adapter.Mongo can't work without database!")
		}

		if(!database){
			throw new Error("collection must be specified!")
		}
		
		Mold.mixin(this, new Mold.Lib.Event(this));

		var _that = this;

		this.publics = {
			update : function(data, id){
				var where = {};
				where[key] =  id;
				return database.update(collection, where, data);
			},
			load : function(id){
				var where = false;
				if(id){
					where = {};
					where[key] =  id;
				}
				var promise =  database.findOne(collection, where);

				promise.then(function(data){
					_that.trigger("update", { data : data, id : id });
				})
				
				return promise;
			},
			remove : function(id){
				if(id){
					var where = {};
					where[key] =  id;
					return database.remove(collection, where);
				}

				return database.remove(collection);
				
			},
			insert : function(data, id){
				return new Promise(function (fullfill, reject){
					database
						.insert(collection, data)
						.then(function(result){
							if(result && result.result.ok === 1){
								fullfill(data[key]);
							}else{
								reject("Unknown Error!");
							}
						})
						.fail(function(err){
							reject(err)
						})
				});
					 
			}
		}	
	}
)