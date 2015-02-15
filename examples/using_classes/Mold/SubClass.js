Seed({
		name : "Mold.SubClass",
		dna : "class",
		extend : "Mold.SuperClass"
	},
	function(testone, testtwo){
	

		this.publics = {
			subClassMethod : function(){
				console.log("subclass method called")
			}
		}
	}
);