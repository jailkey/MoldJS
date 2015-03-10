Seed({
		name : "Mold.Adapter.MongoDB",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(){


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
			}
		}	
	}
)