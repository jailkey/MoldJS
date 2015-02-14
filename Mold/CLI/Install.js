Seed({
		name : "Mold.CLI.Install",
		dna : "cli",
		include : [
			"Mold.DNA.CLI",
			"Mold.Tools.SeedHandler",
			"Mold.Tools.RepoHandler"
		],
		npm : {
			'npm' : '>=2.0.0'
		}
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
			'--without-npm' : {
				'description' : 'Install seeds without npm dependencies'
			},
			'--overwrite' : {
				'description' : 'Overwrite existing seeds'
			}
		},
		execute : function(parameter, cli){

			var fileSystem = require("fs"),
				npm = require("npm"),
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
				if(overwrite){
					cli.write("Overwrite existing seeds!\n")
				}
				Mold.each(info, function(value){
					if(value.exists && !existing[value.name] && !overwrite){
						cli.write(cli.COLOR_YELLOW + "  Skip " + value.name + ", it is already installed!" + cli.COLOR_RESET + "\n");
						existing[value.name] = true;
					}else{
						toAdd.push(value);
					}
					
					if(value.header.npm){
						Mold.each(value.header.npm, function(version, name){
							//console.log("npm", value, name);
							repoHandler.npmExists(name, version).fail(function(err){
								if(err.type === 1){
									repoHandler.addNpm(name, false, globalInstall)
										.then(function(data){
											console.log(cli.COLOR_GREEN + "npm " + name + " successfully installed!" + cli.COLOR_RESET);
										}).fail(function(installError){
											cli.showError("npm problem in " + value.name + ": \n");
											cli.showError(installError);
										});
								}else{
									cli.showError(err.message)
								}
							});
						});
					}
				});

				Mold.each(toAdd, function(val){
					repoHandler.addSeed(val.name, val.code, globalInstall, overwrite).then(function(success){
						cli.write("  " +cli.COLOR_GREEN + success + cli.COLOR_RESET + "\n");
					}).fail(function(err){
						cli.showError(err);
					});
					
				});
				



			}).fail(function(err){
				cli.showError(err)
			});
		}
	}
);