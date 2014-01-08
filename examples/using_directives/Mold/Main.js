Seed(
	{ 
		name : "Mold.Main",
		dna : "action",
		include : [
			"Mold.TestController",
			"external->Mold.Lib.DomScope"
		]
	},
	function(){
		
		console.log("init");
		
		Mold.Lib.DomScope.directive({
			at : "style-property",
			name : "grid-column",
			seed : "Mold.TestController"
		});



	}
);