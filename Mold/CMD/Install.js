//!info transpiled
Seed({
		type : "action",
		platform : 'node',
		include : [
			{ Command : 'Mold.Core.Command' },
			{ Promise : 'Mold.Core.Promise' },
			{ VM : 'Mold.Core.VM' },
			{ Helper : 'Mold.Core.CLIHelper' },
			'Mold.CMD.GetMoldJson',
			'Mold.CMD.CopySeed'
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
			
					Command.getPackageInfo({ '-p' : args.parameter['-path']})
						.then(function(response){
							//console.log("get packed info reponse", response)
							var repoPromis = new Promise();
							var repos = [];
							
							//create repositorys
							for(repoName in response.packageInfo.repositories){
								repos.push(Command.createRepo({ '-name' : repoName }));
							}

							var repositories = [];
							var packagePromise = new Promise(function(resolvePackage, rejectPackage){
								var nextPackage = function(counter){
									var counter = counter || 0;
									if(response.packageInfo.linkedPackages[counter]){
										var currentPackage = response.packageInfo.linkedPackages[counter];
										Command.createDependency({ 
											'-name' : currentPackage.name,
											'-path' : currentPackage.path,
											'-version' : currentPackage.version
										}).then(function(response){
											repositories = response.parameter.repositories;
											nextPackage(++counter);
										}).catch(reject);
									}else{
										resolvePackage();
									}
								}
								nextPackage(0);
							});
							
							

							packagePromise.then(function(){
								console.log("resolvePackage")
								repoPromis
									.all(repos)
									.then(function(){
										var seeds = [];

										//copy seeds
										for(var seedName in response.packageInfo.linkedSeeds){
											var seedPath = response.packageInfo.linkedSeeds[seedName].path;
											if(seedPath){
												seeds.push(Command.copySeed({ '-name' : seedName, '-path' : seedPath }));
											}
										}

										var seedPromise = new Promise();
										seedPromise
											.all(seeds)
											.then(function(){
												resolve(args)
											})
											.catch(reject)



									})
									.catch(reject)
							}).catch(reject)
							
						})
						.catch(reject);					
						
			
				});
				
			}
		})
	
	}
)