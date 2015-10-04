Seed({
		name : "Mold.CLI.Doc",
		dna : "cli",
		include : [
			"Mold.DNA.CLI",
			"Mold.Tools.RepoHandler",
			"Mold.Tools.ProjectHandler",
			"Mold.Tools.Doc.MoldDoc",
			"Mold.Tools.Doc.MarkDownReporter",
			"Mold.Tools.ProjectHandler",
			"Mold.Lib.Promise"
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
			var exportPath = parameter.path || Mold.LOCAL_REPOSITORY + "docs/en/";
			var reporter = new Mold.Tools.Doc.MarkDownReporter();
			var projectHandler = new Mold.Tools.ProjectHandler()
			var overviewData = [];
			var fileCounter = 0;

			var promise = new Mold.Lib.Promise();

			var repo = new Mold.Tools.RepoHandler(Mold.LOCAL_REPOSITORY);

			//console.log("LOAD LOCAL DOC")

			var _docFile = function(path){
				
				if(fs.existsSync(path)){
					var doc = new Mold.Tools.Doc.MoldDoc(path);
					doc.get().then(function(data){
						var target = exportPath + data.name.replace(/\./g, "/") + reporter.getFileExtension();
						var targetPath = target.split("/").splice(0, target.split("/").length - 1).join("/") + "/";
						overviewData.push({
							name : data.name,
							path : data.name.replace(/\./g, "/"),
						})
						fileCounter++;
						if(repo.getLength() === fileCounter){
							promise.resolve()
						}
						reporter
							.report(data)
							.then(function(fileData){
								mkdirp(targetPath, function(){
								 	fs.writeFile(pathes.normalize(target), fileData, function(err) {
								 		console.log("\u001b[32m" + target + " successfully created!" +  "\u001b[39m");
										fs.chmodSync(pathes.normalize(target), 0755);
									})
								});
							})
					}).fail(function(e){
						//console.log("e", e)
					})
				}
			}

			//Test Local Repo
			var documentedRepo = function(){
			
				repo.eachSeed(function(path){
					_docFile(path)

				});

				promise.then(function(){
					reporter
						.overview({ overview : overviewData })
						.then(function(fileData){
							var target = exportPath + "index" + reporter.getFileExtension();
							fs.writeFile(pathes.normalize(target), fileData, function(err) {
								console.log("\u001b[32m" + target + " successfully created!" +  "\u001b[39m");
								fs.chmodSync(pathes.normalize(target), 0755);
							})

						})
				});
			}

			var _doDoc = function(){
				if(parameter.only){
					_docFile(Mold.LOCAL_REPOSITORY + parameter.only.replace(/\./g, "/") + ".js");
				}else{
					//test standard local
					documentedRepo();
					_docFile(Mold.LOCAL_REPOSITORY + "Mold.js")
				}
			}
			
			if(parameter.reporter){
				Mold.load({ name : parameter.reporter }).bind(function(){
					var  reporterSeed = Mold.getSeed(parameter.reporter);
					reporter = new reporterSeed();
					_doDoc();
				})
			}else{
				_doDoc();
			}

		}
	}
)