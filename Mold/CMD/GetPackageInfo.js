//!info transpiled
Seed({
		type : "action",
		platform : 'node',
		include : [
			{ Command : 'Mold.Core.Command' },
			{ Promise : 'Mold.Core.Promise' },
			{ VM : 'Mold.Core.VM' }
		]
	},
	function(){

		Command.register({
			name : "get-package-info",
			description : "returns infos about a package!",
			parameter : {
				'-path' : {
					'description' : 'Path to the package dir.',
					'required' : true,
				},
				'-p' : {
					'alias' : '-path'
				},
				'--no-dependencies' : {
					'description' : 'If the options is choosen, only the info of the current package will be return. Dependent packages will be ignored!'
				},
				'--nd' : {
					'alias' : '--no-dependencies'
				}

			},
			code : function(args){

				var _getAllDependencies = function(vm, seed, response, dep){
					var dep = dep || {};
					seed.dependencies.forEach(function(seedName){
						var dependedSeed = vm.Mold.Core.SeedManager.get(seedName);
						dep[dependedSeed.name] = {
							path : dependedSeed.path,
							packageName : response.parameter.source[0].data.name,
							packageVersion : response.parameter.source[0].data.version
						}
						dep = _getAllDependencies(vm, dependedSeed, response, dep);
					});
					dep[seed.name] = {
						path : seed.path,
						packageName : response.parameter.source[0].data.name,
						packageVersion : response.parameter.source[0].data.version
					}
					return dep;
				}

				var _addCurrentVersion = function(seeds, version){
					for(var name in seeds){
						seeds[name].currentVersion = version;
					}
					return seeds;
				}

				return new Promise(function(resolve, reject){
				
					Command.execute('get-mold-json', { '-p' : args.parameter['-path']})
						.then(function(response){
								
							if(!response.parameter.source[0]){
								throw new Error("Source is not defined")
							}

							var collected = {
								linkedSeeds : {},
								repositories : {},
								linkedPackages : []
							}

							var path =  args.parameter['-path'].value;
							var currentPath = path;
							var getRepoVM = new VM({
								configPath : path
							});
						
							getRepoVM.Mold.Core.Config.isReady.then(function(){
								var loadSeeds = [];
								var linkedSeeds = response.parameter.source[0].data.seeds;
								var responsData = response.parameter.source[0].data;
								var linkedDependencies = [];

								//console.log("args.parameter['--no-dependencies']", args.parameter['--no-dependencies'])
								if(!args.parameter['--no-packages'] && !args.parameter['--no-dependencies']){
									linkedDependencies = responsData.dependencies || [];
								}
								collected.linkedPackages.push(responsData);
								if(responsData.repositories){
									for(var repoName in responsData.repositories){
										collected.repositories[repoName] =  responsData.repositories[repoName];
									}
								}
								if(linkedSeeds){
									linkedSeeds.forEach(function(name){
										loadSeeds.push(getRepoVM.Mold.load(name));
									});

									var promise = new Promise();
									promise.all(loadSeeds).then(function(result){
										if(!args.parameter['--no-dependencies']){
											result.forEach(function(seed){
												collected.linkedSeeds = _getAllDependencies(getRepoVM, seed, response);
											})
										}else{
											result.forEach(function(seed){
												collected.linkedSeeds[seed.name] = { 
													path : seed.path,
													packageName : responsData.name,
													packageVersion : responsData.version
												};
											})
										}

										if(linkedDependencies.length){
											var nextDep = function(count){
												count = count || 0;
												if(count === linkedDependencies.length){
													args.packageInfo = collected;
													resolve(args);
													return;
												}

												var currentDep = linkedDependencies[count];
												Command.execute('get-package-info', { '-p' : currentPath + currentDep.path })
													.then(function(foundInfo){
														foundInfo.packageInfo.linkedSeeds = _addCurrentVersion(foundInfo.packageInfo.linkedSeeds, currentDep.currentVersion)
														collected = Mold.merge(collected, foundInfo.packageInfo, { concatArrays : true})
														count++;
														nextDep(count);
													})
													.catch(reject);
											}

											nextDep();
										}else{
											args.packageInfo = collected;
											resolve(args);
										}

									}).catch(reject)

								}else{
									reject(new Error("No linked Seeds found in " + path.value + "!"))
								}
							
							}).catch(reject);
						})
						.catch(reject);
				}); 
			}
		})
	
	}
)