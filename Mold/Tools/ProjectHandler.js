Seed({
		name  : "Mold.Tools.ProjectHandler",
		dna : 'class',
		version : '0.0.1',
		platform : 'node',
		include : [
			"Mold.Lib.Promise",
			"Mold.Lib.CLI",
			{ MultiLineString : "Mold.Lib.MultiLineString" }
		]
	},
	function(){

		var BREAK = "\n",
			PROJECT_FILE_NAME = "mold.project.json",
			fileSystem = require("fs");

		var _getProjectFile = function(name, config){
			var projectData = {};

			if(!name){
				return new Error("name must be specified!")
			}

			projectData['name'] = name;

			if(config.serverlocalrepo){
				projectData['server'] = {
					"local-repository" : config.serverlocalrepo,
					"external-repositor" : config.serverglobalrepo,
					"main-seed" : config.servermainseed
				}
			}

			if(config.clientlocalrepo){
				projectData['client'] = {
					"local-repository" : config.clientlocalrepo,
					"external-repositor" : config.clientglobalrepo,
					"main-seed" : config.clientmainseed
				}
			}
			
			if(config.debug){
				projectData['debug-mode'] = "on"
			}

			if(config.caching){
				projectData['caching'] = config.caching;
			}else{
				projectData['caching'] = "on";
			}

			return JSON.stringify(projectData, null, "\t");
		}

		_createDir = function(path, parts){
			var dirPath = "";
			var chmod = 0744;

			for(var i = 0; i < parts.length - 1; i++){
				dirPath += parts[i] + "/";
				if(!fileSystem.existsSync(path + dirPath)){
					fileSystem.mkdirSync(path + dirPath, chmod)
				}
			}
		}

		_createDirectorysProject = function(path, config){
			var dirPropertys = ['serverlocalrepo', 'serverglobalrepo', 'clientlocalrepo', 'clientglobalrepo'];
			Mold.each(dirPropertys, function(value){
				console.log("value", value)
				if(config[value]){
					_createDir(path, config[value].split("/"));
				}
			});
		}


		_createSeed = function(path, type, name){

			var seedCode = MultiLineString(function(){/*|
				Seed({
				        name : "${seedName}",
				        dna : "${seedType}"
				    },
				    function(){
				        //put in your start code
				    }
				)
			|*/},{
				seedName : name,
				seedType : type
			});

			var parts = name.split(".");
			var seedName = parts[parts.length -1];
			var file = path + name.replace(/\./g, "/") + ".js";
			parts.pop();
			_createDir(path, parts);
			if(!fileSystem.existsSync(file)){
				fileSystem.writeFileSync(file, seedCode);
			}
		}


		_checkGlobalRepo = function(path){
			if(!fileSystem.existsSync(path + "/Lib")){
				console.log("Install ")
				Mold.Lib.CLI.executeCommand("install", {

				});
			}
		}




		this.publics = {
			/**
			 * format mold.project.json
			 {
			 	"name" : "Project Name",
			 	"version" : "0.0.1",
				"server" : {
					"local-repository" : "/server/Mold",
					"external-repository" : "/global/Mold",
					"main-seed" : "Mold.Main",
					"debug" : "on",
					"caching" : "on"
				},
				"client" : {
					"local-repository" : "/client/Mold",
					"external-repository" : "/global/Mold",
					"main-seed" : "Mold.Main",
					"debug-mod" : "on",
					"caching" : "on"
				}
			 }
			 */

			create : function(name, path, config){

				if(!Mold.endsWith(path, "/")){
					path += "/";
				}

				return new Mold.Lib.Promise(function(success, error){

					var projectFile = _getProjectFile(name, config);
					console.log("config", config)
					_createDirectorysProject(path, config);

					if(config["clientlocalrepo"]){
						_createSeed(path + config["clientlocalrepo"].replace("Mold", ""), "action", config["clientmainseed"]);
					}

					if(config["serverlocalrepo"]){
						_createSeed(path + config["serverlocalrepo"].replace("Mold", ""), "action", config["servermainseed"]);
					}
					
					console.log("projectfile", projectFile)
					if(projectFile instanceof Error){
						error(result);
						return;
					}


				});
			},
			edit : function(property, value){

			}
		}
	}
)