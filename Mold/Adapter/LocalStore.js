Seed({
		name : "Mold.Adapter.LocalStore",
		dna : "class",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.LocalStore",
			{ Promise : "Mold.Lib.Promise" }
		]
	},
	function(config){

		Mold.mixin(this, new Mold.Lib.Event(this));
		var _localStore = new Mold.Lib.LocalStore(config);
		var _that = this;

		this.publics = {
			update : function(data, id){
				return _localStore.save(data, id);
			},
			load : function(id){
				return _localStore.load(id);
			},
			insert : function(data){
				return _localStore.add(data);
			},
			remove : function(id){
				return _localStore.remove(id);
			}
		}
	}
);