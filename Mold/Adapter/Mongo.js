Seed({
		name : "Mold.Adapter.Mongo",
		dna : "class",
		platform : "node",
		test : "Mold.Test.Adapter.Mongo",
		include : [
			"Mold.Lib.Event",
			{ Promise : "Mold.Lib.Promise" }
		]
	},
	function(database, collection, options){ 

		if(!database){
			throw new Error("Mold.Adapter.Mongo can't work without database!")
		}

		if(!database){
			throw new Error("collection must be specified!")
		}
		
		Mold.mixin(this, new Mold.Lib.Event(this));

		var _that = this;
		var _options = options || {};

		var key = _options.key || "_id";

		this.publics = {
			update : function(data, id){
				var where = {};
				where[key] =  id;
				return database.update(collection, where, data);
			},
			load : function(id, isList, map){
				var where = false;
				if(id){
					if(Mold.isObject(id)){
						where = id;
					}else{
						where = {};
						where[key] =  id;
					}
				}
				if(!isList){
					var promise =  database.findOne(collection, where);
				}else{
					var promise =  database.find(collection, where);
				}
				return new Promise(function(fullfill, reject){
					promise.then(function(data){

						if(Mold.isArray(data)){
							var list = {}
							if(map){
								list[map] = data;
							}else{
								list.collection = data;
							}

							_that.trigger("update", { data : list, id : id, isList : true });
							fullfill(data);
						}else{
							_that.trigger("update", { data : data, id : id, isList : false });
							fullfill(data);
						}
					}).fail(reject);
				});
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