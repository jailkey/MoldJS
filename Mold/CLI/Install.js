Seed({
		name : "Mold.CLI.Install",
		dna : "cli",
		include : [
			"Mold.DNA.CLI",
			"Mold.Tools.SeedHandler",
			"Mold.Tools.RepoHandler"
		]
	},
	{
		command : "install",
		description : "Install seed from the given repository",
		parameter : {
			'--g' : {
				'description' : 'Install the seed global'
			},
			'-repository' : {
				'description' : 'Path to the repository, if not set the default repository will requested'
			},
			'-name' : {
				'description' : 'Path to the repository'
			},
			'--without-dependencies' : "Install the seed without dependencies"
		},
		execute : function(parameter, cli){

			var fileSystem = require("fs");
			var repo = 'http://localhost/MoldTestRepo/' || parameter.repository;
			var seedHandler = new Mold.Tools.SeedHandler();
			var repoHandler = new Mold.Tools.RepoHandler();

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
				var existing = {};
				var notExisting = [];
				cli.write("\nInstall "+parameter.name+" with dependencies:\n")
				Mold.each(info, function(value){
					if(value.exists && !existing[value.name]){
						cli.write(cli.COLOR_YELLOW + "  Skip " + value.name + ", it is all ready installed!" + cli.COLOR_RESET + "\n");
						existing[value.name] = true;
					}
					if(!value.exists){
						notExisting.push(value);
					}
				});
				Mold.each(notExisting, function(val){

					cli.write("  Try to install " + val.name + "! \n");

					repoHandler.addSeed(val.name, val.code, false).then(function(success){
						cli.write(cli.COLOR_GREEN + success + cli.COLOR_RESET + "\n");
					}).fail(function(err){
						cli.showError(err)
					})
					
				});
			;

			}).fail(function(err){
				cli.showError(err)
			});
		}
	}
);