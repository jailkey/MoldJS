Seed({
		type : "static",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event"
		],
	},
	function(){
		var events = new Mold.Lib.Event(this);
		Mold.mixin(this, events);

		var _publish = function(e, data, conf){
			conf = conf || {};
			conf.disableSaveTrigger = true;
			this.trigger(e, data, conf)
		}

		return {
			pub : _publish,
			sub : this.on,
			publish : _publish,
			subscribe : this.on,
			at : this.at,
			on : this.on,
			trigger : this.trigger
		};
	}
);