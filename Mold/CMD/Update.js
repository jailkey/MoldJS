//!info transpiled
Seed({
		type : "action",
		platform : 'node',
		include : [
			{ Command : 'Mold.Core.Command' },
			{ Promise : 'Mold.Core.Promise' },
			{ Helper : 'Mold.Core.CLIHelper' },
			{ Version : 'Mold.Core.Version' },
			'Mold.CMD.GetMoldJson',
			'Mold.CMD.CopySeed'
		]
	},
	function(){

		Command.register({
			name : "update",
			description : "Updates all package dependencies.",
			parameter : {
				'-dependency' : {
					'description' : 'Name of the dependency to update, if not given all dependencies will be updated!',
				},
				'-d' : {
					'alias' : '-dependency'
				}
			},
			code : function(args){

				return new Promise(function(resolve, reject){
					Command.getMoldJson({ '-p' : '' }, function(moldJson){
						moldJson =  moldJson.parameter.source[0].data;
						if(!moldJson){
							reject(new Error("Config is not defined!"))
						}

						if(moldJson.dependencies.length){
							var infoPromises = [];
							var infos = [];
							moldJson.dependencies.forEach(function(dep){
								infoPromises.push(new Promise(function(resolveDep, rejectDep){

									//get all infos
									Command.getPackageInfo({ '-p' : dep.path }, function(currentConf){
										currentConf = currentConf.parameter.source[0].data;


									}).catch(rejectDep);

								}));
							})
						}else{
							Helper.info("No dependencies found!").lb();
						}
					})
				});
				
			}
		})
	
	}
)