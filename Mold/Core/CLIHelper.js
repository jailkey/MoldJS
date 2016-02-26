//!info transpiled
/**
 * @module Mold.Core.ClIHelper
 * @description static object provides methods to handle the command line interface
 */
Seed({
		type : "static",
		platform : 'node',
		include : [
			{ Promise : "Mold.Core.Promise" }
		]
	},
	function(){

		return {
		/**
		 * @method showError
		 * @description shows an errormessage
		 * @param  {string} error a string with a message
		 */
			error : function(error){
				console.log(this.COLOR_RED + error + this.COLOR_RESET)
			},
			warn : this.error,
			fail : this.error,
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

			lb : function(){
				process.stdout.write('\n')
				return this;
			},
		/**
		 * @method ok 
		 * @description show ok message 
		 * @param  {string} message [description]
		 * @return {[type]}         [description]
		 */
			ok : function(message){
				process.stdout.write(this.COLOR_GREEN + message + this.COLOR_RESET)
				return this;
			},

			info : function(message){
				process.stdout.write(this.COLOR_CYAN + message + this.COLOR_RESET)
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

			scrollRight : function(str, time){
				var that = this;
				var time = time || 20;
				return new Promise(function(resolve){
					var next = function(count){
						var count = count || 0;
						var current = str[count];
						that.write(current);
						if(str.length > count + 1){
							setTimeout(function(){ next(++count) }, time);
						}else{
							resolve();
						}

					}
					next(0)
				});
			},

			sprites :  function(){
				var that = this;
				var cQ = this.COLOR_RED + "◼" + this.COLOR_RESET;

				return {

					quat : [
						cQ + " ▭ ▭ ▭ ▭ ▭ ▭ ▭ ▭",
						"▭ " + cQ + " ▭ ▭ ▭ ▭ ▭ ▭ ▭",
						"▭ ▭ " + cQ + " ▭ ▭ ▭ ▭ ▭ ▭",
						"▭ ▭ ▭ " + cQ + " ▭ ▭ ▭ ▭ ▭",
						"▭ ▭ ▭ ▭ " + cQ + " ▭ ▭ ▭ ▭",
						"▭ ▭ ▭ ▭ ▭ " + cQ + " ▭ ▭ ▭",
						"▭ ▭ ▭ ▭ ▭ ▭ " + cQ + " ▭ ▭",
						"▭ ▭ ▭ ▭ ▭ ▭ ▭ " + cQ + " ▭",
						"▭ ▭ ▭ ▭ ▭ ▭ ▭ ▭ " + cQ,
					]
				}
				
				
			},

			loadingBar : function(text, time){
				var stop = false;
				var time = time || 100;
				var sprite = this.sprites().quat;

				var next = function(count){
					if(stop){
						return;
					}

					count = (sprite.length === count) ? 0 : count;
					process.stdout.cursorTo(0);
					process.stdout.write(sprite[count] + "   " + text);
					setTimeout(function(){ next(++count) }, time);
				}

				next(0);

				return {
					stop : function(){
						//process.stdout.clearLine();
						process.stdout.cursorTo(0);
						process.stdout.write(sprite[0] + "   " + text);
						process.stdout.write("\n");
						stop = true;
					}
				}
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
			SYMBOLE_FALSE : "✗",
			SYMBOLE_ARROW_RIGHT : "▹",
			SYMBOLE_STAR : "★"
		}
		
	}
)