Seed({
		name : "Mold.Test2",
		dna : "controller",
		include : [
			"->Mold.DNA.Controller"
		]

	},
	function(){


		this.actions = {
			"@GET" : function(e){
				console.log("trigger get TEST 2");

				//e.data.response.addData({ test : "blablub"});
			//	e.data.response.redirect(302, "/")
			//	e.data.next();
			},

			"@POST" : function(e){
				//console.log("trigger POST TEST 2", e.data.request.body);
		

				//e.data.response.addData({ test : "blablub"});
				e.data.response.addData("test", "text")
				e.data.next();
			}
		}

	}
)