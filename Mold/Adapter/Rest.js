Seed({
		name : "Mold.Adapter.Rest",
		dna : "class",
		extend : "Mold.Lib.Ajax"
	},
	function(config){

		var _restpath = config.path;
		//var _ajax = new Mold.Lib.Ajax();
		//console.log("adapter", this);
		this.on("ajax.error", function(e){
			console.log("fehler", e)
		})
		this.publics = {
			save : function(data){
				console.log("data", data)
				this.send(_restpath, "data="+data, { method : "POST"});
			},
			load : function(id){
				this.send(_restpath+id, false, { method : "GET"});
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