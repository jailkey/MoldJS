Seed(
	{ 
		name : "Mold.MainController",
		dna : "controller",
		include : [
			"->Mold.DNA.Controller"
		]
	},
	function(){

		this.actions = {
			"@doaction" : function(e){

				console.log("doaction", e)
			}

		}
	}
);