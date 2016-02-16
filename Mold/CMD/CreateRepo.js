//!info transpiled
Seed({
		type : "action",
		platform : 'node',
		include : [
			{ Command : 'Mold.Core.Command' },
			{ Promise : 'Mold.Core.Promise' }
		]
	},
	function(){

		Command.register({
			name : "create-repo",
			description : "Creates a repository by name!",
			parameter : {
				'-name' : {
					'description' : 'The repository name!',
					'required' : true,
				},
				'-n' : {
					'alias' : '-name'
				}
			},
			code : function(args){

				return new Promise(function(resolve, reject){
					var name = args.parameter['-name'].value;
					console.log("TEST", name)
					if(!Mold.Core.Pathes.isMoldPath(name)){
						throw new Error("Name is not a valid repository name! [" + name + "]")
					}

					var existingRepositories = Mold.Core.Config.get('repositories');
					var isExisting = false;
					for(var repoName in existingRepositories){
						if(name.startsWith(repoName)){
							isExisting = true;
						}
					}

					if(!isExisting){
						//add to file
						console.log("create repo")
						existingRepositories[name] = name.replace('.', '/') + '/';
						Mold.Core.Config.get('repositories', existingRepositories);

						console.log("write new repo", existingRepositories)
						
						Command.execute('update-mold-json', { '-pr' : 'repositories', '-v' : existingRepositories})
							.then(function(){
								console.log("changed")
							})
							.catch(reject)
					}
					
				}); 
			}
		})
	
	}
)