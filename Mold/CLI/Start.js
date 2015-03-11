Seed({
		name : "Mold.CLI.Start",
		dna : "cli",
		include : [
			"Mold.Lib.Path"
		],
		npm : {
			
		}
	},
	{
		command : "start",
		description : "start a server site mold application from the current dir",
		parameter : {
		},
		execute : function(parameter, cli){

			var currentDir = process.cwd(),
				fs = require("fs"),
				PROJECT_FILE_NAME = "mold.project.json";

			if(!fs.existsSync(currentDir + "/" + PROJECT_FILE_NAME)){
				cli.showError("Can not find " + currentDir + "/" + PROJECT_FILE_NAME + " file!\n" );
				return;
			}			
			
			var config = require(currentDir + "/" + PROJECT_FILE_NAME);

			if(!config.server){
				cli.showError("Server configuration is not defined!\n" );
				return;
			}
			
			if(config.server["local-repository"]){
				Mold.LOCAL_REPOSITORY = currentDir + "/" + config.server["local-repository"];
			}else{
				cli.showError("Local Server repository is not defined!\n" );
				return;
			}

			if(config.shared && !Mold.Lib.Path.isHTTP(config.shared)){
				Mold.EXTERNAL_REPOSITORY = config.shared;
			}

			Mold.load({ name : config.server["main-seed"]}).bind(function(){
				console.log(cli.COLOR_GREEN + "Seed " + config.server["main-seed"] + " successfully started!" + cli.COLOR_RESET);
			})
		

		}
	}
);