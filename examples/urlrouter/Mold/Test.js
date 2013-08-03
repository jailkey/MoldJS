Seed(
	{ 
		name : "Mold.Test",
		dna : "controller",
		include : [
			"external#Mold.DNA.Controller"
		]
	},
	function(){
		alert("Seed loaded!")

		this.actions = {
			"@doaction" : function(e){

				console.log("doaction", e)
			}

		}
	}
);