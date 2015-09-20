Seed({
		name : "Mold.CLI.Doc",
		dna : "cli",
		include : [
			"Mold.DNA.CLI",
			//"Mold.Tools.RepoHandler",
			//"Mold.Tools.ProjectHandler",
			//"Mold.Tools.Doc.MoldDoc",
			"Mold.Tools.Doc.MarkDownReporter"
		]
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
			console.log("DOC")
			var fs = require("fs");
			var project = new Mold.Tools.ProjectHandler();
			var exportPath = Mold.LOCAL_REPOSITORY + "/Doc/";
			var reporter = new Mold.Tools.Doc.MarkDownReporter(exportPath);


			//Test Local Repo
			var documentedRepo = function(repo, external){
				var repo = new Mold.Tools.RepoHandler(Mold.LOCAL_REPOSITORY);
				
				repo.eachSeed(function(path){
					console.log(path)
					if(fs.existsSync(path)){
						//var seedContent = fs.readFileSync(path);
						var doc = new Mold.Tools.Doc.MoldDoc(path);
						//console.log("path", path)
						doc.get().then(function(data){
							console.log("doc", data)
							reporter.report(data);
						}).fail(function(e){
							console.log("e", e)
						})
					}
				});
			}

			//test standard local
			documentedRepo(Mold.LOCAL_REPOSITORY);
			
		}
	}
)