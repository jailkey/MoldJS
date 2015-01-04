Seed({
		name : "Mold.Test2",
		dna : "controller",
		include : [
			"->Mold.DNA.Controller"
		]

	},
	function(){
		console.log("Test2", arguments)

		this.actions = {
			"@GET" : function(e){
				console.log("trigger get TEST 2");
				e.data.next();
			},
			"@POST" : function(data){
				console.log("trigger post TEST 2");
			}
		}
	}
)