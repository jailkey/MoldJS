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
			'--without-dependencies' : {
				'description' : 'Install the seed without dependencies'
			},
			'--overwrite' : {
				'description' : 'Overwrite existing seeds'
			}
		},
		execute : function(parameter, cli){

			var fileSystem = require("fs"),
				repo = parameter.repository || 'http://www.moldjs.de/repo/',
				seedHandler = new Mold.Tools.SeedHandler(),
				targetRepo = false,
				overwrite = Mold.is(parameter['-overwrite']),
				globalInstall = Mold.is(parameter['-g']),
				repoHandler = new Mold.Tools.RepoHandler();


			if(!parameter.name){
				cli.showError("-name parameter must be set!");
				return false;
			}



			if(globalInstall){
				targetRepo = Mold.EXTERNAL_REPOSITORY;
			}else{
				targetRepo = Mold.LOCAL_REPOSITORY;
			}

			
			seedHandler.infos(repo, parameter.name).then(function(info){
				
				var existing = {},
					toAdd = [];

				cli.write("\nInstall "+parameter.name+" with dependencies into: " + targetRepo + "\n");
				cli.write("Overwrite existing \n")
				Mold.each(info, function(value){
					if(value.exists && !existing[value.name] && !overwrite){
						cli.write(cli.COLOR_YELLOW + "  Skip " + value.name + ", it is already installed!" + cli.COLOR_RESET + "\n");
						existing[value.name] = true;
					}else{
						toAdd.push(value);
					}
				});

				Mold.each(toAdd, function(val){

					repoHandler.addSeed(val.name, val.code, globalInstall, overwrite).then(function(success){
						cli.write("  " +cli.COLOR_GREEN + success + cli.COLOR_RESET + "\n");
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