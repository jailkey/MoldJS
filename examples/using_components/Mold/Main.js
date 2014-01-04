Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Lib.Component",
			"Mold.Test"
		]
	},
	function(){
		var component = new Mold.Lib.Component("Mold.Test");

		component.on("files.loaded", function(){
			console.log("ALL FILES Loaded");
		});

		component.on("files.error", function(){
			console.log("FILES KONNTEN NICHT geladen werden")
		});

		component.files("logo.png");
		component.files("stressed_linen.png");
		component.files("test.css");
	}
);