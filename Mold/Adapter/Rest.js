Seed({
		name : "Mold.Adapter.Rest",
		dna : "class",
		extend : "Mold.Lib.Ajax"
	},
	function(config){

		var _restpath = config.path;
		var _that = this;
		
		this.on("ajax.error", function(e){
			
		});

		this.on("ajax.get.success", function(e){
			_that.trigger("update", JSON.parse(e.data.xhr.responseText));
		});

		this.publics = {
			save : function(data, id){
				var dataString = JSON.stringifiy(data);

				this.send(_restpath+"?rand"+Math.random(), "data="+dataString, { method : "POST" });

				//return id;
			},
			load : function(id){
				id = id || "";
				return this.send(_restpath+id+"?rand"+Math.random(), false, { method : "GET" });
			},
			remove : function(id){
				return this.send(_restpath+id, false, { method : "DELETE" });
			},
			add : function(data){
				return this.send(_restpath, "data="+data, { method : "PUT" });
				//return id;
			}
		}
	}
)