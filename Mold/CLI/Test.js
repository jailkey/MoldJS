Seed({
		name : "Mold.CLI.Test",
		dna : "cli",
		include : [
			"Mold.DNA.CLI",
			"Mold.Tools.RepoHandler",
			"Mold.Tools.SeedParser",
			"Mold.Tools.Test.Tester",
			"Mold.Tools.Test.CLIReporter",
			"Mold.Tools.ProjectHandler"
		]
	},
	{
		command : "test",
		description : "Executes all Tests in a Repo",
		parameter : {
			'-all' : {
				'description' : 'If set all repos in the project file will be tested.'
			},
			'-only' : {
				'description' : 'Test a specified seed.'
			}
		},
		execute : function(parameter, cli){
			var fs = require("fs");

			var project = new Mold.Tools.ProjectHandler();


			//Test Local Repo
			var testRepo = function(repo, external){
				var repo = new Mold.Tools.RepoHandler(Mold.LOCAL_REPOSITORY);
				
				repo.eachSeed(function(path){
					
					if(fs.existsSync(path)){
						var seedContent = fs.readFileSync(path);
						if(seedContent !== ""){
							var info = new Mold.Tools.SeedParser(seedContent);
						
							if(info && info.header && info.header.test && (!parameter.only || parameter.only === info.header.name)){
								if(
									!info.header.platform 
									|| info.header.platform === "isomorph"
									|| info.header.platform === "server"
									|| info.header.platform === "node"
								){
									
									var tester = new Mold.Tools.Test.Tester();
									tester.addReporter(new Mold.Tools.Test.CLIReporter(cli));
									Mold
										.load({ name : info.header.test })
										.bind(function(){
											Mold
												.load({ name : info.name}).bind(function(){
													tester.test(Mold.getSeed(info.header.test), Mold.getSeed(info.name));
													tester.run();
												});
										})
									
								}
							}
						}
					}
				});
			}

			//test standard local
			testRepo(Mold.LOCAL_REPOSITORY);
			
		}
	}
)