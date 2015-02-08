Seed({
		name : "Mold.Lib.CLI",
		dna : "static",
		include : [
			'Mold.Lib.Event'
		]
	},
	function(){

		var _that = this,
			_commands = [];

		Mold.mixin(this, new Mold.Lib.Event(this));

		if(!Mold.isNodeJS){
			throw Error("You can use Mold.Lib.CLI only with NodeJS!");
		}

		var _getCommand = function(name){
			return Mold.find(_commands, function(value){
				if(value.command === name){
					return value;
				}
			})
		}

		var init = function(){
			process.argv.forEach(function (val, index, argumentList) {

				if(Mold.startsWith(val, '-mold-param=')){

					var input = val.replace("-mold-param=", ""),
						inputParams = input.split(","),
						params = {},
						name = '',
						values = [],
						command = Mold.trim(inputParams[0]);

					inputParams.forEach(function(paramValue , index){

						if(index > 0){
							var value = Mold.trim(paramValue);
							
							if(Mold.startsWith(value, "-")){
								if(name){
									params[name] = values.join(" ");
									values = [];
								}
								name = value.substring(1, value.length);
								if(Mold.contains(name, '=')){
									var parts = name.split("=");
									name = Mold.trim(parts[0]);
									if(parts[1]){
										values.push(Mold.trim(parts[1]));
									}
								}
							}else{
								if(name && Mold.trim(value) !== "="){
									value = value.replace("=", "");
									values.push(Mold.trim(value));
								}
							}
						}
					});

					if(name){
						params[name] = values.join(" ");
					}

					_that.trigger('command', { command : command, parameter : params})
				}
			});
		}


		var _showError = function(error){
			console.log("\033[0;31m" + error + "\033[0m")
		}

		var _getCommandHelp = function(commandObject){
			var help = "\nMold command help '\033[1;35m" + commandObject.command + "\033[0m'\n";
			
			if(commandObject.description){
				help += commandObject.description + "\n";
			}

			help += "\n";

			Mold.each(commandObject.parameter, function(value, index){
				help += " \033[0;36m" + index + "\033[0m  \t" + value.description + "\n";
			});
			console.log(help + "\n")
		}


		_that.on('command', function(e){
			var commandObject = _getCommand(e.data.command);

			if(!commandObject){
				_showError("command '" + e.data.command + "' not found!");
				return;
			}

			if(Mold.is(e.data.parameter.help)){
				_getCommandHelp(commandObject);
				return;
			}

			commandObject.execute.call(Mold, e.data.parameter);
			//console.log("e", e.data.command, e.data.parameter)
		})

		setTimeout(function(){
			Mold.load({ name : "Mold.CLI.*"}).bind(function(){
				init();
			});
		}, 10);

		return {
			/**
			 * @method addCommand
			 * @description adds a new CLI Command to Mold
			 * @param {object} [command] an object with the command
			 * @example
				{
					command : 'name of the command',
					parameter : {
						'-name' : {
							'description' : 'description value',
						}
					},
					execute : function(parameter){
						
					}
				}
		
			 */
			addCommand : function(command){
				_commands.push(command);
			},

			/**
			 * @method showError
			 * @description shows an errormessage
			 * @param  {string} error a string with a message
			 */
			showError : function(error){
				_showError(error);
			},
			showMessage : function(message){
				console.log(message)
			}
		}
	}
)