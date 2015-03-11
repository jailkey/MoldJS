

Seed({
		name : "Mold.Lib.CLI",
		dna : "static",
		platform : 'node',
		include : [
			'Mold.Lib.Event',
			'Mold.Tools.CLIForm',
			{ Promise : 'Mold.Lib.Promise' }
		]
	},
	function(){

		if(!Mold.isNodeJS){
			throw Error("You can use Mold.Lib.CLI only with NodeJS!");
		}


		var _that = this,
			_commands = [],
			readline = require('readline'),
			fs = require("fs"),
			_reader = false,
			_readerMethod = false;

		process.stdin.setEncoding('utf8');
			
		Mold.mixin(this, new Mold.Lib.Event(this));

		var _initReader = function(onclose, completer){
			if(_reader){
				_reader.close();
			}
			_reader = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
				completer : completer,
			});
			
			return _reader;
		}



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
			read : function(question, callback, completer){
				
				question = question || "";
				var reader = _initReader(function(){
					//console.log("on close")
				}, completer)

				reader.question(question, function(data){
					callback(data, reader)

				})
				
				return this;
			},
		/**
		 * @method  createForm 
		 * @description creates a cli form
		 * @param  {array} fields an array with the field definition
		 * @return {object}  returns an instace of Mold.Tool.CLIForm
		 * @description 
		 *
	     *	[{
		 *    	label : "some question?:",
		 *     	input : {
		 *      	name : 'path',
		 *       	type : 'filesystem',
		 *        	validate : 'required',
		 *         	messages : {
		 *          	error : "Is not valid!",
		 *           	success : function(data){
		 *           		if(data === 1){
		 *           			return "yuhu one!"
		 *           		}
		 *           	}
		 *          }
		 *      }
		 *   }]
		 */
			createForm : function(fields){
				return  new Mold.Tools.CLIForm(this, fields);
			},
		/**
		 * @method  exit
		 * @description exits the cli
		 * @return {[type]} [description]
		 */
			exit : function(){
				process.exit(0);
				return this;
			},
		/**
		 * complete
		 * @description a set off auto complete functions
		 * @type {Object}
		 */
			completer : {
				default : function(line){
					return [[], line];
				},
				yesno :  function(line){
					var completions = ['yes', 'no'];
					var hits = completions.filter(function(c) { return c.indexOf(line) == 0 });

  					return [hits.length ? hits : completions, line]
				},
				filesystem : function(line){
					line = Mold.trim(line);
					if(line !== ""){

						var path = Mold.trim(line.substr(0, line.lastIndexOf("/"))),
							lineParts = line.split("/"),
							searchString = lineParts[lineParts.length -1],
							searchPath = path,
							hits = [];

						if(!Mold.startsWith(line, "/")){
							searchPath = process.cwd() + "/" + path;
						}else{
							searchPath = "/" + path;
						}
						if(fs.existsSync(searchPath)){
							var result = fs.readdirSync(searchPath);
							hits = result.filter(function(entry) {  
								return Mold.startsWith(entry, searchString) 
							});

							if(Mold.startsWith(line, "/")){
								Mold.each(hits, function(value, index){
									hits[index] = "/" + value;
								});
							}
							
							if(path != "" ){
								Mold.each(hits, function(value, index){
									if(Mold.endsWith(path, "/") || Mold.startsWith(value, "/")){
										hits[index] = path + value;
									}else{
										hits[index] = path + "/" + value;
									}
								})
							}
							if(!hits.length){
								hits = result;
							}
						}
						
						return  [hits, line];
					}else{
						return  [[], line];
					}
				}
			},
		/**
		 * @method  addCompleter
		 * @description adds a custome completer
		 * @param {string}   name of the completer
		 * @param {Function} callback completer function
		 */
			addCompleter : function(name, callback){
				this.completer[name] = callback;
			},
		/**
		 * @description colors and symboles you could use to format your cli output
		 * @type {String}
		 */
			COLOR_RESET : "\u001b[39m", //"\033[0m",
			COLOR_BLACK : "\033[0;30m",
			COLOR_RED : "\u001b[31m",//"\033[0;31m",
			COLOR_GREEN : "\u001b[32m",
			COLOR_YELLOW : "\033[0;33m",
			COLOR_BLUE : "\033[0;34m",
			COLOR_PURPLE : "\033[0;35m",
			COLOR_CYAN : "\u001b[36m",//"\033[0;36m",
			COLOR_WHITE : "\033[0;37m",
			SYMBOLE_TRUE : "\u001b[32m" + "✓" + "\u001b[39m",
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
				command = false,
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
			if(command){
				_that.trigger('command', { command : command, parameter : params})
			}
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

		var fileSystem = require('fs');

		setTimeout(function(){
			Mold.load({ name : "->Mold.CLI.*"}).bind(function(){
			
				if(fileSystem.existsSync(Mold.LOCAL_REPOSITORY + "Mold/CLI/*.js")){
					Mold.load({ name : "Mold.CLI.*"}).bind(function(){
						init();
					});
				}else{
					init();
				}
			});
		}, 10);

		return {
		/**
		 * @method executeCommand
		 * @description excute the specified command
		 * @param  {string} command   the command
		 * @param  {object} parameter command parameter
		 */
			executeCommand : function(command, parameter){

				var commandObject = _getCommand(command);

				if(!commandObject){
					cliInterface.showError("command '" + command + "' not found!");
					return;
				}

				if(Mold.is(parameter.help)){
					_getCommandHelp(commandObject);
					return;
				}
		
				return commandObject.execute.call(Mold.getScope(), parameter, cliInterface);
			},
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
				execute : function(parameter, cli){
					
				}
			}
	
		 */
			addCommand : function(command){
				_commands.push(command, this);
			}
		}
	}
)