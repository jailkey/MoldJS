Seed({
		name : "Mold.CLI.Build",
		dna : "cli",
		include : [
			'Mold.DNA.CLI'
		]
	},
	{
		command : "build",
		description : "Builds a Mold app by the specified repositories and seeds.",
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
		execute : function(parameter, cli){
			console.log("executed", parameter)

			cli
				.write('Schreib was:')
				.read(function(data){
					cli.write("I got some data: " + cli.COLOR_GREEN + cli.SYMBOLE_TRUE + cli.COLOR_RESET + data +  " ")

					//cli.exit()
					
				});
		}
	}
)