Seed({
		name : "Mold.CLI.Generate",
		dna : "cli",
		include : [
			'Mold.DNA.CLI',
			'Mold.Tools.SeedHandler'
		]
	},
	{
		command : "generate",
		description : "Generates a Seed in the current directory",
		parameter : {
			'-name' : {
				'description' : 'name of the seed'
			},
			'-dna' : {
				'description' : 'dna of the seed'
			}
			
		},
		execute : function(parameter, cli){
			
			if(!parameter.name){
			
				cli.showError("Name of the new seed is needed! \n")
				return;
			}

			if(!parameter.dna){
				cli.showError("dna of the new seed is needed! \n")
				return;
			}

			var path = process.cwd(),
				seedHandler = new Mold.Tools.SeedHandler();

			var seedName = seedHandler.getCurrentSeedPath() + "." +parameter.name;

			seedHandler.create(seedName, parameter.dna)
				.then(function(){
					cli.ok("seed " + seedName + " succefully created!\n");
				})
				.fail(function(err){
					cli.fail("dna of the new seed is needed! \n");
				});
				
		}
	}
)