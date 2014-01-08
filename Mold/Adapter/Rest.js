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
			save : function(data){
				console.log("data", data)
				this.send(_restpath+"?rand"+Math.random(), "data="+data, { method : "POST"});
			},
			load : function(id){
				id = id || "";
				this.send(_restpath+id+"?rand"+Math.random(), false, { method : "GET"});
			},
			remove : function(id){
				this.send(_restpath+id, false, { method : "DELETE"});
			},
			add : function(data){
				this.send(_restpath, "data="+data, { method : "PUT"});
			}
		}
	}
)