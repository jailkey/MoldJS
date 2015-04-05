Seed({
		name : "Mold.CLI.Test",
		dna : "cli",
		include : [
			"Mold.DNA.CLI",
			"Mold.Tools.ProjectHandler"
		]
	},
	{
		command : "test",
		description : "Executes all Tests in a Repo",
		parameter : {
			'-repo' : {
				'description' : 'Path to the test repo. If not set, the local repo from the project file will be tested.'
			},
			'-all' : {
				'description' : 'If set all repos in the project file will be tested.'
			}
		},
		execute : function(parameter, cli){
			console.log("test")
			var projectHandler = new Mold.Tools.ProjectHandler();
			console.log(Mold.LOCAL_REPOSITORY);
			console.log(Mold.GLOBAL_REPOSITORY)
			console.log(projectHandler.info())
		}
	}
)