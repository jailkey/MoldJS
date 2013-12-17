Seed({
		name : "Mold.TestView",
		dna : "view",
		include : [
			"external->Mold.DNA.View"
		]
	},
	function(){
		var element = document.createElement("div");
		element.innerHTML = "TEST";
		this.scope = element;
		console.log("view")
	}
)