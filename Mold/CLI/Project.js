Seed({
		name : "Mold.CLI.Project",
		dna : "cli",
		include : [
			"Mold.DNA.CLI"
		]
	},
	{
		command : "project",
		description : "Install seed from the given repository",
		parameter : {
			'--new' : {
				'description' : 'Creates a new project in the current directory.'
			}
		},
		execute : function(parameter, cli){

			var form = cli.createForm([
				{
					label : "Do you wont to work with to repositorys (yes/no)?",
					input : {
						name : 'repocount',
						type : 'yesno',
						validate : 'yesno',
						messages : {
							error : "Please answer the question with yes or no!",
							success : function(data){
								if(data === "yes"){
									return "Ok lets work with two repositories"
								}
							}
						},
						onsuccess : function(data){
							if(data === "no"){
								this.next(2);
							}else{
								this.next();
							}
						}
					}
				},
				{
					label : "Path to your local repository?",
					input : {
						name : 'localrepo',
						type : 'filesystem',
						messages : {
							error : "Is not valid!",
							success : "Merci!"
						},
						onsuccess : function(){
							console.log("ONSUCCESEE MESSAGE 2");
							this.next();
						}
					}
				}
			])

			form.on("end", function(){
				console.log("end")
				console.log("formvalues", form.getData());
				form.exit();
			})

			form.start();
		}
	}
);