Seed({
		name  : "Mold.Tools.ProjectHandler",
		dna : 'class',
		version : '0.0.1',
		platform : 'node',
		include : [
			"Mold.Lib.Promise"
		]
	},
	function(){

		var BREAK = "\n",
			PROJECT_FILE_NAME = "mold.project.json";

		var _getProjectFile = function(name, config){
			var projectData = {};

			if(!name){
				return new Error("name must be specified!")
			}

			projectData['name'] = name;
			projectData['local-repo'] = config.localrepo;
			projectData['external-repo'] = config.externalrepo;

			if(!config.mainseed){
				return new Error("main seed must be specified!");
			}

			projectData['main-seed'] = config.mainseed;
			
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


		var _getDirList =  function(name, config){
			var list = [ 
				"Mold",
				"vendor",
				"www"
			]
			
		});


		this.publics = {
			create : function(name, path, mainSeed, localRepo, externalRepo, debug){

				var config = {
					localrepo : localRepo,
					externalrepo : externalRepo, 
					mainseed : mainSeed,
					debug : debug,
				}

				return new Mold.Lib.Promise(function(success, error){


					var projectFile = _getProjectFile(name, config);

					if(projectFile instanceof Error){
						error(result);
						return;
					}


				}
			},
			edit : function(property, value){

			}
		}
	}
)