Seed({
		name : "Mold.CLI.Install",
		dna : "cli",
		include : [
			"Mold.DNA.CLI",
			"Mold.Tools.SeedHandler"
		]
	},
	{
		command : "install",
		description : "Install seed from the given repository",
		parameter : {
			'-g' : {
				'description' : 'Install the seed global'
			},
			'-repository' : {
				'description' : 'Path to the repository, if not set the default repository will requested'
			},
			'-name' : {
				'description' : 'Path to the repository'
			}
		},
		execute : function(parameter, cli){

			var fileSystem = require("fs");
			var repo = 'http://localhost/MoldTestRepo/' || parameter.repository;
			var seedHandler = new Mold.Tools.SeedHandler();

			var methodes = {
				isSeedInstalled : function(seedName){

				}
			}

			if(!parameter.name){
				cli.showError("-name parameter must be set!");
				return false;
			}

			if(parameter.repository){
				repo = repository
			}

			
			seedHandler.copyInfo(repo, parameter.name).then(function(info){
				cli.write("\nCheck dependenies:\n")
				Mold.each(info, function(value){
					console.log("length", value.length)
					if(value.exists){
						cli.write(cli.COLOR_GREEN + value.name + " is all ready installed!" + cli.COLOR_RESET);
					}
					console.log("copyInfo", value.exists);
				})
			}).fail(function(err){
				cli.showError(err)
			});
		}
	}
);