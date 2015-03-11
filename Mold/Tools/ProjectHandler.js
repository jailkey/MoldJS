Seed({
		name  : "Mold.Tools.ProjectHandler",
		dna : 'class',
		version : '0.0.1',
		platform : 'node',
		include : [
			"Mold.Lib.Promise",
			"Mold.Lib.CLI",
			{ MultiLineString : "Mold.Lib.MultiLineString" }
		],
		npm : {
			"request" : ">=2.5.0",
		}
			
	},
	function(){

		var BREAK = "\n",
			PROJECT_FILE_NAME = "mold.project.json",
			fileSystem = require("fs"),
			request =  require("request");



		var _getProjectFile = function(name, config){
			var projectData = {};

			if(!name){
				return new Error("name must be specified!")
			}

			projectData['name'] = name;

			if(config.serverlocalrepo){
				projectData['server'] = {
					"local-repository" : config.serverlocalrepo,
					"external-repository" : config.serverglobalrepo,
					"main-seed" : config.servermainseed
				}
			}

			if(config.clientlocalrepo){
				projectData['client'] = {
					"local-repository" : config.clientlocalrepo,
					"external-repository" : config.clientglobalrepo,
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

		var _createIndexHTML = function(localRepo, globalRepo, mainSeed){
			var indexContent = MultiLineString(function(){/*|
				<!doctype html>
					<html>
						<head>
							<meta charset="utf-8">
							<title>MoldJS App</title>
							<script data-mold-main="${mainSeed}"
								data-mold-repository="${localRepo}"
								data-mold-external-repository="${globalRepo}"
								data-mold-cache="off"
								data-mold-debug="on"
								src="${globalRepo}/Mold.js" type="text/javascript"
							></script>
						</head>
						<body>

						</body>
					</html>
			|*/},{
				mainSeed : mainSeed,
				globalRepo : globalRepo,
				localRepo : localRepo
			})

			fileSystem.writeFile("index.html", indexContent, function(err) {
				if(err) {
					throw new Error(err);
				} else {
					console.log("\u001b[32m" + "index.html successfully created!" +  "\u001b[39m");
				}
			}); 

		}

		var _createDir = function(path, parts){
			var dirPath = "";
			var chmod = 0744;

			for(var i = 0; i < parts.length - 1; i++){
				dirPath += parts[i] + "/";
				console.log("dirPath", dirPath);
				if(!fileSystem.existsSync(path + dirPath)){
					fileSystem.mkdirSync(path + dirPath, chmod)
				}
			}
		}

		var _createDirectorysProject = function(path, config){
			var dirPropertys = ['serverlocalrepo', 'serverglobalrepo', 'clientlocalrepo', 'clientglobalrepo'];
			Mold.each(dirPropertys, function(value){
				if(config[value]){
					_createDir(path, config[value].split("/"));
				}
			});
		}


		var _createSeed = function(path, type, name){

			var seedCode =  MultiLineString(function(){/*|
				Seed({
				        name : "${seedName}",
				        dna : "${seedType}"
				    },
				    function(){
				        //put in your start code
				        console.log("hello world!")
				    }
				)
			|*/},{
				seedName : name,
				seedType : type
			});

			var parts = name.split("."),
				seedName = parts[parts.length -1],
				file = path + name.replace(/\./g, "/") + ".js";
			//parts.pop();

			_createDir(path, parts);
			if(!fileSystem.existsSync(file)){
				fileSystem.writeFileSync(file, seedCode);
			}
		}


		var _checkGlobalRepo = function(path){
			var executed = [];
			if(!fileSystem.existsSync(path + "/Lib")){

			
				executed.push(Mold.Lib.CLI.executeCommand("install", {
					"name" : "Mold.Lib.*",
					"target" : path
				}));

				executed.push(Mold.Lib.CLI.executeCommand("install", {
					"name" : "Mold.DNA.*",
					"target" : path
				}));
				
				executed.push(Mold.Lib.CLI.executeCommand("install", {
					"name" : "Mold.Adapter.*",
					"target" : path
				}));
			
				executed.push(Mold.Lib.CLI.executeCommand("install", {
					"name" : "Mold.Defaults.*",
					"target" : path
				}))
			}
			var promise = new Mold.Lib.Promise();
			return promise.all(executed);
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
				var collect = [];
				return new Mold.Lib.Promise(function(success, error){

					var projectFile = _getProjectFile(name, config);
					_createDirectorysProject(path, config);
					
					if(config["clientlocalrepo"]){
						_createSeed(path + config["clientlocalrepo"].replace("Mold", ""), "action", config["clientmainseed"]);
						collect.push(_checkGlobalRepo(config["clientglobalrepo"]))
					}

					if(config["serverlocalrepo"]){
						_createSeed(path + config["serverlocalrepo"].replace("Mold", ""), "action", config["servermainseed"]);
					}


					_createIndexHTML(config["clientlocalrepo"], config["clientglobalrepo"], config["clientmainseed"]);

				
				//	request.get('http://mysite.com/doodle.png').pipe(resp)

					if(projectFile instanceof Error){
						error(result);
						return;
					}else{
						fileSystem.writeFile(PROJECT_FILE_NAME, projectFile, function(err) {
							if(err) {
								error(err);
							} else {
								console.log("\u001b[32m" + "mold.project.json successfully created!" +  "\u001b[39m");
							}
						});
					}

					new Mold.Lib.Promise()
							.all(collect)
							.then(function(value){
								success(value);
							})
							.fail(function(error){
								error(error);
							})

				});
			},
			edit : function(property, value){

			}
		}
	}
)