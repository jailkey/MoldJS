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
		var external = Mold.EXTERNAL_REPOSITORY;
		var fileSystem = require("fs");

		this.publics = {
			seedExists : function(seedName, isExternal){
				var seedPath = seedName.replace(".", "/") + ".js"
				if(isExternal){
					return fileSystem.existsSync(external + seedPath);
				}else{
					return fileSystem.existsSync(local + seedPath);
				}
			},
			addSeed : function(seedName, code, isExternal, overwrite){
				var path = ((isExternal) ? external : local) + seedName.replace(".", "/") + ".js";

				return new Promise(function(success, error){
					var exists =  this.seedExists(seedName, isExternal);
					if(overwrite || !exists){
						fileSystem.writeFile(path, code, function(err) {
							if(err){
								error(err);
							}else{
								var message = (exists) ? "Seed " + seedName + " updated!" : "Seed " + seedName + " added to " + path + "!";
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