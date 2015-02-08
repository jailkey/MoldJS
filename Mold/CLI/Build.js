Seed({
		name : "Mold.CLI.Build",
		dna : "cli",
		include : [
			'Mold.DNA.CLI'
		]
	},
	{
		command : "build",
		description : "Builds a Mold app by the specified repos and seeds.",
		parameter : {
			'-conf' : {
				'description' : 'Path to configuration file.'
			},
			'-repo' : {
				'description' : 'Path to repository'
			},
			'-extrepo' : {
				'description' : 'Path to external repository'
			},
			'-main' : {
				'description' : 'Path to the main seed of the app'
			}
		},
		execute : function(parameter){
			console.log("executed", parameter)
		}
	}
)