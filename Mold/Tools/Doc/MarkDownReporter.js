Seed({
		name : "Mold.Tools.Doc.MarkDownReporter",
		dna : "class",
		platform : "node",
		include : [
			"Mold.Lib.Template"
		]
	},
	function(url){

		var template = new Mold.Lib.Template(function(){/*|
			{{#parameter}}

			{{/parameter}}
		|*/})
		
		
		this.publics = {
			report : function(data){
				console.log("data", data)
			}
		}
	}
)