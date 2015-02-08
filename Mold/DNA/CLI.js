Seed({
		name : "Mold.DNA.CLI",
		dna : "dna",
		author : "Jan Kaufmann",
		version : "0.0.1",
		include : [
			"Mold.Lib.CLI"
		]
	},
	{
		name :  "cli",
		dnaInit : function(){
			
		},
		create : function(seed) {
			Mold.Lib.CLI.addCommand(seed.func)
			
			return seed.func;
		}
	}
);