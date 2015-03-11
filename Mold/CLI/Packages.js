Seed({
		name : "Mold.CLI.Packages",
		dna : "cli",
		platform : "node",
		include : [
			"Mold.DNA.CLI",
			"Mold.Lib.MultiLineString"
		]
	},
	{
		command : "package",
		description : "Creates a package in the current folder.",
		parameter : {
			'-r' : {
				'description' : 'Create packages recursive.'
			}
		},
		execute : function(parameter, cli){
			var fs = require("fs"),
				currentDir = process.cwd(),
				pathes = require("path"),
				files = fs.readdirSync(pathes.normalize(currentDir)),
				collected = [];

			var _getMoldName = function(currentDir){
				var parts = currentDir.split("/");
				var output = [];
				Mold.each(parts, function(value){
					if(value === "Mold" || output.length){
						output.push(value);
					}
				});

				return output.join(".");
			}

			var name = _getMoldName(currentDir);
			if(!name){
				throw new Error("no mold path found, are you shure that the current dir is inside a mold repo?")
			}
			Mold.each(files, function(value){
				if(Mold.endsWith(value, ".js") && !Mold.startsWith(value, '*') && !Mold.startsWith(value, '_')){
					//value
					console.log("Add file to package: " + value);
					collected.push("." + value.replace(".js", ""));
				}
			});

			var packageFile =
					"Seed({\n"+
					"\tname : '" + name + ".*',\n" +
					"\tdna : 'package',\n" +
					"\tinclude : " + JSON.stringify(collected, null, "\t\t") + "\n" +
					"});"
			
			fs.writeFile("_.js", packageFile, function(err) {
				if(err) {
					throw new Error(err);
				} else {
					console.log(cli.COLOR_GREEN + "Package successfully created!" + cli.COLOR_RESET);
				}
			}); 
		}
	}
);