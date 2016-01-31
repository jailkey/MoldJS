Seed({
		type : "static",
		include : [
			"Mold.Lib.Dom"
		]
	},
	function(){
		//return new Mold.Lib.Dom("<div></div>");
		return (Mold.isNodeJS) ? new Mold.Lib.Dom("<div></div>") : document;
	}
)