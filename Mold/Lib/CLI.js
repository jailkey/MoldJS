

Seed({
		name : "Mold.Lib.CLI",
		dna : "static",
		platform : 'node',
		include : [
			'Mold.Lib.Event',
			{ Promise : 'Mold.Lib.Promise' }
		]
	},
	function(){

		if(!Mold.isNodeJS){
			throw Error("You can use Mold.Lib.CLI only with NodeJS!");
		}


		var _that = this,
			_commands = [];

		process.stdin.setEncoding('utf8');
			
		Mold.mixin(this, new Mold.Lib.Event(this));


		//CLI interface
		var cliInterface = {
		/**
		 * @method showError
		 * @description shows an errormessage
		 * @param  {string} error a string with a message
		 */
			showError : function(error){
				console.log(this.COLOR_RED + error + this.COLOR_RESET)
			},
			warn : this.showError,
		/**
		 * @method write 
		 * @description show message 
		 * @param  {string} message [description]
		 * @return {[type]}         [description]
		 */
			write : function(message){
				process.stdout.write(message)
				return this;
			},
		/**
		 * @method read
		 * @description read standard in
		 * @param  {Function} callback will be executed if the user press Enter
		 * @return {object} this
		 */
			read : function(callback){
				
				process.stdin.on('data', function(chunk) {
					var buf = new Buffer(chunk);
					callback(buf.toString());
				});

				return this;
			},
			form : function(form){
				/*
				{
					label : "Hallo sag was:",
					input : {
						type : 'text',
						validate : 'required',
						messages : {
							error : "Is not valid!",
							success : "Supi!"
						}
					}
				}*/
			},
			key : function(){

			},
			exit : function(){
				process.exit(0);
				return this;
			},
			COLOR_RESET : "\033[0m",
			COLOR_BLACK : "\033[0;30m",
			COLOR_RED : "\033[0;31m",
			COLOR_GREEN : "\033[0;32m",
			COLOR_YELLOW : "\033[0;33m",
			COLOR_BLUE : "\033[0;34m",
			COLOR_PURPLE : "\033[0;35m",
			COLOR_CYAN : "\033[0;36m",
			COLOR_WHITE : "\033[0;37m",
			SYMBOLE_TRUE : "✓",
			SYMBOLE_FALSE : "✗"
		}

		//CLI private methodes
		var _getCommand = function(name){
			return Mold.find(_commands, function(value){
				if(value.command === name){
					return value;
				}
			})
		}

		var init = function(){

			var params = {},
				name = '',
				values = [],
				commadPos = 2;

			process.argv.forEach(function (val, index, argumentList) {
				
				if(val === "-seed" || val === "-repo" | val === "-extrepo"){
					commadPos += 2;
				}

				if(index >= commadPos){

					if(index === commadPos){
						command = Mold.trim(val);
					}
				
					var value = Mold.trim(val);
					
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

					if(name){
						params[name] = values.join(" ");
					}
				}
			});
			_that.trigger('command', { command : command, parameter : params})
		}


		var _getCommandHelp = function(commandObject){
			var help = "\nMold command help '\033[1;35m" + commandObject.command + "\033[0m'\n";
			
			if(commandObject.description){
				help += commandObject.description + "\n";
			}

			help += "\n";

			Mold.each(commandObject.parameter, function(value, index){
				help += cliInterface.COLOR_CYAN + index + cliInterface.COLOR_RESET +"  \t" + value.description + "\n";
			});
			console.log(help + "\n")
		}


		_that.on('command', function(e){
			var commandObject = _getCommand(e.data.command);

			if(!commandObject){
				cliInterface.showError("command '" + e.data.command + "' not found!");
				return;
			}

			if(Mold.is(e.data.parameter.help)){
				_getCommandHelp(commandObject);
				return;
			}

			commandObject.execute.call(Mold, e.data.parameter, cliInterface);
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
				_commands.push(command, this);
			}
		}
	}
)