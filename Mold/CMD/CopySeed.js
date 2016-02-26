//!info transpiled
Seed({
		type : "action",
		platform : 'node',
		include : [
			{ Command : 'Mold.Core.Command' },
			{ Promise : 'Mold.Core.Promise' },
			{ Helper : 'Mold.Core.CLIHelper'},

		]
	},
	function(){

		Command.register({
			name : "copy-seed",
			description : "Copy a seed from the given path to the current repository",
			parameter : {
				'-path' : {
					'description' : 'The target seed path!',
					'required' : true,
					'type' : 'source',
				},
				'-p' : {
					'alias' : '-path'
				},
				'-name' : {
					'description' : 'The (full) seed name including the repository.',
					'required' : true
				}
			},
			code : function(args){
				var fs = require('fs');

				return new Promise(function(resolve, reject){
					var name = args.parameter['-name'].value;
					var path = args.parameter['-path'].value;
					if(!args.parameter.source || !args.parameter.source[0]){
						reject(new Error("Can't get file! [" + path + "]"));
						return;
					}
					var content = args.parameter.source[0];
					Command.execute('create-path', { '-p' : Mold.Core.Pathes.getPathFromName(name), '-c' : content})
						.then(function(){
							resolve(args);
						}).catch(reject);
				}); 
			}
		})
	
	}
)