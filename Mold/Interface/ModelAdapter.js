Seed({
		name : "Mold.Interface.ModelAdapter",
		dna : "interface",
		include : [
			"Mold.DNA.Interface"
		]
	},
	{
		save : function(data, id){
			return "boolean";
		},
		remove : function(id){
			return "boolean";
		},
		add : function(data){
			return "number";
		},
		load : function(id){

		},
		on : function(){

		}
	}
)