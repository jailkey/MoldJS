//!info transpiled
Seed({
		type : "action",
		platform : 'node',
		include : [
			{ Command : 'Mold.Core.Command' },
			{ Promise : 'Mold.Core.Promise' },
			{ VM : 'Mold.Core.VM' },
			'Mold.CMD.GetMoldJson'
		]
	},
	function(){

		Command.register({
			name : "install",
			description : "Installs a mold package by a given path or name",
			parameter : {
				'-path' : {
					'description' : 'Path to the package directory!',
					'required' : true,
				},
				'-target' : {
					'description' : 'target name'
				},
				'-p' : {
					'alias' : '-path'
				},
				'-t' : {
					'alias' : '-target'
				},
				'--no-dependencies' : {
					'description' : 'Install the seed without dependencies.'
				},
				'--nd' : {
					'alias' : '--no-dependencies'
				}
				/*
				'--without-npm' : {
					'description' : 'Install seeds without npm dependencies'
				}*/
			},
			code : function(args){

				return new Promise(function(resolve, reject){
					
					Command.execute('get-package-info', { '-p' : args.parameter['-path']})
						.then(function(response){
							console.log("get packed info reponse", response.packageInfo)
						})
						.catch(reject);					
					
				}); 
			}
		})
	
	}
)