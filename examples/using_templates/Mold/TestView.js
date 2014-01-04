Seed({
		name : "Mold.TestView",
		dna : "view",
		include : [
			"external->Mold.DNA.View"
		]
	},
	function(config){
		var element = document.createElement("div");
		element.innerHTML = "YEAR IT WORKS!!!";
		this.scope = element;
		console.log("view", config)


	}
)