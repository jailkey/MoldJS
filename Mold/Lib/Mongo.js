Seed({
		name : "Mold.Lib.Mongo",
		dna : "class",
		platform : "node",
		include : [
			"Mold.Lib.Event",
			{ Promise : "Mold.Lib.Promise" }
		],
		test : "Mold.Test.Lib.Mongo",
		npm : {
			"mongodb" : "latest"
		}
	},
	function(){

		var _name = false;
		var _isConnected = false;
		var Mongo = require('mongodb').MongoClient;

		var _db = false;
		var _events = new Mold.Lib.Event({});


		var _query = function(callback){
			return new Promise(function(fullfill, reject){
				console.log("query", _db)
				if(_db){
					callback(fullfill, reject);
				}else{
					reject("No Database defined!")
				}
			});
		}

		var _solve = function(fullfill, reject){
			return function(err, result) {
				if(err){
					reject(err);
					return;
				}
				fullfill(result);
			}
		}

		this.publics =  {
			on : _events.on,
			trigger : _events.trigger,
			connect : function(url){
				return new Promise(function(fullfill, reject){
					Mongo.connect(url, function(err, db) {
						  if(err){
						  	reject(err);
						  	_events.trigger("connection.error", err);
						  	return;
						  }else{
						  	fullfill(db);

						  	_events.trigger("connection", { db : db});
						  	_db = db;
						  }
					});
				});
			},
			close : function(){
				if(_db){
					//_db.close();
					//_db = false;
					_events.trigger("connection.closed");
				}
			},
			isConnected : function(){
				return _isConnected;
			},
			insert : function(collectionName, data){
				return _query(function(fullfill, reject){
					console.log("query")
					var collection = _db.collection(collectionName);
					collection.insert(data, _solve(fullfill, reject));
				})		
			},
			update : function(collectionName, data, where){
				return _query(function(fullfill, reject){
					var collection = _db.collection(collectionName);
					collection.update(where, { $set: data }, _solve(fullfill, reject));
				});
			},
			remove : function(collectionName, where){
				return _query(function(fullfill, reject){
					var collection = _db.collection(collectionName);
					collection.remove(where, _solve(fullfill, reject));
				});
			},
			find : function(collectionName, where){
				return _query(function(fullfill, reject){
					var collection = _db.collection(collectionName);
					collection.find(where).toArray(_solve(fullfill, reject));
				});
			},
			db : function(){
				return _query(function(fullfill, reject){
					fullfill(_db);
				});
			}
		}
	}
)