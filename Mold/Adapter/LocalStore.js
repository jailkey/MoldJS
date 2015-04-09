Seed({
		name : "Mold.Adapter.LocalStore",
		dna : "class",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.LocalStore"
		]
	},
	function(){

		Mold.mixin(this, new Mold.Lib.Event(this));
		var _localStore = new Mold.Lib.LocalStore();
		var _that = this;

		this.publics = {
			update : function(data, id){
				return _localStore.save(data, id);
			},
			load : function(id){
				var promise =  _localStore.load(id);

				promise.then(function(data){
					_that.trigger("update", { data : data, id : id });
				});
				
				return promise;
			},
			insert : function(data, id){
				return _localStore.add(data, id);
			},
			remove : function(id){
				 return _localStore.remove(id);
			}
		}
	}
);