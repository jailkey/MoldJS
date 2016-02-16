//!info transpiled
Seed({
		type : "action",
		platform : 'node',
		include : [
			{ Command : 'Mold.Core.Command' },
			{ Promise : 'Mold.Core.Promise' },
			{ Helper : 'Mold.Core.CLIHelper'}
		]
	},
	function(){

		Command.register({
			name : "create-path",
			description : "Creates all directories and files in a path if they not exists!",
			parameter : {
				'-path' : {
					'description' : 'The path!',
					'required' : true,
				},
				'-p' : {
					'alias' : '-path'
				}
			},
			code : function(args){
				var fs = require('fs');

				return new Promise(function(resolve, reject){
					var pathParts = args.parameter['-path'].value.split('/');
					
					if(args.parameter['-mode']){
						var mode = args.parameter['-mode'];
					}else{
						var mode = 0755;
					}

					var currentPath = "";
					for(var i = 0; i < pathParts.length; i++){
						var path = currentPath + pathParts[i];
						var type = 'file';
						if(i + 1 < pathParts.length){
							type = 'dir';
						}else if(!~pathParts[i].indexOf(".")){
							type = 'dir';
						}
						console.log("TRY", path, type)
						if(!Mold.Core.Pathes.exists(path, type)){
							try {
								
								if(type === 'dir'){
									fs.mkdirSync(path, mode);
									Helper.ok("directory created: '" + path + "'\n")
								}else if(type === 'file'){
									fs.writeFileSync(path, "");
									Helper.ok("file created: '" + path + "'\n")
								}
							}catch(e){
								reject(e);
							}
							
						}
						currentPath += pathParts[i] + "/";
					}
					resolve(args);
				}); 
			}
		})
	
	}
)