Seed({
		name : "Mold.Lib.Mongo",
		dna : "static",
		platform : "node",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Promise"
		],
		npm : [
			"mongodb" : "latest"
		]
	},
	function(){
		var _name : false;
		var _isConnected = false;
		var Mongo = require('mongodb').MongoClient;
		var _db = false;
		var _events = new Mold.Lib.Event({});

		return  {
			on : _events.on,
			trigger : _events.trigger,
			connect : function(url){
				Mongo.connect(url, function(err, db) {
					  if(err){
					  	_events.trigger("connection.error", err);
					  	return;
					  }else{
					  	_events.trigger("connection", { db : db});
					  	_db = db;
					  }
				});
			},
			close : function(){
				if(_db){
					_db.close();
					_db = false;
					_events.trigger("connection.closed");
				}
			},
			isConnected : function(){
				return _isConnected;
			},
			insert : function(collectionName, document){
				if(_db){
					var collection = _db.collection('collectionName');
				}
			},
			delete : function(collection, document){

			}
		}
	}
)