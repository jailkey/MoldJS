Seed({
		name : "Mold.Lib.GlobalEvents",
		dna : "static",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event"
		],
	},
	function(){
		var events = new Mold.Lib.Event(this);
		Mold.mixing(this, events);
		return this;
	}
);