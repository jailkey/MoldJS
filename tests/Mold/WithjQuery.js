Seed({
		name : "Mold.WithjQuery",
		dna : "static",
		include : [
			"http://code.jquery.com/jquery-2.1.1.min.js",
			["https://code.jquery.com/color/jquery.color-2.1.2.min.js"]
		]
	},
	function(){
	
		return {
			test : function(){
				return $.Color({ saturation: 0 });
			}
		}
	}
)