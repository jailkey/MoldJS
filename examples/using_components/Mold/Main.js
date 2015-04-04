Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"Mold.Test"
		]
	},
	function(){
		console.log("component loaded")

		var imageList = document.createElement("x-imagelist");
		document.body.appendChild(imageList);

		imageList.setAttribute("show", "0")
	}
);