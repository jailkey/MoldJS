Seed({
		name : "Mold.CLI.Packages",
		dna : "cli",
		platform : "node",
		include : [
			"Mold.DNA.CLI",
		]
	},
	{
		command : "package",
		description : "Install seed from the given repository",
		parameter : {
			'-r' : {
				'description' : 'Create packages recursive.'
			}
		},
		execute : function(parameter, cli){
			var currentDir = process.cwd();
			
		}
	}
);