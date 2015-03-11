Seed({
		name : "Mold.CLI.Install",
		dna : "cli",
		include : [
			"Mold.DNA.CLI",
			"Mold.Tools.SeedHandler",
			"Mold.Tools.RepoHandler",
			"Mold.Lib.Promise"
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
			'-target' : {
				'description' : 'Path to the target repository'
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
				repo = parameter.repository || Mold.SOURCE_REPOSITORY,
				seedHandler = new Mold.Tools.SeedHandler(),
				targetRepo = false,
				overwrite = Mold.is(parameter['-overwrite']),
				globalInstall = Mold.is(parameter['-g']),
				promise = new Mold.Lib.Promise();


			if(!parameter.name){
				cli.showError("-name parameter must be set!");
				return false;
			}

			if(globalInstall){
				targetRepo = Mold.EXTERNAL_REPOSITORY;
			}else{
				if(parameter.target){
					targetRepo = parameter.target;
				}else{
					targetRepo = Mold.LOCAL_REPOSITORY;
				}
			}
			

			seedHandler.infos(repo, parameter.name, targetRepo).then(function(info){
				
				var existing = {},
					toAdd = [];

				cli.write("\nInstall "+parameter.name+" with dependencies into: " + targetRepo + "\n");
				if(overwrite){
					cli.write("Overwrite existing seeds!\n")
				}
				var repoHandler = new Mold.Tools.RepoHandler(targetRepo);
				Mold.each(info, function(value){

					if(value.exists && !existing[value.name] && !overwrite){
						cli.write(cli.COLOR_YELLOW + "  Skip " + value.name + ", it is already installed!" + cli.COLOR_RESET + "\n");
						existing[value.name] = true;
					}else{
						toAdd.push(value);
					}
					
					if(value.header.npm){
						Mold.each(value.header.npm, function(version, name){
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
									promise.reject(err.message);
								}
							});
						});
					}
				});

				var checkToAdd = function(toAdd, added){
					if(toAdd.length === added){
						promise.fulfill("All Files added!");
					}
				}
				var added = 0;
				Mold.each(toAdd, function(val){
					repoHandler.addSeed(val.name, val.code, overwrite).then(function(success){
						cli.write("  " +cli.COLOR_GREEN + success + cli.COLOR_RESET + "\n");
						added++;
						checkToAdd(toAdd, added);
					}).fail(function(err){
						cli.showError(err);
						added++
						checkToAdd(toAdd, added);
					});
					
				});


				if(!toAdd.length){
					promise.fulfill("All Files added!")
				}
				


			}).fail(function(err){
				cli.showError(err)
				promise.reject(err);
			});

			return promise;
		}
	}
);