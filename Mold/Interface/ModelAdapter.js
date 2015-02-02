Seed({
		name : "Mold.Interface.ModelAdapter",
		dna : "interface",
		include : [
			"Mold.DNA.Interface"
		]
	},
	{
		update : function(data, id){
			return "boolean";
		},
		remove : function(id){
			return "boolean";
		},
		insert : function(data){
			return "number";
		},
		load : function(id){

		},
		on : function(){

		}
	}
)