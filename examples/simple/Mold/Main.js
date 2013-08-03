Seed(
	{ 
		name : "Mold.Main",
		dna : "action"
	},
	function(){
		// Will be executed when Mold is ready 

		Mold.ready(function(){ 
			//Fires when DOM is ready
			alert("MOLD IS READY!")
		
		});
	
	}
);