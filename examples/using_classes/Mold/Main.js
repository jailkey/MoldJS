Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"Mold.SubClass"
		]
	},
	function(){	
	
		var instance = new Mold.SubClass("TEst", "asdasd");

		instance.superClassMethod();

		instance.subClassMethod();
	}
);