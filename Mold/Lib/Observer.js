Seed({
		name : "Mold.Lib.Observer",
		dna : "static",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event"
		],
	},
	function(){
		var events = new Mold.Lib.Event(this);
		Mold.mixin(this, events);
		return {
			pub : this.trigger,
			sub : this.on,
			publish : this.trigger,
			subscribe : this.on,
			at : this.at,
			on : this.on,
			trigger : this.trigger
		};
	}
);