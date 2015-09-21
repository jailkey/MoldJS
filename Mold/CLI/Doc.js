Seed({
		name : "Mold.CLI.Doc",
		dna : "cli",
		include : [
			"Mold.DNA.CLI",
			"Mold.Tools.RepoHandler",
			"Mold.Tools.ProjectHandler",
			"Mold.Tools.Doc.MoldDoc",
			"Mold.Tools.Doc.MarkDownReporter",
			"Mold.Tools.ProjectHandler"
		],
		npm : {
			"mkdirp" : "*"
		}
	},
	{
		command : "doc",
		description : "Creates a documentation",
		parameter : {
			'-only' : {
				'description' : 'Documentes a specified seed.'
			},
			'-repo' : {
				'description' : 'Documentes a specified repo, default is the local repository.'
			},
			'-path' : {
				'description' : 'Path to the documentation directory, default is local repository /Doc'
			},
			'-reporter' : {
				'description' : 'Defines the reporter, possible values are "markdown", "html", "json", or a reporter seed'
			}
		},
		execute : function(parameter, cli){

			var fs = require("fs");
			var mkdirp = require("mkdirp");
			var pathes = require('path');
			var project = new Mold.Tools.ProjectHandler();
			var exportPath = Mold.LOCAL_REPOSITORY + "docs/en/";
			var reporter = new Mold.Tools.Doc.MarkDownReporter();
			var projectHandler = new Mold.Tools.ProjectHandler()


			var _docFile = function(path){
			
				if(fs.existsSync(path)){
					var doc = new Mold.Tools.Doc.MoldDoc(path);
					doc.get().then(function(data){
	
						reporter
							.report(data)
							.then(function(fileData){
						
								var target = exportPath + data.name.replace(/\./g, "/") + reporter.getFileExtension();
								var targetPath = target.split("/").splice(0, target.split("/").length - 1).join("/") + "/";
								mkdirp(targetPath, function(){
								 	fs.writeFile(pathes.normalize(target), fileData, function(err) {
								 		console.log("\u001b[32m" + target + " successfully created!" +  "\u001b[39m");
										fs.chmodSync(pathes.normalize(target), 0755);
									})
								});
							})
					}).fail(function(e){
						console.log("e", e)
					})
				}
			}

			//Test Local Repo
			var documentedRepo = function(repo, external){
				var repo = new Mold.Tools.RepoHandler(Mold.LOCAL_REPOSITORY);
				
				repo.eachSeed(function(path){
					_docFile(path)
				});
			}

			if(parameter.only){
				_docFile(Mold.LOCAL_REPOSITORY + parameter.only.replace(/\./g, "/") + ".js");
			}else{
				//test standard local
				documentedRepo(Mold.LOCAL_REPOSITORY);
				_docFile(Mold.LOCAL_REPOSITORY + "Mold.js")
			}
			
		}
	}
)