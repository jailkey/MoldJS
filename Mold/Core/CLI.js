//!info transpiled
/**
 * @module Mold.Core.ClI
 * @description static object provides methods to create CLI commands
 */
Seed({
		type : "static",
		platform : 'node',
		include : [
		//	'Mold.Lib.Event',
		//	'Mold.Tools.CLIForm',
			{ Promise : 'Mold.Core.Promise' },
			{ CLIHelper : 'Mold.Core.ClIHelper' },
			{ Command : 'Mold.Core.Command' }
		]
	},
	function(){

		var _commands = {};
		var _loadedCommandSeeds = {};
		var fs = require('fs');
		var _isLoaded = new Promise(false, { throwError : true});

		if(!Mold.isNodeJS){
			throw Error("You can use Mold.Core.CLI only with NodeJS!");
		}	

		var _commandExists = function(cmd){
			return (_commands[cmd.name]) ? true : false;
		}

		var _isLoadedSeed = function(name){

		}

		var _get = function(name){
			return _commands[name];
		}

		var _loadCommands = function(repo, commandSpace){
			commandSpace = commandSpace || 'CMD';
			
			return new Mold.Core.Promise(function(resolve, reject){
				var name = repo.name + "." + commandSpace + ".";
				var path = repo.path + "/" + commandSpace + "/";
				if(Mold.Core.Pathes.exists(path, 'dir')){
					var dirValue = fs.readdirSync(path);
				
					var loadingSeeds = [];
					dirValue.forEach(function(entry){
						var seedName = name + entry.replace(".js", "");
						var seedPath = path + entry;
						if(Mold.Core.Pathes.exists(seedPath, 'file') && !_loadedCommandSeeds[seedName]){
							loadingSeeds.push(Mold.load(seedName))
						}
					})

					var testPromise = new Mold.Core.Promise().all(loadingSeeds);
					testPromise.then(function(){
						resolve()
					})
				}else{
					resolve()
				}
				
			}, { throwError : true });
		}

		var _loadRepositorys = function(type){
			var repos = Mold.Core.Config.get("repositories", type);
			var count = 0;
			var length = Object.keys(repos).length;

			var next = function(){
				if(!Object.keys(repos)[count]){
					if(type === 'local'){
						_loadRepositorys('global');
					}else{
						_isLoaded.resolve()
					}

					return null;
				}
				var repo = {
					name : Object.keys(repos)[count],
					path : repos[Object.keys(repos)[count]]
				}
				count++;
				_loadCommands(repo, repos.commandSpace || null).then(function(){
					next()
				});
			}
			next();
			
		}

		var _validate = function(task){
			if(!task.name){
				throw new Error("Command name is not defined!");
			}

			if(!task.code){
				throw new Error("Command code is not defined! [" + task.name + "]");
			}
		}


		var _getCommandHelp = function(cmd){
			var help = "\nMold command help '\033[1;35m" + cmd.name + "\033[0m'\n";
			
			if(cmd.description){
				help += cmd.description + "\n";
			}

			help += "\n";

			for(var name in cmd.parameter){
				if(cmd.parameter[name].description){
					help += CLIHelper.COLOR_CYAN + name + CLIHelper.COLOR_RESET + " \t " + cmd.parameter[name].description + "\n";
				}else if(cmd.parameter[name].alias){
					help += CLIHelper.COLOR_CYAN + name + CLIHelper.COLOR_RESET + "  \t alias for " + cmd.parameter[name].alias + "\n";
				}
			}

			console.log(help + "\n")
		}


		var _execCommands = function(count, data){
			count = count || 0;
			var commandLineParameter = Mold.Core.Initializer.getCLICommands();
			var currentCommand = commandLineParameter[count];

			return new Promise(function(resolve, reject){
				if(currentCommand){
				 	//Command.execute(currentCommand.name, currentCommand.parameter);
				 	console.log("EXEC", currentCommand.name)
				 	Command.execute(currentCommand.name, currentCommand.parameter, data)
				 		.then(function(result){
				 			count++;
				 			_execCommands(count, result).catch(reject);
			 			})
			 			.catch(reject);
				}else{
					resolve();
					//reject(new Error("Command not found!"))
				}
			});
		}

		_loadRepositorys('local');
		_isLoaded.then(_execCommands).catch(function(e){
			if(e instanceof Mold.Errors.CommandError){
				console.log(e.message)
				_getCommandHelp(Command.get(e.command))
				return;
			}else{
				console.log(CLIHelper.COLOR_RED + e.stack + CLIHelper.COLOR_RESET);
			}
		})

		return {

			exec : function(){

			},

			get : _get,

			
		}
	}
)