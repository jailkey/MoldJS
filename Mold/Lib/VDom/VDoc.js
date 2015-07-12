Seed({
		name : "Mold.Lib.VDom.VDoc",
		dna : "static",
		include : [
			"->Mold.Lib.Dom"
		]
	},
	function(){

		return (Mold.isNodeJS) ? new Mold.Lib.Dom("<div></div>") : document;
	}
)