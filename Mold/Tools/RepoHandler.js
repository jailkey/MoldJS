Seed({
		name : "Mold.Tools.RepoHandler",
		dna : "class",
		platform : "node",
		include : [
			"Mold.Lib.Promise"
		]
	},
	function(){

		var local = Mold.LOCAL_REPOSITORY;
			external = Mold.EXTERNAL_REPOSITORY;
			fileSystem = require("fs");
			_that = this;

		var _createSeedPath = function(seedName, path, chmod){
			var parts = seedName.split("/"),
				seedPath = "";

			chmod = chmod || 0744;

			for(var i = 0; i < parts.length - 1; i++){
				seedPath += parts[i] + "/";
				if(!fileSystem.existsSync(path + seedPath)){
					fileSystem.mkdirSync(path + seedPath, chmod)
				}
			}
		}

		this.publics = {
			seedExists : function(seedName, isExternal){
				var seedPath = Mold.getSeedPath(seedName);
				if(isExternal){
					return fileSystem.existsSync(external + seedPath);
				}else{
					return fileSystem.existsSync(local + seedPath);
				}
			},
			createSeedPath : _createSeedPath,
			addSeed : function(seedName, code, isExternal, overwrite){
				
				var path = ((isExternal) ? external : local),
					seedPath = Mold.getSeedPath(seedName);

				_createSeedPath(seedPath, path);

				return new Mold.Lib.Promise(function(success, error){
					var exists =  _that.seedExists(seedName, isExternal);
		
					if(overwrite || !exists){
						fileSystem.writeFile(path + seedPath, code, function(err) {
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
			}
		}
	}
)