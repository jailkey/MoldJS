Seed({
		name : "Mold.Adapter.Rest",
		dna : "class",
		extend : "Mold.Lib.Ajax"
	},
	function(config){

		var _restpath = config.path || config.resource;
		var _that = this;
		
		this.on("ajax.error", function(e){
			
		});

		this.on("ajax.get.success", function(e){
			console.log("data", e.data.json)
			_that.trigger("update", e.data.json);
		});

		this.publics = {
			insert : function(data){
				var dataString = JSON.stringifiy(data);

				this.send(_restpath+"?rand"+Math.random(), "data="+dataString, { method : "POST" });

				//return id;
			},
			load : function(id){
				id = id || "";

				var url = _restpath+encodeURIComponent(id)+"?rand"+Math.random();

				return this.get(url, false);
			},
			remove : function(id){
				return this.send(_restpath+id, false, { method : "DELETE" });
			},
			update : function(data, id){
				return this.send(_restpath, "data="+data, { method : "PUT" });
				//return id;
			}
		}
	}
)