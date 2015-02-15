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
						type : 'text',
						validate : 'yesno',
						messages : {
							error : "please answer the question with yes or no!",
							success : function(data){
								if(data === "yes"){
									return "Ok  lets work with two repository"
								}
							}
						},
						onsuccess : function(form, data){
							form.next(2);
						}
					}
				},
				{
					label : "Path to your local repository?",
					input : {
						name : 'test',
						type : 'text',
						validate : 'required',
						messages : {
							error : "Is not valid!",
							success : "Supi! | function"
						}
					}
				},
				{

				}
			])

			form.start();
		}
	}
);