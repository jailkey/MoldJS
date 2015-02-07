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
			update : function(data, id){
				console.log("update", id, data)
				return _localStore.save(data, id);
			},
			load : function(id){
				console.log("load", id)
				var data =  _localStore.load(id);
				console.log("load", id, data)
				this.trigger("update", { data : data, id : id });
				return data;
			},
			insert : function(data){
				console.log("add data", data)
				var id =  _localStore.add(data);
				return id;
			},
			remove : function(id){
				_localStore.remove(id);
			}
		}
	}
);