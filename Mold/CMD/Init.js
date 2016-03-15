//!info transpiled
Seed({
		type : "action",
		platform : 'node',
		include : [
			{ Command : 'Mold.Core.Command' },
			{ Promise : 'Mold.Core.Promise' },
			{ Helper : 'Mold.Core.CLIHelper' },
			'Mold.CMD.GetMoldJson'
		]
	},
	function(){

		Command.register({
			name : "init",
			description : "Creates a new  mold project.",
			parameter : {},
			code : function(args){

				return new Promise(function(resolve, reject){
					var cliform = [
						{
							label : "name your application (Mold.Lib.Peter):",
							input : {
								name : 'name',
								type : 'default',
								validate : 'required',
								messages : {
									error : "Is not valid!",
								},
								onsuccess : function(data){
									this.next()
								}
							}
						},
						{
							label : "version (0.0.1):",
							input : {
								name : 'version',
								type : 'default',
								validate : 'required',
								messages : {
									error : "It's not valid version number!"
								},
								onsuccess : function(data){
									this.next()
								}
							}
						},
						{
							label : "name of the repository (Mold):",
							input : {
								name : 'reponame',
								type : 'default',
								validate : 'required',
								messages : {
									error : "It's not a valid repository name!"
								},
								onsuccess : function(data){
									this.next()
								}
							}
						},
						{
							label : "path to the repository (Mold/):",
							input : {
								name : 'repopath',
								type : 'default',
								validate : 'required',
								messages : {
									error : "It's not a valid repository name!"
								},
								onsuccess : function(data){
									this.next()
								}
							}
						}
					]

					var cliForm = Helper.createForm(cliform);
					var configName = 'mold.json';
					cliForm.then(function(collected){
						try {
							if(Mold.Core.Pathes.exists(configName, 'file')){
								reject(new Error("mold.json allready exists!"));
								cliForm.exit();
							}else{
								
								var moldJsonData = {
									name : collected.name,
									version : collected.version,
									dependencies : [],
									repositories : {}
								}

								moldJsonData.repositories[collected.reponame] = collected.repopath;

								Command
									.createPath({ '-path' : configName, '-content' : JSON.stringify(moldJsonData, undefined, '\t')})
									.then(function(){
										Helper.ok(configName + " successfully created!").lb();
										if(!Mold.Core.Pathes.exists('.gitignore', 'file')){
											Command
												.createPath({ '-path' : 'gitignore', '-content' : ''})
												.then(function(){
													Helper.ok(".gitignore successfully created!").lb();
													cliForm.exit();
													resolve(args);
												})
										}else{
											cliForm.exit();
											resolve(args);
										}
									})
								
							}
						}catch(err){
							reject(err);
						}
					})
					
					cliForm.catch(reject);

					cliForm.start();

				});
				
			}
		})
	
	}
)