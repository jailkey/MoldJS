/**
 
	/'\_/`\       (_ )     ( )
	|     |   _    | |    _| |
	| (_) | /'_`\  | |  /'_` |
	| | | |( (_) ) | | ( (_| |
	(_) (_)`\___/'(___)`\__,_)
	structure and pattern framework

 * @author Jan Kaufmann <jan@moldjs.de>
 * @version 0.1.4;
 *
 *
 */
 "use strict";
var Mold = (function(config){

	var _config = (config) ? config :  "CONFIG FAILED",
		_Mold = {},
		_targetWrapper = {},
		_cue = {},
		_createdMold = {},
		_externalRepository = false,
		_repositoryName = "Mold",
		_repository = false,
		_externalSeeds = {},
		_inProzess = {},
		_isDom = false,
		_pathes = {},
		undefined;
	
	//test if Mold run in browser or not
	try {
		var _isNodeJS = (!!window) ? false : true ;
	}catch(e){
		var _isNodeJS = true;
	}


	if(!_isNodeJS){
		var _documentHead = document.getElementsByTagName("head")[0];
	}

	//returns the global scope
	var _getRootObject = function(){		
		var rootObject = (_isNodeJS) ? global : window;
		return rootObject;
	}
	
	//creates the specified namespace
	var _createTarget = function(targets){
		var path = targets;
		var chain = _getRootObject();
		Mold.each(path, function(element){
			if( typeof chain[element] === "undefined" ){
				chain[element] = {}
			}
			chain = chain[element];
		});
		return chain;
	};
	
	//returns the seed name from the given sees path
	var _getTargetName = function(seed){
		return seed.name.substring(seed.name.lastIndexOf(".")+1, seed.name.length);
	};
	
	var _getSeedChain = function( target ){

		var path = target.split(".");
		var chain = _getRootObject();
		Mold.each(path, function(element){
			if( typeof chain[element] === "undefined" ){
				return false;
			}else{
				chain = chain[element];
			}
		});	
		return chain;
	};
	
	var _getSeedChainName = function(seed){
		return seed.name.substring(0, seed.name.lastIndexOf("."));
	};
	
	var _isSeedAdded = function(target){
		
		var cleanedName = Mold.cleanSeedName(target);
		return ( _createdMold[ cleanedName ] ) ? true : false;
	};
	
	var _onlySubSeeds = function(seedList){
		var output = true;
		Mold.each(seedList, function(seed){
			if(typeof seed === "string" && !_isSeedAdded(seed)){
				output = false;
				return Mold.EXIT;
			}
		});

		return output;
	}
	
	var _areSeedsAdded = function(included){
		
		var output = true;

		Mold.each(included, function(value){
			var seedName = Mold.cleanSeedName(value);
			if(! _isSeedAdded(seedName)){
				output =  false;
				return Mold.EXIT;
			}
		});

		return output;
	};

	var _getImports = function(seedList){
		var imports = [];
		if(typeof seedList === "string"){
			return imports;
		}
		Mold.each(seedList, function(seed){
			if(Mold.isArray(seed)){
				imports = imports.concat(_getImports(seed));
			}else if(Mold.isObject(seed)){
				imports.push(seed);
			}
		});
		return imports
	}

	var _removeImports = function(seedList){
		var newList = [];
		if(typeof seedList === "string"){
			return seedList;
		}
		Mold.each(seedList, function(entry, key){
			if(Mold.isArray(entry)){
				newList.push(_removeImports(entry));
			}else if(Mold.isObject(entry)){
				Mold.each(entry, function(value){
					newList.push(value)
				});
			}else{
				newList.push(entry);
			}
		});

		return newList;
	}
	
	var _loader = function(name){
		
		var _name = name,
			_actions = [],
			_onerror = [],
			_isLoaded = false;
		
		this.bind = function ( callback ){
			if(!_isLoaded){
				_actions.push(callback);
			}else{
				
				callback.call(this, name);
			}
			return this;
		};
		
		this.loaded = function(){
			var newactions = [];
			Mold.each(_actions, function(element){
				if( typeof element === "function" ){
					element.call(this, name);
				}else{
					newactions.push(element);
				}
			})
			
			_actions = newactions;
			_isLoaded = true;
		}
		
		this.name = function(){
			return _name;
		}
	};
	
	var _addElementEvent = function(element, event, callback){
		if(element.attachEvent){
			element.attachEvent("on"+event, callback);
		}else if(element.addEventListener) {
			element.addEventListener(event, callback, false);
		}
	}
	
	var _ready = function(callback){
		if(!_isDom && !_isNodeJS){
			_addElementEvent(window, "load", callback);
		}else{
			callback();
		}
	};
	
	var _getMainScript = function(){
		if(_isNodeJS){
			var output = false;
			process.argv.forEach(function (val, index, argumentList) {

				if(val === "-repo"){
					if(argumentList[index+1]){

						_config.localRepository = argumentList[index+1];
					}else{
						throw new Error("You can not use -repro without repositiory path!");
					}
				}
				if(val === "-extrepo"){
					if(argumentList[index+1]){
						_config.externalRepository = argumentList[index+1]
					}else{
						throw new Error("You can not use -extrepo without repositiory path!");
					}
				}
				if(val === "-seed"){
					
					if(argumentList[index+1]){
						output = argumentList[index+1]
					}else{
						throw new Error("Main seed is not defined!");
					}	
				}

			});
			if(!_config.externalRepository){
				_config.externalRepository =  __dirname  + "/";
			}
			if(!_config.localRepository){
				_config.localRepository =  __dirname  + "/";
			}

			if(Mold){
				Mold.EXTERNAL_REPOSITORY = _config.externalRepository;
				Mold.LOCAL_REPOSITORY = _config.localRepository;
			}
			return output;
		}else{

			var i = 0,
				mainScript = false,
				repositiory = false,
				scripts = document.getElementsByTagName("script");

			if((mainScript = Mold.find(scripts, function(script){
				if(script.getAttribute("data-mold-main") || script.getAttribute("src") && script.getAttribute("src").indexOf("Mold.js") > -1){
					_config.repositoryName  = script.getAttribute("data-mold-repository-name") || "Mold";
					_config.externalRepository =  script.getAttribute("data-mold-external-repository");
					_config.localRepository = script.getAttribute("data-mold-repository");
					_config.cacheOff = (script.getAttribute("data-mold-cache") === "off") ? true : false;
					_config.debug = (script.getAttribute("data-mold-debug") === "on") ? true : false;
					if(Mold){
						Mold.EXTERNAL_REPOSITORY = _config.externalRepository;
						Mold.LOCAL_REPOSITORY = _config.localRepository;
					}
					if(_config.debug ){
						Mold.log("Info", "-RUN DEBUG MODE-")
					}
					return true;
				}else{
					return false;
				}
				
			}))){
				return mainScript.getAttribute("data-mold-main");
			};
			
		}
		return false;
	}


	var _loadSubSeeds = function(seedList, seedName){
		if(_onlySubSeeds(seedList)){
			var subSeedList = [];
			Mold.each(seedList, function(entry){
				if(Mold.isArray(entry)){
					Mold.each(entry, function(subEntry){
						subSeedList.push(subEntry);
					});
				}
			});
			Mold.each(subSeedList, function(subElement){
				if(Mold.isArray(subElement)){
					_loadSubSeeds(subSeedList, seedName);
				}else{
					if(!_Mold[subElement]){

						Mold.load({ name : subElement, isExternal : _externalSeeds[seedName] || false });
					}
				}
			});
			return subSeedList;
		}
		return seedList;
	}

	var _postProcess = function(createdSeed, rawSeed){
		Mold.each(Mold.cue.getType("postprocessor"), function(value){
			var output = value.call(this, createdSeed, rawSeed);
			if(output){
				createdSeed = output;
			}
		});
		return createdSeed;
	}
	var _createed = 0;
	
	var _createCompiledSeed = function(name, codeString, onComplete){

		Mold.compiledSeeds = Mold.compiledSeeds || {};
		codeString = "Mold.compiledSeeds['"+name+"'] = "+codeString+' \n';
		
		var scriptElement = document.createElement('script');
	  	scriptElement.type = 'text/javascript';
	  	scriptElement.src  = 'data:text/javascript;charset=utf-8,'+encodeURIComponent(codeString);
	  	scriptElement.name = name.split("/", ".");
	  	document.getElementsByTagName('head')[0].appendChild(scriptElement);
	  	
	  	_addElementEvent(scriptElement, 'load', function(){
	  		if(!scriptElement.isLoaded){
	  			onComplete.call(null, Mold.compiledSeeds[name]);
	  			scriptElement.isLoaded = true;

	  		}
	  		_createed++
	  	});
	  	
	  	return Mold.compiledSeeds[name];
	}

	var _preProcess = function(input, seedName, dna, callback){
		if(typeof input === "function"){
			if(_isNodeJS){
				//inject scope if Mold run under NodeJs
				input = Mold.injectBefore(input, " Mold.mixin(this, Mold.getScope()); ");
			}
	
			//convert code to string
			var code = input.toString(),
				scriptName = seedName.split('.').join('/')+'.js';
			
			//delete unnecessary stuff 
			code = code.substring(0, code.lastIndexOf("}")+1);
			code = code.replace("anonymous", "");

			//split function into parameter an code
			var pattern = new RegExp("function\\s*\(([\\s\\S]*?)\)\\s*\{([\\s\\S]*?)\}$", "g"),
				matches = pattern.exec(code);

			

			if(matches){
				//replace comments
				var parameter = matches[2].replace("(", "").replace(")", "").replace("\n", "").replace("/*", "").replace("*/", ""),
					objectEnd = matches[3];

				if(objectEnd){
					
					var outputCode = objectEnd;
					outputCode = "//# sourceURL="+scriptName+"\n" + outputCode;
					Mold.each(Mold.cue.getType("seedprocessor"), function(value){
						outputCode = value.call(this, outputCode);
					});
					if(dna){
						Mold.each(Mold.cue.getType("seedprocessor_"+dna), function(value){
							outputCode = value.call(this, outputCode);
						});
					}
					Mold.each(Mold.cue.getType("seedprocessor_"+seedName), function(value){
						outputCode = value.call(this, outputCode);
					});
				
					if(_config.debug){
						var codeString = 'function('+((parameter.join) ? parameter.join(',') : parameter)+') {' + outputCode + ' }';
						_createCompiledSeed(scriptName, codeString, callback);
					}else{
						callback.call(this, new Function(parameter, outputCode))
					}
					
				}else{
					//! can't parse function
					return callback.call(null, input);
				}
			}
		}else{
			//! preparse only functions
			return callback.call(null, input);
		}
		
	}

	
	if(!_isNodeJS){

		_ready(function(){
			_isDom = true;
			var mainScript = _getMainScript();
			if(mainScript){
				Mold.load({ name : mainScript });
			}
		});
	}

	var _seedLoadingCounter = 0;
	
	return {

		EXTERNAL_REPOSITORY : _config.externalRepository,
		LOCAL_REPOSITORY : config.localRepository,
		EXIT : '--exitoperation--',
		SEED_STATUS_LOADED : '--dependencies-loaded--',
		SEED_STATUS_PREPROZESSING : '--preprozessing--',
		seedList  : [],
		stopExecution : false,

/**
* @namespace Mold
* @methode trim
* @public
* @param (String) phrase - string with leading and ending whitespaces
* @retrun (String) - returns a String without leading and ending whitespaces
*/

		trim : function(phrase){
			if(Mold.is(phrase)){
				phrase = phrase.replace(/\n*/gm, "");
				phrase = phrase.replace(/^\s+|\s+$/g, "");
			}
			return phrase;
		},

		startsWith : function(phrase, search){
			return phrase.slice(0, search.length) === search;
		},

		endsWith : function(phrase, search){
			return phrase.slice(phrase.length - search.length) === search;
		},

/**FUNCTIONAL METHODES ***/

/**
* @namespace Mold
* @method each
* @desc iterates through an List (Object, Array)
* @public
* @return (Boolean) 
* @param (Object) collection - the list
* @param (function) iterator - a callback function
* @param (object) context - optional context Object
**/
		each : function(collection, iterator, context){
			var i = 0;
			if(collection == null || collection === false) { return false; }

			if(Array.prototype.forEach && collection.forEach){

				collection.forEach(iterator, context);

			}else if(Mold.isArray(collection)){
			
				var len = collection.length;

				for (; i < len; i++) {
				 	if(iterator.call(context, collection[i], i, collection) === Mold.EXIT) {
				 		return true;
				 	};
				}

			}else {

				var keys = Mold.keys(collection),
					len = keys.length;
				
				for(; i < len; i++){
					if(!(Mold.isNodeList(collection) && keys[i] === "length")){
						if(
							Mold.is(collection[keys[i]]) 
							&& iterator.call(context, collection[keys[i]], keys[i], collection) === Mold.EXIT
						){
							return true;
						}
					}
				}
			}
			return true;
		},
/**
 * @namespace Mold
 * @method eachShift
 * @description iterates through an array and remove the selected item until the array is empty
 * @param  {array}   collection the array
 * @param  {function} callback  method will called on each entry, given paramter is the entry value           
 */
	eachShift : function(collection, callback){
		if(!collection){
			return false;
		}
		while(collection.length){
			var selected = collection.shift();
			callback.call(this, selected);
		}
	},

/**
* @namespace Mold
* @methode find
* @desc find a specified value in an array
* @public
* @return (mixed) 
* @param (Object) collection - the list
* @param (function) iterator - a callback function
* @param (object) context - context Object
**/
		find : function(collection, iterator, context){
			var result = false;
			Mold.some(collection, function(value, index, list) {
				if (iterator.call(context, value, index, list)) {
					result = value;
					return true;
				}
			});
			return result;
		},

/**
* @namespace Mold
* @methode some
* @desc iterates through an array until the specified callback returns false
* @public
* @return (boolean) returns true if the callback function returns true for each element, otherwise it returns false; 
* @param (Object) collection - the list
* @param (function) iterator - a callback function
* @param (object) context - context Object
**/
		some : function(collection, iterator, context){
			var result = false;
			if (collection == null) {
				return result;
			}
			if (Array.prototype.some && collection.some){
				return collection.some(iterator, context);
			}
			Mold.each(collection, function(value, index, list) {
				if (result || (result = iterator.call(context, value, index, list))) { 
					return Mold.EXIT;
				}
			});

			return result;
		},


		filter : function(collection, iterator, context){
			if(Array.prototype.filter){
				return collection.filter(iterator);
			}
			var result = [];
			Mold.each(collection, function(value, index){
				if(iterator.call(context, value, index)){
					result.push(value);
				}
			});
			return result;
		},
/**
 * @namespace Mold
 * @methode reject
 * @public
 * @description compares all values in an array
 * @param (array) collection an array to compare
 * @param (function) iterator callback that wich is executet on every entry
 * @returns (array) returns a new list of values 
 */

		reject : function(collection, iterator, context){
			if(!Mold.isArray(collection)){
				throw "Mold.reject works only with arrays!"
			}
			if(collection.length === 1){
				return collection;
			}
			var result = [];		
			context = context || null;
			Mold.eachShift(collection, function(firstElement, firstIndex){
				var add = true;
				Mold.each(collection, function(secondElement, secondeIndex){
					if(
						!iterator.call(
							context,
							firstElement,
							secondElement,
							firstIndex,
							secondeIndex,
							result
						)
					){
						add = false;
					}
				});
				if(add){
					result.push(firstElement);
				}
			})
			return result;
		},

/**
* @namespace Mold
* @methode keys
* @desc returns an Array with the key of an object
* @public
* @return (Array)
* @param (Object) collection - Expects an object 
**/
		keys :  function(collection){
			if(Object.keys){
				return Object.keys(collection);
			}else{
				var keys = [];
				for(var key in collection){
					keys.push(key);
				}
				return keys
			}
		},
		


/** TEST METHODS **/

/**
 * @namespace Mold
 * @method  contains
 * @description checks if a list contains a value
 * @public
 * @param  {array/object/sting} list  
 * @param  {stirng} needel
 * @return {boolean} 
 */
		contains : function(list, needel){
			if(typeof list === 'string'){
				return ~list.indexOf(needel);
			}
			return !!Mold.find(list, function(element){
				if(element == needel){
					return true;
				}
				return false;
			})
		},

/**
 * @namespace Mold
 * @method is
 * @description test if a variable is defined
 * @param  {mixed}  value 
 * @return {Boolean}       
 */
		is : function(value){
			if(
				value === undefined 
				&& value !== false
				&& value !== 0
				&& value !== ''
			){
				return false;
			}else{
				return true;
			}
		},

/**
* @namespace Mold
* @methode isArray
* @desc checks if the give value is an array
* @public
* @return (Boolean) 
* @param (Object) collection - the value
**/
		isArray : function(collection){
			if(Array.isArray){
				return Array.isArray(collection);
			}
			if(Object.prototype.toString.call(collection) === "[object Array]"){
				return true;
			}
			return false;
		},

/**
* @namespace Mold
* @methode isObject
* @desc checks if the give value is an object
* @public
* @return (Boolean) 
* @param (Object) collection - the value
**/
		isObject : function(collection){
			if(Object.prototype.toString.call(collection) === "[object Object]"){
				return true;
			}
			return false;
		},

/**
* @namespace Mold
* @methode isNodeList
* @desc checks if the give value is a NodeListe
* @public
* @return (Boolean) 
* @param (Object) collection - the value
**/
		isNodeList : function(collection){
			if(
				Object.prototype.toString.call(collection) === "[object NodeList]"
				||  Object.prototype.toString.call(collection) === "[object HTMLCollection]"
			){
				return true;
			}
			return false;
		},

		isNode : function(element){
			
			if(_isNodeJS) { return false; }
			if(!element) { return false; }
			
			if(element === window){ return true }

			return(
				(typeof element === "object") 
				? element instanceof Node 
				: (
					element 
					&& typeof element === "object" 
					&& typeof element.nodeType === "number"
					&& typeof element.nodeName === "string"
				)
			)
				
		},



		getMainScript : _getMainScript,
/**
* @namespace Mold
* @property isNodeJS
* @desc Contains true if Mold.js runs on the Server under Nods.js, otherwith it contains false
* @public
* @return (Boolean)
**/
		isNodeJS : _isNodeJS,
/**
* @namespace Mold
* @methode ready
* @desc	Fires if the dom is ready
* @public
* @param (readyCallback) callback - Expected a callback, fires if the dom and Mold.js is ready
**/
		ready : function(callback){
			_ready(callback);
		},


/**
* @namespace Mold
* @property startime
* @desc	inculdes the time, when Mold is constructed, you can use it to measure Molds loadingtime
* @public
**/
		startime : new Date().getTime(),
/**
* @namespace Mold
* @callback readyCallback
*/	
		
/**
* @namespace Mold
* @methode addDNA
* @desc Add a DNA pattern to Mold.js
* @public
* @param (Object) dna Expected an object of type DNA
**/
		addDNA : function(dna){
			if(dna.dnaInit){
				dna.dnaInit();
			}
			Mold.cue.add("dna", dna.name, dna);
		},
/**
* @namespace Mold
* @methode getDNA
* @desc Returns a DNA pattern from the specified name
* @param dnaName Expected the name of the pattern
* @return (Object|False) If successful it returns an object of type DNA, if not it return false
**/
		getDNA : function(dnaName){
			var dna = Mold.cue.get("dna", dnaName);
			if(dna){
				return dna;
			}else{
				throw new Error("DNA-handler "+dnaName+" not found!");
				return false;
			}
		},
		
		getDNABySeedName : function(seedName){
			return Mold.getDNA(_createdMold[seedName].dna);
		},
		
/**
* @namespace Mold
* @object 
* @name cue
* @desc Include methodes to add, delete and manipulate a cues
* @values add, remove, get, getType, removeType
**/
		cue : {
/**
* @namespace Mold.cue
* @methode add
* @desc Adds a value to an specified cue
* @param (String) type Expects the name of the cue  
* @param (String) name Expects the name of the entry
* @param (Mixing) value Expects the value
**/
			add : function(type, name, value){
				_cue[type] = (_cue[type]) ? _cue[type] : {};
				_cue[type][name] = value;
			},
			
/**
* @namespace Mold.cue
* @methode remove
* @desc Removes an entry from the specified cue
* @param (String) type Expects the name of the cue  
* @param (String) name Expects the name of the entry 
*/
			remove: function(type, name){
				delete _cue[type][name]
			},
/**
* @namespace Mold.cue
* @methode get
* @desc Returns a specified cue value
* @param (String) type Expects the name of the cue  
* @param (String) name Expects the name of the entry 
* @return (Mixing|false) If successful it returns the cue value, if not it returns false
**/
			get: function(type, name){
				return (_cue[type]) ? _cue[type][name] : false;
			},
/**
* @namespace Mold.cue
* @methode getType
* @desc Returns a specified cue object
* @param (String) type Expects the name of the cue  
* @return (Object|False) if successful it returns the a cue object, if not it returns false
**/

			getType : function(type){
				return _cue[type];
			},
/**
* @namespace Mold.cue
* @methode removeType
* @desc Deletes a specified cue
* @param (String) name - Expects the name of the entry, to be deleted
**/
			removeType : function(type){
				delete _cue[type];
			}
		},
/**
* @namespace Mold
* @methode log
* @desc Logs an entry
* @param (String) type - Expects the entry type of the logmessage. Predefined values are "Error", "Info" and "Debug", but you can define your own, if necessary.
* @param (String|Object) message  - Expects the message that will be logged, when the type is "Error" the parameter expects an object with the property "code". This property contains the errorcode.
* @fires Mold#onlog
**/
		log : function(type, message){
			Mold.cue.add("logmessages", message.code, message);
			var onlog = Mold.cue.getType("onlog");
			var isAction = false;
			
			Mold.each(onlog, function(logaction){
				logaction(type, message);
				isAction = true;
			});
		
			if(isAction){
				Mold.cue.removeType("logmessages");
			}
			
		},
/**
* @methode onlog
* @desc Fires if a Message wil be logged
* @param (onlogCallback) callback - Expects a callback to be fired if a message will be logged
**/
		onlog : function(callback){
			var identifier = (Mold.cue.get("onlog")) ? "onlog" + Mold.cue.get("onlog").length : "onlog" + 0;
			Mold.cue.add("onlog", identifier, callback);
		},
/**
 * @methode getScope
 * @description returns an object with the current scope
 * @return {object} the current scope
 */
		getScope : function(){
			if(_isNodeJS){
				return {
					require : require,
					global : global,
					__filename : __filename,
					__dirname : __dirname,
					module : module,
					exports : exports,
					Buffer : Buffer,
					setTimeout : setTimeout,
					clearTimeout : clearTimeout,
					setInterval : setInterval,
					clearInterval : clearInterval
				}
			}
			return this;
		},
/**
 * This callback is displayed as part of the Requester class.
 * @callback onlogCallback
 * @param {String} type The type of the logmessage, default it can be "Error", "Info", or "Debug"
 * @param {String|Object} message The errormessage, if the logtype is "Error" it will be an object 
 */


 		addPreProcessor: function(name, callback){
 			Mold.cue.add("seedprocessor", name, callback);
 		},

 		addPostProcessor: function(name, callback){
 			Mold.cue.add("postprocessor", name, callback);
 		},

/**
* @methode addLoadingProperty
* @desc Tells Mold.js which properties of a Seed are "loading properties". These properties include a reference to other seeds. This method will be used to build new DNA.
* @param (String) propertyName - The name of the property to be added.
**/
		addLoadingProperty : function(propertyName){
			Mold.cue.add("loadingproperty", propertyName, propertyName);
		},
/**
* @methode getLoadingproperties
* @desc Returns a list of all "loading properties"
* @return (Array) - A list of all "loading properties"
**/
		getLoadingproperties : function(){
			return Mold.cue.getType("loadingproperty");
		},
/**
* @methode getSeed
* @desc Returns a seed specified by name
* @param (String) name - Expects the name of the seed (seed chain)
* @return (Object) - The seed
**/
		getSeed : function(name){
			return _getSeedChain(name);
		},

		getRawSeed : function(name){
			return _createdMold[name];
		},
/**
* @methode getSeedChainName
* @desc Returns the seed chain from the seed object without the root object
* @param (Object) seed - Expects a seed object
* @return (String) - A String with the seed chain
**/
		getSeedChainName : function(seed){
			return _getSeedChainName(seed);
		},
/**
* @methode getTargetName
* @desc Returns the name of the root object of a Seed
* @param (Object) seed - Expects a seed object
* @return (String) - The Name of the seed root object
**/
		getTargetName : function(seed){
			return _getTargetName(seed);
		},
/**
* @methode createChain
* @desc Creats a seed object chain in Mold.js scope. If an object allready exists it will not overwritten. For nonexistent objects an empty namespace will created.
* @param (String) targets - Expects an String with the seed chain
* @return (Object) - An Object with the created Chain
**/
		createChain : function(targets){
			return _createTarget(targets.split("."));
		},
/**
* @methode checkSeedCue
* @desc Checks the seedcue for new entrys. If a new entry was found it will be added to Mold.js
**/
		checkSeedCue : function(){
			var seedCue = Mold.cue.getType("seed");
			Mold.each(seedCue, function(seed){
				Mold.addSeed(seed);
			});
			
		},
		checkLoadedSeeds : function(name){
			var seeds = Mold.cue.getType("loadedseeds");
			
			Mold.each(_Mold, function(seedValue, seedName){
				var seedPath = seedName.substring(0, seedName.lastIndexOf("."));
				if(seedName === seedPath+"."+name){
					return seedName;
				}
			});
			return false;
		},

		addSeedNameCleaner : function(name, action){
			Mold.cue.add("seednamecleaner", name, action)
		},

		cleanSeedName : function(seedName){
			Mold.each(Mold.cue.getType("seednamecleaner"), function(action){
				seedName = action.call(null, seedName);
			});
			return seedName;
		},
		
/**
* @methode addSeed
* @desc Adds a Seed to Mold.js
* @param (object) seed - Expects a seed object
**/
	

		addSeed : function(seed){

			if(!seed.loaded){
				seed.loaded = true;
				if(seed.events){
					if(seed.events.beforcreate){
						seed.events.beforcreate(seed);
					}
				}
			}

			if(seed){
				//Checks if all dependencies will be loaded
				if(seed.status !== Mold.SEED_STATUS_LOADED){
					var loadingproperties = Mold.getLoadingproperties();
					var startCreating = true;
					seed.imports = seed.imports || [];
					Mold.each(loadingproperties, function(property){
						
						
						if(seed[property]){
							seed.imports = seed.imports.concat(_getImports(seed[property]));
							seed[property] = _removeImports(seed[property]);

							if(typeof seed[property] === "object"){
								startCreating = _areSeedsAdded(seed[property]);

								if(!startCreating){
									Mold.each(seed[property], function(element){
										if(Mold.isArray(element)){
											seed[property] = _loadSubSeeds(seed[property], seed.name);
										}else{
											if(!_Mold[element]){
												Mold.load({ name : element, isExternal : _externalSeeds[seed.name] || false });
											}
										}
									});
								}
							}else{

								startCreating = _isSeedAdded(seed[property]);
								if(!startCreating){
									Mold.load({ name : seed[property], isExternal : _externalSeeds[seed.name] || false });
								}
							}
						}
					});


					//If the seed has to wait for the DNA a callback will be added
					if(startCreating){
						if(typeof Mold.getDNA(seed.dna).wait === "function"){
							startCreating = Mold.getDNA(seed.dna).wait(seed, function(){
								Mold.checkSeedCue();
							});
						}
					}
				}
				
				
				var target = (_targetWrapper[seed.name]) ? _targetWrapper[seed.name] : seed.name;
				var targets = target.split(".");
				
				_createTarget(targets);

				if(seed.events && seed.events.log){
					Mold.onlog(seed.events.log);
				}
				if(seed.onlog){
					Mold.onlog(seed.onlog);
				}

				if(startCreating){
				
					if(Mold.getDNA(seed.dna).create){
						if(!_Mold[seed.name]){
							var newname = Mold.checkLoadedSeeds(seed.name);
							if(newname){
								seed.name = newname;
							}
						}
						
						if(!_createdMold[seed.name]){		
							if(seed.status !== Mold.SEED_STATUS_PREPROZESSING){
								seed.status = Mold.SEED_STATUS_PREPROZESSING;
								//import seeds
								seed.func = Mold.importSeeds(seed.func, seed.imports);

								var initSeed = function(compiled){
									Mold.seedList.push(_pathes[seed.name]);
									//mark as created
									
									_createdMold[seed.name] = seed;
									//replace seed code with compiled code
									seed.func = compiled;
									if(!Mold.stopExecution){
										//creat seed from dna
										var createdSeed = Mold.getDNA(seed.dna).create(seed);	
										createdSeed = _postProcess(createdSeed, seed);
										//create seed chain
										var target = Mold.createChain(Mold.getSeedChainName(seed));
										target[Mold.getTargetName(seed)] = createdSeed;
										//! Seed is loaded %seed.name%!
										
										//check events after creating;
										if(seed.events){
											if(seed.events.aftercreate){
												seed.events.aftercreate(seed);
											}
										}
									}
								
									Mold.log("Info", _seedLoadingCounter + ". Seed " + seed.name + " loaded!");
									_seedLoadingCounter++;	
									//check if registerd
									if(!_Mold[seed.name]){
										if(_config.debug){
											throw new Error("Seed is not registerd: " + seed.name);
										}else{
											_Mold[seed.name] = { name : seed.name};
										}
									}else{
										if( typeof _Mold[seed.name].loader  === "object" ){
											_Mold[seed.name].loader.loaded();
										}
									}
									//Mark as loaded
									if(_Mold[seed.name]){
										_Mold[seed.name].isLoaded = true;
									}
									//Remove from seedcue
									if(Mold.cue.get("seed", seed.name)){
										Mold.cue.remove("seed", seed.name);
									}
									Mold.checkSeedCue();

								}
								//Preprocess seed
								_preProcess(seed.func, seed.name, seed.dna, initSeed);
							}
						
						}else{
							Mold.checkSeedCue();
						}
					}
				}else{
					Mold.cue.add("seed", seed.name, seed);
					//For NodeJS 
					if(Mold.isNodeJS){
						Mold.checkSeedCue();
					}
				}
			}
		},
		node : function(){

			if(!_isNodeJS) {
				return false;
			}

			return {
				require : function(file){
					if(_isNodeJS){
						return require(file);
					}
					return false;
				},
				__dirname : __dirname
			}
		}(),
/**
* @methode loadScript
* @desc Loads a specified Script
* @param (String) path - Expects the scriptpath
* @param (loadScriptSuccsess) success - Expects a callback to be executed when the script is successfully loaded
* @param (loadScriptError) error  - Expects a callback to be executed if there is a loading error
*/
		loadScript : function(path, success, error, seedConf){
	
			if(_isNodeJS){
				
				var nodePath = require('fs'),
					pathStart = path.substring(0, 2);

				if(pathStart !== "./" && pathStart !== ".." && path.substring(0, 1) !== "/"){
					path = "./"+path;
				}
				if(nodePath.existsSync(path)){
					_pathes[seedConf.seedName] = path;
					var testMold = require(path);
					
				}else{
					throw new Error("File not found "+path+"!");
				}
			}else{
	
				
				if(_config.cacheOff){
					if(path.indexOf("?") == -1){
						path += "?cachoff="+Math.random();
					}else{
						path += "&cachoff="+Math.random();
					}
				}
				
				var scriptElement = document.createElement("script");
					scriptElement.src = path,
					scriptElement.type = "text/javascript",
					scriptElement.onloadDone = false;

				_documentHead.appendChild(scriptElement);
				
				_pathes[seedConf.seedName] = path;
				_addElementEvent(scriptElement, "load", function(){
					scriptElement.onloadDone = true;
				});
			
				_addElementEvent(scriptElement, "readystatechange", function(){
					scriptElement.onloadDone = true;
				});

				if(typeof success === "function"){
					_addElementEvent(scriptElement, "load", success);
					//_addElementEvent(scriptElement, "readystatechange", success);
				}
				
				_addElementEvent(scriptElement, "error", function(){
					throw new Error("File not Found "+this.src+"!");
				});

				if(typeof error === "function"){
					_addElementEvent(scriptElement, "error", error);
				}
				
			}
			return scriptElement;
		},

/**
* @methode loadScriptSuccsess

**/

/**
* @methode loadScriptError
* @desc Creats a seed object chain in Mold.js scope, if an object allready exists it will not be overwritten. For not existing object an empty namespace will created.
**/


/**
* @methode addLoadingRule
* @desc  adds a rule to control the loading process
* @param (String) name - Expects the name of the rule
* @param (Function) a function with a control statement 
**/
	 addLoadingRule : function(name, rule){
	 	Mold.cue.add("loadingrules", name, rule);
	 },


 	getLoadingRule : function(seed){
 		var loadingRules = Mold.cue.getType("loadingrules"),
			rule = false;
		
		Mold.find(loadingRules, function(selectedRule){
			var result = selectedRule.call(null, seed);
			if(result){

				rule = result;
			}else{
				return false;
			}
		});
		return rule
 	},

/**
* @methode load
* @desc Load the specified Seed
* @param (Object) seed - Expects a seed object
* @return (Object) A loader Object it offers a "loaded" eventlistener 
**/
	load : function(seed){

		var rule = Mold.getLoadingRule(seed);

		if(!rule){
			throw new Error("No loading rule found!");
		}
		
		var seedName = seed.name = rule.seedName;
		
		if(rule.isExternal || seed.isExternal){
			_externalSeeds[seed.name] = seed.isExternal || rule.path;
			seed.isExternal = rule.path;
		}

		if(!_Mold[seedName]){
			
			if(!seedName){
				throw new Error("Seedname ist not defined!");
			}


			if( seedName !="" ) {

				var filePath = rule.path || "";
				if(_externalSeeds[seed.name]){

					filePath = _externalSeeds[seed.name];
				}

				filePath += rule.file;
				seed.isLoaded = false;
				seed.isCreated = true;
				_Mold[seedName] = seed;
				
				if( typeof _Mold[seedName].loader !== "object" ){
					_Mold[seedName].loader = new _loader(seedName);
				}

				Mold.loadScript(filePath, 
					function(element){
						if(rule.isScript){
							_createdMold[seedName] = seedName;
						}else{
							Mold.cue.add("loadedseeds", seedName, true);
						}
						Mold.checkSeedCue();
					},
					false,
					{ isExternal : seed.isExternal, isScript : rule.isScript, seedName : seedName}
				);

			}
		}
		
		return _Mold[seedName].loader;
		
	},

/**
* @methode addMethod
* @desc Add a method to Mold.js, methodes with equal names will overwriten
* @param (String) name - Expects the method name
* @param (Function) method - Expects a function with the method code
**/
		addMethod : function(name, method){
			if( typeof Mold[name] === "undefined" ){
				Mold[name] = method;
			}
		},

/**
* @methode importSeeds
* @desc Import Seeds from array of objects to target seed
* @param (Function) target - the target seed
* @param (array) method - an array of objects
**/
		importSeeds : function(target, imports){
			if(imports.length){
				var importString = "";
				Mold.each(imports, function(seed){
					Mold.each(seed, function(value, key){
						importString += " var "+key+" = "+Mold.cleanSeedName(value)+";\n";
					});
				});

				return Mold.injectBefore(target, importString);
			}else{
				return target;
			}
		},

/**
* @methode injectBefore
* @desc Injects code at the beginning of a Functionobject;
* @param (Function) func - Expects a function object
* @param (String) code - Expects code to be injected
**/
		injectBefore : function(func, code){
			func = func.toString();
			func = func.substring(0, func.lastIndexOf("}")+1);
			var pattern = new RegExp("function\\s*\(([\\s\\S]*?)\)\\s*\{([\\s\\S]*?)\}$", "g");
			var matches = pattern.exec(func);
			if(matches){
				var parameter = matches[2];

				parameter = parameter.replace("(", "").replace(")", "");
				var objectEnd = matches[3];
				if(objectEnd){
					var newCode = "\n"+code+"\n"+objectEnd;
					return new Function(parameter, newCode);
				}else{
					throw new Error("Can not inject code, cause functions end not found");
					return false;
				}
			 }else{
			 	throw new Error("Can not inject code, function does not match function pattern");
			 }
		},

/**
* @methode extend
* @desc Inherited methods from a superclass to a class 
* @param (Class) superClass - Expected the superclass
* @param (Class) subClass - Expeted a Class
* @return (Class) - Returns a Class with inhired methodes an properties
**/
		extend : function(superClass, subClass, config){

			var superclassname = (config && config.superClassName) ? config.superClassName : "superclass",
				helperClass = function(){},
				reg = new RegExp("(function\\s*\([\\s\\S]*?\)\\s*\{)([\\s\\S]*)");
			
			helperClass.prototype = superClass.prototype;
			
			if(reg.test(subClass)){
				var parameter = RegExp.$2.replace(")","").replace("(", "").replace(" ", "").split(","); 
				var newConstructor = "\n\t this."+superclassname+".constructor.apply(this, arguments); \n"
				if(config && config.sourceURL){
					newConstructor += "\n\t\/\/#sourceURL="+config.sourceURL+"\n";
				}
				newConstructor += RegExp.$3.substr(0, RegExp.$3.lastIndexOf("}"));
				subClass = new Function(parameter, newConstructor);
				
			}
			
			subClass.prototype = new helperClass();
			subClass.prototype.constructor = subClass;
			subClass.prototype[superclassname] = superClass.prototype;
			superClass.prototype.constructor = function() { superClass.apply(this, arguments); };
			return subClass;
		},



/**
* @methode mixin
* @desc Adds Methods from one Object to another
* @param (Object) target - Expects the target object
* @param (Object) origin - Expects the origin object
* @param (Array) selected - Expects an array with the property- and methodenames that will be copied, the parameter is optional, if it is not given, all methodes an parametes will be copied
* @return (Object) - returns the target object with the new methodes an properties
**/
		mixin : function(target, origin, selected, config){
			for(var property in origin){
				
				if(property != "className"){
					if(selected && selected.length > 0){
						if(selected.indexOf(property) > -1){
							target[property] = origin[property];
						}
					}else{
						if(config && config.protected){
							if(!target[property]){
								target[property] = origin[property];
							}
						}else{
							target[property] = origin[property];
						}
					}
				}
			}
			return target;
		},
		
/**
* @methode getId
* @desc returns a uinque ID
* @return (Object) - returns the uinque ID
**/
		ident : 0,
		getId : function (){
			 Mold.ident++;
			return Mold.ident;
		},

/**
* @methode callWithDynamicArguments
* @desc Wraps a constructor and call it with dynamic arguments;
* @param (Function) constructor - Expects the target constructor
* @param (Array) arguments - Expects an array with the arguments
* @return (Object) - Returns the instance that was called
**/
		callWithDynamicArguments : function(constructor, parameter){
			var wrapper = function() {}
			wrapper.prototype = constructor.prototype;
			wrapperObject = new wrapper();
			wrapperObject.constructor = constructor;	
			return constructor.apply(wrapperObject, parameter);
		},
/**
* @methode wrap
* @desc Wraps a Class with a second constructor, so you can execute methods in the scope of the targetclass
* @param (Class) targetClass - Expects the class will be wraped
* @param (Function) wrappingMethode - Expects the method will be executed, as parameter the scope of the instance will transfered
* @return (Class) wrapperClass - Returns a new Class that wrapped the target class
**/
		wrap : function(targetClass, wrappingMethode){
			var wrapperClass = function() {
				var constructor = targetClass.apply(this, arguments);
				wrappingMethode(this);
				return constructor;
			}
			wrapperClass.prototype = targetClass.prototype;
			return wrapperClass;
		},

		clone : function(target) {
		    if(!target || typeof(target) != 'object'){
		        return target;
		    }
		    var newObj = target.constructor();
		    Mold.each(target, function(element, key, obj){
				newObj[key] = Mold.clone(obj[key]);
		    });
		    return newObj;
		},

		watch : function(obj, property, callback){

			if(Object.prototype.watch && !Mold.isNode(obj)){
				obj.watch(property, callback);
			}else{

				var oldval = obj[property];
				var newval = oldval;
				
				/*use mutation observer for HTML elements*/
				
				if(Mold.isNode(obj)){
				
					if(!!window.MutationObserver){
						var observer = new MutationObserver(function(mutations) {
							Mold.each(mutations, function(mutation) {
								
								if(
									mutation.target === obj
									&& mutation.type === 'attributes'
									&& mutation.attributeName === property
								){
									callback.call(obj, property,  mutation.oldValue, obj.getAttribute(property));
								}
						  	});    
						});
					
						observer.observe(obj, { 
							attributes: true,
							childList: true,
							characterData: true ,
							attributeOldValue: true,
						});
					}else{
						obj.addEventListener('DOMAttrModified', function(e){
							if(e.attrName === property){
								callback.call(obj, property, e.prevValue, e.newValue);
							}
						})
					}
				}else{
					var getter = function () {
						return newval;
					}
					var setter = function (val) {
						oldval = newval;
						return newval = callback.call(obj, property, oldval, val);
					}
					if (delete obj[property]) { 
						Object.defineProperty(obj, property, {
							  get: getter, 
							  set: setter,
							  enumerable: true,
							  configurable: true
						});
					}
				}
			}
		},

		unwatch : function(obj, property, callback){
			if(Object.prototype.unwatch) {
				obj.unwatch(property);
			}else{
				Object.defineProperty(obj, "unwatch", {
					enumerable: false,
					configurable: true,
					writable: false,
					value: function (prop) {
						var val = obj[property];
						delete obj[property];
						obj[property] = val;
					}
				});
			}
		}
	};

})({
	seedPath : "",
	cacheOff : true
});


Mold.addLoadingRule("external", function(seed){
 	if(seed.name.indexOf("external->") > -1 || Mold.startsWith(seed.name, "->")){

 		var path = Mold.EXTERNAL_REPOSITORY,
 			seedName = seed.name.split("->")[1],
			fileParts = seedName.split("."),
			file = fileParts.join("/") + ".js";

 		return { path : path, file : file, isExternal : true, seedName: seedName }
 	}else{
 		return false;
 	}
});


Mold.addLoadingRule("standard", function(seed){
 	if(
 		seed.name.indexOf("->") === -1 
 		&& seed.name.indexOf("http:") === -1
 		&& seed.name.indexOf("https:") === -1
 	 ){
 		var path = Mold.LOCAL_REPOSITORY,
 			seedName = seed.name,
 			fileParts = seedName.split("."),
			file = fileParts.join("/") + ".js";
		
		return { path : path, file : file, isExternal : false, seedName: seedName }
 	}else{
 		return false;
 	}
 });

Mold.addSeedNameCleaner("standard", function(seedName){
	if(Mold.startsWith(seedName, "->")){
		seedName = seedName.slice(2, seedName.length);
	}
	if(seedName.indexOf("->") > -1){
		if(seedName.indexOf("->") === 0){
			seedName = seedName.split("->")[0];
		}else{
			seedName = seedName.split("->")[1];
		}
	}
	return seedName;
});


Mold.addLoadingRule("external_script", function(seed){
 	if( 
 		Mold.startsWith(seed.name, "http:")
 		|| Mold.startsWith(seed.name, "https:")
 	 ){
 		var path = seed.name,
 			seedName = seed.name,
 			fileParts = seedName.split(".");
		
		return { path : '', file : seed.name, isExternal : false, seedName: seedName, isScript : true }
 	}else{
 		return false;
 	}
 });

Mold.addSeedNameCleaner("standard", function(seedName){
	if(Mold.startsWith(seedName, "->")){
		seedName = seedName.slice(2, seedName.length);
	}
	if(seedName.indexOf("->") > -1){
		if(seedName.indexOf("->") === 0){
			seedName = seedName.split("->")[0];
		}else{
			seedName = seedName.split("->")[1];
		}
	}
	return seedName;
});


Mold.addDNA({ 
	name :  "dna", 
	dnaInit : function(){
		Mold.addLoadingProperty("include");
		if(Mold.isNodeJS){
			Mold.addLoadingProperty("nodeInclude");
		}else{
			Mold.addLoadingProperty("browserInclude");
		}
	},
	create : function(seed) {
		if(seed.func.methodes){
			var target = Mold.createChain(Mold.getSeedChainName(seed));	
			target[Mold.getTargetName(seed)] = seed.func.methodes();
		}
		if(seed.func.init){
			seed.func.init(seed);
		}
		Mold.addDNA(seed.func);
		return (seed.func.methodes) ? seed.func.methodes() : seed.func;
	}
});


Mold.addDNA({ 
	name :  "static", 
	create : function(seed) {
		return  seed.func.call();
	}
});

Mold.addDNA({ 
	name :  "class",
	dnaInit : function(){
		Mold.addLoadingProperty("extend");
		Mold.addLoadingProperty("implements");
	},
	create : function(seed) {
		var target = Mold.createChain(Mold.getSeedChainName(seed));			
		if(seed.extend){
			var superClass = Mold.getSeed(seed.extend);
			seed.func = Mold.extend(superClass, seed.func, { sourceURL : seed.name });

		}

		var wrapperClass = Mold.wrap(seed.func, function(that){
			if(that.publics){
				for(var property in that.publics){
					that[property] = that.publics[property];
				}
			}
			delete that.publics;
			if(that.trigger && typeof that.trigger === "function"){
				that.trigger("after.init");
			}
			return constructor;
		});
	
		wrapperClass.prototype.className = seed.name;
		return wrapperClass; 
		
	}
});

Mold.addDNA({
	name : "singelton",
	create : function(seed){
		var target = Mold.createChain(Mold.getSeedChainName(seed));
		var _instance = false;
		
		var targetClass = Mold.getDNA("class").create(seed);
		var wrapperClass = function() {

			if(!_instance){
				targetClass.apply(this, arguments);
				_instance = this;
			}
			return _instance;
		}
		
		wrapperClass.prototype = targetClass.prototype;
		return wrapperClass;
		
	}
});

Mold.addDNA({ 
	name :  "data", 
	create : function(seed) {
		return seed.func;
	}
});




Mold.addDNA({
	name : "action",
	create : function(seed){
		if(typeof seed.func === "function"){
			seed.func.call(null)
		}
		return seed.func;
	}
});


Mold.addDNA({
	name : 'package',
	create : function(seed){
		return seed.include;
	}
});


(function(){
	var seedFunction = function(seed, func){
		seed.func = func;
		Mold.addSeed(seed);
		//return 
	};
	if(Mold.isNodeJS){

		global.Seed = seedFunction
		global.Mold = Mold;
		Mold.ready(function(){
			var mainScript = Mold.getMainScript();

			if(mainScript){
				Mold.load({ name : mainScript });
			}
		});
	}else{
		window.Seed = seedFunction;
	}
	return seedFunction;
}());

Mold.onlog(function(type, test){
	//console.log(type, test);
});

if(Mold.isNodeJS){
	module.exports = Mold;
}