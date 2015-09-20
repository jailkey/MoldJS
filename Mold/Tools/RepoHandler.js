Seed({
		name : "Mold.Tools.RepoHandler",
		dna : "class",
		platform : "node",
		include : [
			"Mold.Lib.Promise"
		],
		npm : {
			"npm" : ">=2.0.0",
			"semver" : "*",
		}
	},
	function(repoPath){

		if(!repoPath){
			throw new Error("Path to repository is not defined!")
		}

		var repoPath = repoPath,
			fileSystem = require("fs"),
			npm = require("npm"),
			semver = require("semver"),
			pathes = require("path"),
			_that = this;

		var _createSeedPath = function(seedName, path, chmod){
			var parts = seedName.split("/"),
				seedPath = "";

			chmod = chmod || 0744;

			for(var i = 0; i < parts.length - 1; i++){
				seedPath += parts[i] + "/";
				if(!fileSystem.existsSync(pathes.normalize(path + seedPath))){
					fileSystem.mkdirSync(pathes.normalize(path + seedPath), chmod)
				}
			}
		}

		var _iterateThroughDir = function(dir, iterator){
			var files = fileSystem.readdirSync(pathes.normalize(dir));
			Mold.each(files, function(file){
				if(Mold.endsWith(file, ".js")){
					iterator.call(null, pathes.normalize(dir + "/" +file));
				}
				if(fileSystem.lstatSync(pathes.normalize(dir + "/" + file)).isDirectory()){
					_iterateThroughDir(pathes.normalize(dir + "/" + file), iterator)
				}
			});		
		}

		this.publics = {
			eachSeed : function(iterator){
				var path = repoPath;

				if(!Mold.endsWith(path, "Mold/")){
					path += "/Mold/"
				}
				_iterateThroughDir(path, iterator);
			},
			seedExists : function(seedName){
				var seedPath = Mold.getSeedPath(seedName);
				return fileSystem.existsSync(pathes.normalize(repoPath + seedPath));
			},
			createSeedPath : _createSeedPath,
			addSeed : function(seedName, code, overwrite){

				seedName = seedName.replace("*", "_");
				
				var path = repoPath,
					seedPath = Mold.getSeedPath(seedName);

				_createSeedPath(seedPath, path);

				return new Mold.Lib.Promise(function(success, error){
					var exists =  _that.seedExists(seedName);
		
					if(overwrite || !exists){
						fileSystem.writeFile(pathes.normalize(path + seedPath), code, function(err) {
							if(err){
								error(err);
								return;
							}else{
								var message = (exists) ? "Seed " + seedName + " successfully updated!" : "Seed " + seedName + " successfully added to " + path + "!";
								success(message);
							}
						});
					}else{
						success("Seed  " + seedName +  " exists, not updated!");
					}
				})
			},
			npmExists : function(packageName, version){
				return new Mold.Lib.Promise(function(success, error){
					npm.load({}, function (er) {
	  					if (er){
	  						console.log("error");
	  						error({ type : 3, message : "Can't load npm!" })
	  					}
	  		
	  					npm.commands.list(['--verbose', packageName], true, function(err, data){
	  						if(err){
	  							error({ type : 4, message :  "npm " + packageName + " failure " + err }); 
	  							return; 
	  						}
	  		
	  						if(!data._found){
	  							error({ type : 1, message : "npm " + packageName + " is not installed!"})
	  							return;
	  						}
	  						
	  						if(data.dependencies && data.dependencies[packageName]){
		  						if(!semver.satisfies(data.dependencies[packageName].version, version)){
		  							error({ type : 2, message : "npm '" + packageName + "' version does not match. Required is " + version + ". Please update npm!"})
		  							return;
		  						}
		  					}
	  					
	  					});
	  				});
	  			});
			},
			addNpm : function(packageName, version, isGlobal){
				return new Mold.Lib.Promise(function(success, error){
					var globale = (isGlobal) ? "-g" : "";
					npm.commands.install([packageName, globale], function (err, data) {
						if(err){
							error("Can not install npm '" + packageName + "' " + err);
						}else{
							success(data);
						}
					});
				});
			}
		}
	}
)