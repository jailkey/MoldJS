Seed({
		name : "Mold.SubClass",
		dna : "class",
		extend : "Mold.SuperClass"
	},
	function(){

		this.publics = {
			subClassMethod : function(){
				console.log("subclass method called")
			}
		}
	}
);