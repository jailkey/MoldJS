Seed (
	{ 
		name : "Mold.Misc.Test2",
		dna : "jqueryplugin",
		author : "Jan Kaufmann",
		include : ["Mold.DNA.jQueryPlugin"],
		description : "",
		version : 0.1
	},
	function(){
		return {
			test : function(){
				return this.each(function(){
					console.log("TEST", this);
				});
			}
		}
	}
)