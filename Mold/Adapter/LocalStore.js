Seed({
		name : "Mold.Adapter.LocalStore",
		dna : "class",
		implements : "Mold.Interface.ModelAdapter",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.LocalStore"
		]
	},
	function(){
		
		Mold.mixin(this, new Mold.Lib.Event(this));
		var _localStore = new Mold.Lib.LocalStore();

		this.publics = {
			save : function(data, id){
				return _localStore.save(data, id);
			},
			load : function(id){
				var data =  _localStore.load(id);
				this.trigger("update", { data : data, id : id });
				return data;
			},
			add : function(data){
				var id =  _localStore.add(data);
				return id;
			},
			remove : function(id){
				_localStore.remove(id);
			}
		}
	}
);