Seed({
		name : "Mold.Test",
		dna : "controller",
		include : [
			"->Mold.DNA.Controller"
		]

	},
	function(){
		var test = 1;	

		this.actions = {
			"@GET" : function(e){
				console.log("trigger get TEST !");
				test++;
				e.data.response.writeJSON({"TEST" : "TEST"})
				e.data.next();
			},
			"@POST" : function(data){
				console.log("trigger post TEST");
			},
			"@fireevent" : function(e){
				console.log("DO SOM TEST LALAL");
				e.data.next();
			}
		}
	}
)