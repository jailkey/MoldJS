/**
 * @author Jan Kaufmann <jan@moldjs.de>
 * @version 0.1.1;
 */
 "use strict";
if(typeof Titanium !== undefined) { var GLOBAL = this };

var Mold = (function(config){
	var _config = (config) ? config :  "CONFIG FAILED";
	var _Mold = {};
	var _targetWrapper = {};
	var _cue = {};
	var _createdMold = {};
	var _externalRepository = false;
	var _repositoryName = "Mold";
	var _localRepository = false;
	var _externalSeeds = {};
	var _isDom = false;
	var _features = {};
	
	try {
		var _isNodeJS = (!!window) ? false : true ;
	}catch(e){
		var _isNodeJS = true;
	}

	if(!_isNodeJS){
		var _documentHead = document.getElementsByTagName("head")[0];
	}
	
	var _isTitanium = (typeof Titanium !== "undefined") ? true : false;
	var _isNodeJS = (_isTitanium) ? false : _isNodeJS;
	

	var _detectFeatures = function(){
		var checker = false;
		_features["history"] = !!(window.history && history.pushState);
		_features["geolocation"] = 'geolocation' in navigator;
		_features["indexedDB"] = !!window.indexedDB;
		_features["postMessage"] = !!window.postMessage;
		_features["websql"] = !!window.openDatabase;
		_features["webGL"] =  !!window.WebGLRenderingContext;
		_features["webworkers"] = !!window.Worker;
		_features["applicationCache"] = !!window.applicationCache;
		_features["canvas"] = !!((checker = document.createElement('canvas')) 
									&& checker.getContext 
									&& checker.getContext('2d')
								); checker = false;
		_features["defineProperty"] = !!Object.defineProperty;
		_features["querySelector"] = !!document.querySelectorAll;
		_features["querySelectorAll"] = !!document.querySelectorAll;
		_features["sessionStorage"] = !!window.sessionStorage;
		_features["localStorage"] = !!window.localStorage;
		_features["proxy"] = !!window.Proxy;
	}

	_detectFeatures();

	var _getRootObject = function(){
		
		var rootObject = (_isNodeJS) ? global : (_isTitanium) ? GLOBAL : window;
		return rootObject;
	}
	
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
		return ( _createdMold[ target ] ) ? true : false;
	};
	
	
	var _areSeedsAdded = function(included){
		var output = true;
		Mold.each(included, function(value){
			var seedName = (value.indexOf("->") !== -1) ? value.split("->")[1] : value;

			if(! _isSeedAdded(seedName)){
				output =  false;
			}
		});

		return output;
	};
	
	var _loader = function(name){
		var _name = name;
		var _actions = [];
		var _onerror = [];
		var _isLoaded = false;
		this.bind = function ( callback ){
			if(!_isLoaded){
				_actions[_actions.length] = callback;
			}else{
				callback(name);
			}
			return this;
		};
		
		this.loaded = function(){
			var newactions = [],
				i = 0;

			Mold.each(_actions, function(element){
				if( typeof element === "function" ){
					element(name);
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
		if(!_isDom && !_isNodeJS && !_isTitanium){
			_addElementEvent(window, "load", callback);
		}else{
			callback();
		}
	};
	
	var _getMainScript = function(){
		if(_isNodeJS){
			var output = false;
			process.argv.forEach(function (val, index, array) {
				if(index >= 2){
					
					output = val;
					//Mold.load({name : val});
				}
			});
			return output;
		}else{
			var i = 0,
				mainScript = false,
				repositiory = false,
				scripts = document.getElementsByTagName("script");
			

			if((mainScript = Mold.find(scripts, function(script){
				if(script.getAttribute("data-mold-main") || script.getAttribute("src").indexOf("Mold.js") > -1){
					_config.repositoryName  = script.getAttribute("data-mold-repository-name") || "Mold";
					_config.externalRepository =  script.getAttribute("data-mold-external-repository");
					_config.localRepository = script.getAttribute("data-mold-repository");
					_config.cacheOff = (script.getAttribute("data-mold-cache") === "off") ? true : false;
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

	var _isExternal = function(path){
		return (path.indexOf("->") !== -1) ? true : false;
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
	
	return {
/**
* @namespace Mold
* @methode trim
* @public
* @param (String) phrase - string with leading and ending whitespaces
* @retrun (String) - returns a String without leading and ending whitespaces
*/

		trim : function(phrase){
			phrase = phrase.replace(/\n*/gm, "");
			phrase = phrase.replace(/^\s+|\s+$/g, "");
			return phrase;
		},

/**
* @namespace Mold
* @methode each
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
				 	if(iterator.call(context, collection[i], i, collection) === "break") {
				 		return true;
				 	};
				}
			}else {
				var keys = Mold.keys(collection);
				var len = keys.length;
				for(; i < len; i++){
					if(collection[keys[i]] && iterator.call(context, collection[keys[i]], keys[i], collection) === "break"){
						return true;
					}
				}
			}
			return true;
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
			var result;
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
					return "break";
				}
			});

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
			if(Object.prototype.toString.call(collection) === "[object NodeList]"){
				return true;
			}
			return false;
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
				throw "DNA-handler "+dnaName+" not found!"
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
 * This callback is displayed as part of the Requester class.
 * @callback onlogCallback
 * @param {String} type The type of the logmessage, default it can be "Error", "Info", or "Debug"
 * @param {String|Object} message The errormessage, if the logtype is "Error" it will be an object 
 */		

/**
* @methode addLoadingProperty
* @desc Tells Mold.js which properties of a Seed are "loading properties". These properties include a reference to other seeds. This method will be used to build new DNA.
* @param (String) propertyName - The name of the property to be added.
**/
		addLoadingProperty : function(propertyName){
			Mold.cue.add("loadingproperty", propertyName, propertyName);
		},
/**
* @methode getLoadingPropertys
* @desc Returns a list of all "loading properties"
* @return (Array) - A list of all "loading properties"
**/
		getLoadingPropertys : function(){
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
		checkLoadedNames : function(name){
			var seeds = Mold.cue.getType("loadedseeds");
			
			Mold.each(_Mold, function(seedValue, seedName){
				//console.log("checkLoadedNames seed->", seedName);
				var seedPath = seedName.substring(0, seedName.lastIndexOf("."));
				if(seedName === seedPath+"."+name){
					return seedName;
				}
			});
			return false;
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
				var loadingPropertys = Mold.getLoadingPropertys();
				var startCreating = true;
				Mold.each(loadingPropertys, function(property){

					if(seed[property]){
						if(typeof seed[property] === "object"){
							startCreating = _areSeedsAdded(seed[property]);

							if(!startCreating){
								Mold.each(seed[property], function(element){

									if( !_Mold[element] ){

										Mold.load({ name : element, isExternal : _externalSeeds[seed.name] || false });
									}
								});
							}
						}else{
							startCreating = _isSeedAdded(seed[property]);
							if(!startCreating){
								Mold.load({ name : seed[property]});
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
							var newname = Mold.checkLoadedNames(seed.name);
							if(newname){
								seed.name = newname;
							}
						}
						
						if(!_createdMold[seed.name]){
							_createdMold[seed.name] = seed;
							
							Mold.getDNA(seed.dna).create(seed);
							Mold.log("Info", "Seed "+seed.name+ " loaded!");
							if(seed.events){
								if(seed.events.aftercreate){
									seed.events.aftercreate(seed);
								}
							}							
							if(!_Mold[seed.name]){
								Mold.log("Error", { code : 8, seedname: seed.name});
							}else{
								if( typeof _Mold[seed.name].loader  === "object" ){
									_Mold[seed.name].loader.loaded();
								}
							}
						}
					}
					
					if(Mold.cue.get("seed", seed.name)){
						Mold.cue.remove("seed", seed.name)
						Mold.checkSeedCue();
					}
					
					if(_Mold[seed.name]){
						_Mold[seed.name].isLoaded = true;
						
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
/**
* @methode loadScript
* @desc Loads a specified Script
* @param (String) path - Expects the scriptpath
* @param (loadScriptSuccsess) success - Expects a callback to be executed when the script is successfully loaded
* @param (loadScriptError) error  - Expects a callback to be executed if there is a loading error
*/
		loadScript : function(path, success, error, seedConf){
	
			if(_isNodeJS){
				var nodePath = require('fs');
				path = "./"+path;
				if(nodePath.existsSync(path)){
					var testMold = require(path);
					console.log("require", path);
				}else{
					
					Mold.log("Error", { code : 1, filename : path} );
				}
			}else if(_isTitanium){
				Titanium.include("/"+path);
			}else{
				var scriptElement = document.createElement("script");
				if(_config.cacheOff){
					if(path.indexOf("?") == -1){
						path += "?cachoff="+Math.random();
					}else{
						path += "&cachoff="+Math.random();
					}
				}
				
				if(_config.localRepository !== null){
					path = _config.localRepository + path;

				}else if(_config.externalRepository !== null){
					path = _config.externalRepository + path;
				}

				scriptElement.src = path;
				scriptElement.type = "text/javascript";
				_documentHead.appendChild(scriptElement);
				scriptElement.onloadDone = false;
				_addElementEvent(scriptElement, "load", function(){
					scriptElement.onloadDone = true;
				});
			
				_addElementEvent(scriptElement, "readystatechange", function(){
					scriptElement.onloadDone = true;
				});
				if(typeof success === "function"){
					_addElementEvent(scriptElement, "load", success);
					_addElementEvent(scriptElement, "readystatechange", success);
				}
				
				_addElementEvent(scriptElement, "error", function(){
					Mold.log("Error", { code : 1, filename : this.src} );
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
* @methode load
* @desc Load the specified Seed
* @param (Object) seed - Expects a seed object
* @return (Object) A loader Object it offers a "loaded" eventlistener 
**/
	load : function(seed){
		if(_isExternal(seed.name) || seed.isExternal){
			var urlName = seed.name;
			if(seed.name.indexOf("->") !== -1){
				seedName = seed.name = seed.name.split("->")[1];
			}
			if(urlName.indexOf("lib->") !== -1){
				_externalSeeds[seed.name] = "lib";
			}else{
				if(seed.isExternal){
					_externalSeeds[seed.name]  = seed.isExternal;
				}else{
					if(urlName.indexOf("external->") !== -1){
					
						_externalSeeds[seed.name] = _config.externalRepository;
					}else{
						_externalSeeds[seed.name] = urlName.split("->")[0];

					}
				}
			}
			seed.isExternal = _externalSeeds[seed.name];
		}


	
		var seedName = seed.name;
		if(!_Mold[seedName]){
			if(!seedName){
				Mold.log("Error", { code : 2});
			}
			if( seedName!="" ) {


				var path = seedName.split(".");
				var filePath = (seed.url) ? seed.url : _config.seedPath;
				filePath += path.join("/") + ".js";

				if(_externalSeeds[seed.name]){
					if(_externalSeeds[seed.name] === "external"){
						filePath = _config.externalRepository + filePath;
					}else if(_externalSeeds[seed.name] === "lib"){
						filePath = seed.name;
					}else{
						filePath = _externalSeeds[seed.name] + filePath;
					}
				}

				seed.isLoaded = false;
				seed.isCreated = true;
				
				_Mold[seedName] = seed;
				if( typeof _Mold[seedName].loader !== "object" ){
					_Mold[seedName].loader = new _loader(seedName);
				}
				

				Mold.loadScript(filePath, 
					function(element){
						if(_externalSeeds[seed.name] === "lib"){
							_createdMold[seedName] = seedName;
						}else{
							Mold.cue.add("loadedseeds", seedName, true);
						}
						Mold.checkSeedCue();
					},
					false,
					{ isExternal : seed.isExternal }
				);
			}
		}
		
		return _Mold[seedName].loader;
		
	},


/**
* @methode isSupported
* @desc Test if the Browser has native suppport for the given property/methode
* @param (String) name - Expects the method-/propertyname
* @return (Boolen) - if test is successfull it returns true, else if it returns false
**/
	isSupported : function(name){
		if(typeof _features[name] !== "undefined"){
			return _features[name];
		}else{
			throw "There is no feature detection for '"+name+"'' implemented!";
		}
	},

/**
* @methode addFeatureTest
* @desc Test if the Browser has native suppport for the given feature
* @param (String) name - Expects the method-/propertyname
* @return (Boolen) - if test is successfull it returns true, else if it returns false
**/
	addFeatureTest : function(name, test){
		_features[name] = test();
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
* @namespace Mold
* @object 
* @name jsparser
* @desc Include methodes to parse jscode
* @values splitCodeAndParameter, injectBefore, injectAfter, removeFromFunction, removeFromFunction, deleteComments, areOpendEqualClosedBrackets, parseObjectLitral
**/

		jsparser : {
			splitCodeAndParameter : function(func){
				func = func.toString();
				func = func.substring(0, func.lastIndexOf("}")+1);
				var pattern = new RegExp("function\\s*\(([\\s\\S]*?)\)\\s*\{([\\s\\S]*?)\}$", "g");
				var matches = pattern.exec(func);
				if(matches){
					var parameter = matches[2];
					parameter = parameter.replace("(", "").replace(")", "").replace("anonymous", "");
					var code = matches[3];
					return { parameter : parameter, code : code}
				}
				return false;
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
						Mold.log("Error", { code : 9, inject : code, func : func});
						return false;
					}
				 }else{
					Mold.log("Error", { code : 9, inject : code, func : func});
				 }
			},

			injectAfter : function(func, code){
				var functionValues = Mold.jsparser.splitCodeAndParameter(func);
				if(functionValues){
					if(functionValues.code.lastIndexOf("return") > functionValues.code.lastIndexOf("}")){
						functionValues.code = functionValues.code.substring(0, 
							functionValues.code.lastIndexOf("return")) 
							+ code 
							+ functionValues.code.substring( functionValues.code.lastIndexOf("return"), functionValues.code.length
						);

					}else{
						functionValues.code = functionValues.code +code;
					}
					return new Function(functionValues.parameter, functionValues.code);
				}else{
					return false;
				}
			},

			removeFromFunction : function(func, codeToRemove){
				var oldfunction = func;
				func = func.toString();
				func = func.replace(codeToRemove, "");
				var functionValues = Mold.jsparser.splitCodeAndParameter(func);
				if(functionValues){
					return new Function(functionValues.parameter, functionValues.code);
				}
				return oldfunction;
			},


			deleteComments : function(codeString){
				return codeString.replace(/\/\*[\s\S]*?\*\//gm, "");
			},

			areOpendEqualClosedBrackets : function(literalString){
				var opendCurlyLen = literalString.split("{").length;
				var closedCurlyLen = literalString.split("}").length;
				var opendSquareLen = literalString.split("[").length;
				var closedSquareLen = literalString.split("]").length;
				var opendRoundeLen = literalString.split("(").length;
				var closedRoundLen = literalString.split(")").length;
				if(opendCurlyLen === closedCurlyLen 
					&& opendSquareLen === closedSquareLen 
					&& opendRoundeLen === closedRoundLen
				){
					return true;
				}else{
					return false;
				}
			},

			parseObjectLitral : function(literalString, onelement){
				literalString = Mold.jsparser.deleteComments(literalString);
				var output = [];

				var propertyValueStart = literalString.indexOf(":");
				var stringStart = literalString.indexOf("{")+1;
				if(stringStart > propertyValueStart){
					stringStart = literalString.indexOf(",")+1;
					if(stringStart > propertyValueStart){
						stringStart = 0;
					}
				}
				var elementName = Mold.trim(literalString.substring(stringStart, propertyValueStart));
				literalString = literalString.substring(propertyValueStart, literalString.length);
				propertyValueStart = literalString.indexOf(":");
				var propertyValueEnd = literalString.indexOf(",");
				if(propertyValueEnd == -1){
					return false;
				}
				var elementValue = Mold.trim(literalString.substring(propertyValueStart+1, propertyValueEnd));
				while(!Mold.jsparser.areOpendEqualClosedBrackets(elementValue)){
					propertyValueEnd = literalString.indexOf(",", propertyValueEnd +1);
					if(propertyValueEnd == -1){
						propertyValueEnd = literalString.lastIndexOf("}") -1;
					}
					elementValue = Mold.trim(literalString.substring(propertyValueStart+1, propertyValueEnd));
				}
				
				literalString = literalString.substring(propertyValueEnd, literalString.length);
				var outputValue = { name : elementName, value : elementValue };
				if(literalString){
					output.concat(Mold.jsparser.parseObjectLitral(literalString, onelement));
				}
				
				if(typeof onelement === "function"){
					onelement.call(this, outputValue);
				}

				return output;


			},
		},

/**
* @methode extend
* @desc Inherited methods from a superclass to a class 
* @param (Class) superClass - Expected the superclass
* @param (Class) subClass - Expeted a Class
* @return (Class) - Returns a Class with inhired methodes an properties
**/
		extend : function(superClass, subClass, config){
			var superclassname = (config && config.superClassName) ? config.superClassName : "superclass";
			var helperClass = function(){};
			helperClass.prototype = superClass.prototype;
			
			var reg = new RegExp("(function\\s*\([\\s\\S]*?\)\\s*\{)([\\s\\S]*)");
			if(reg.test(subClass)){
				var parameter = RegExp.$2.replace(")","").replace("(", "").replace(" ", "").split(","); 
				var newConstructor = "\n\t this."+superclassname+".constructor.apply(this, arguments); \n"
				if(config && config.sourceURL){
					newConstructor += "\n\t\/\/@sourceURL="+config.sourceURL+"\n";
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
* @methode mixing
* @desc Adds Methods from one Object to another
* @param (Object) target - Expects the target object
* @param (Object) origin - Expects the origin object
* @param (Array) selected - Expects an array with the property- and methodenames that will be copied, the parameter is optional, if it is not given, all methodes an parametes will be copied
* @return (Object) - returns the target object with the new methodes an propertys
**/
		mixing : function(target, origin, selected){
			for(var property in origin){
				
				if(property != "className"){
					if(selected && selected.length > 0){
						if(selected.indexOf(property) > -1){
							target[property] = origin[property];
						}
					}else{
						target[property] = origin[property];
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

			if(Object.prototype.watch){
				obj.watch(property, callback);
			}else{

				var oldval = obj[property];
				var newval = oldval;

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


Mold.addDNA({ 
	name :  "dna", 
	dnaInit : function(){
		Mold.addLoadingProperty("include");
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
		
	}
});


Mold.addDNA({ 
	name :  "static", 
	create : function(seed) {
		var target = Mold.createChain(Mold.getSeedChainName(seed));
		target[Mold.getTargetName(seed)] = seed.func();
		
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

				if(seed.compiler && seed.compiler.preparsePublics){
					var result = /(this\.publics.*?=.*?)(\{[\s\S]*\})/gm.exec(seed.func.toString());

					var getPublics = function(string){
						var opend = string.split("{").length,
							closed = string.split("}").length;

						while(opend != closed){
							string = string.substring(0, string.lastIndexOf("}"));
							opend =  string.split("{").length;
							closed = string.split("}").length;
						}
						string = string.substring(0, string.lastIndexOf("}")+1);
						return string;
					}
					if(result){
						var publicsString = getPublics(result[2]);
						var insertProp = "";
						var literalRoutines = Mold.jsparser.parseObjectLitral(publicsString, function(property){
							insertProp = insertProp + "\n this"+"."+property.name+"="+property.value+";\n\n";
						});
						var removeString = result[1] + publicsString;
						seed.func = Mold.jsparser.removeFromFunction(seed.func, removeString);
						seed.func = Mold.jsparser.injectAfter(seed.func, insertProp);
					}
				}
				if(seed.compiler && (seed.compiler.disableWrapping || seed.compiler.preparsePublics)){
					seed.func.prototype.className = seed.name;
					target[Mold.getTargetName(seed)] = seed.func;
				}else{
					var wrapperClass = Mold.wrap(seed.func, function(that){
						if(that.publics){
							for(var property in that.publics){
								that[property] = that.publics[property];
							}
						}
						delete that.publics;
						return constructor;
					});
				
					wrapperClass.prototype.className = seed.name;
					target[Mold.getTargetName(seed)] = wrapperClass;
				}
				return target[Mold.getTargetName(seed)];
		
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
		var target = Mold.createChain(Mold.getSeedChainName(seed));
		target[Mold.getTargetName(seed)] = wrapperClass;
		return target[Mold.getTargetName(seed)];
		
	}
});

Mold.addDNA({ 
	name :  "data", 
	create : function(seed) {
		try {
			var target = Mold.createChain(seed.name.substring(0, seed.name.lastIndexOf(".")));
			target[seed.name.substring(seed.name.lastIndexOf(".")+1, seed.name.length)] = seed.func;
		}catch(e){
			Mold.log("Error", { code : 3, dnaname: "data", error : e});
		}
	}
});




Mold.addDNA({
	name : "action",
	create : function(seed){
		if(typeof seed.func === "function"){
			seed.func()
		}
	}
});


(function(){
	var seedFunction = function(seed, func){
		seed.func = func;
		Mold.addSeed(seed);
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
	}else if(Mold.isTitanium){
		GLOBAL.Seed = seedFunction
	}else{
		window.Seed = seedFunction;
	}
	return seedFunction;
}());


Mold.onlog(function(type, test){
	console.log(type, test);
});