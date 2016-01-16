"use strict";

(function(global){

/** ERROR TYPES */
	var SeedError = function SeedError (message) {
	    this.name = 'SeedError';
	    this.message = message;
	    this.stack = (new Error()).stack;
	}

	SeedError.prototype = new Error;

	var DNAError = function DNAError (message) {
	    this.name = 'DNAError';
	    this.message = message;
	    this.stack = (new Error()).stack;
	}

	DNAError.prototype = new Error;

	var SeedTypeError = function SeedTypeError (message) {
	    this.name = 'SeedTypeError';
	    this.message = message;
	    this.stack = (new Error()).stack;
	}

	SeedTypeError.prototype = new Error;

	var _isNodeJS =  (global.global) ? true : false;

/** MOLD CONTRUCTOR */
	var Mold = function Mold(){
		
		//create storages
		this.seeds = [];
		this.seedIndex = {};
		this.seedTypeIndex = {};

		this.errors = {
			SeedError : SeedError,
			DNAError : DNAError,
			SeedTypeError : SeedTypeError
		}

		this.EXIT = '---exit---';

		this.isNodeJS = _isNodeJS;

		this.init();
	}

	
	Mold.prototype = {
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

/** SEED HANDLING */


		load : function(name){
			var seed = this.Core.SeedFactory({
				name : name,
				state : this.Core.SeedStates.LOADING
			});

			this.Core.SeedFlow.exec(seed);
		},

/** FUNCTIONAL METHODS **/
		
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
		each : function(collection, iterator, context, debug){
			var i = 0;
			if(collection == null || collection === false) { 
				return false; 
			}

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
				var keys = Mold.keys(collection), len = keys.length;
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
		 * @param {array} collection the array
		 * @param  {function} callback  method will called on each entry, given paramter is the entry value           
		 */
		eachShift : function(collection, callback){
			if(!Mold.isArray(collection)){
				return false;
			}
			if(typeof callback !== "function"){
				throw new Error("eachShift needs a callback ")
			}
			while(collection.length){
				var selected = collection.shift();
				callback.call(this, selected);
			}
		},

		/**
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
		* @methode some
		* @desc iterates through an array until the specified callback returns false
		* @public
		* @param (Object) collection - the list
		* @param (function) iterator - a callback function
		* @param (object) context - context Object
		* @return (boolean) returns true if the callback function returns true for each element, otherwise it returns false; 
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


/**  OBJECT HANDLING  **/
		
		 extend : function(superClass, subClass){
		 	subClass.prototype = Object.create(superClass);
		 	subClass.prototype.constructor = subClass;
		 	return subClass;
		 },


	 	/**
		* @method mixin
		* @desc Adds methods adn properties from one object to another
		* @param {object} target - Expects the target object
		* @param {object} origin - Expects the origin object
		* @param {[array]} selected - Expects an array with the property- and methodnames that will be copied, the parameter is optional, if it is not given, all methodes an parametes will be copied
		* @return {object} - returns the target object with the new methodes an properties
		**/
		mixin : function(target, origin, selected, config){
			for(var property in origin){
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
			return target;
		},

		/**
		 * @method clone 
		 * @description clones an given object
		 * @param  {object} target - the object that should be cloned
		 * @return {object} returns the cloned object
		 */
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

		/**
		* @methode wrap
		* @desc Wraps a Class with a second constructor, so you can execute methods in the scope of the targetclass
		* @param (function) targetClass - Expects the class will be wraped
		* @param (function) wrappingMethode - Expects the method that will be executed, as parameter the scope of the instance will transfered
		* @return (function) wrapperClass - Returns a new Class that wrapped the target class
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

		/**
		 * @method watch 
		 * @description watches a property of an object or html element
		 * @param  {object}   obj - the ojbect to watch
		 * @param  {string}   property - the property to watch
		 * @param  {function} callback - the callback wich will be called if the property has changed
		 * @param  {boolean}  [handleAsObject] - if it is set to true the object will handelt like a object even if it is a html element
		 */
		watch : function(obj, property, callback, handleAsObject){

			if(Object.prototype.watch && !Mold.isNode(obj)){
				obj.watch(property, callback);
			}else{

				var oldval = obj[property];
				var newval = oldval;
				
				/*use mutation observer for HTML elements*/
				if(Mold.isNode(obj) && !handleAsObject){
				
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

		/**
		 * @method unwatch 
		 * @description unwatches a object property 
 		 * @param  {object}   obj - the object to unwatch
		 * @param  {string}   property - the property to unwatch
		 * @param  {function} callback - the callback that has to be removed
		 */
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
		},


/** TEST METHODS **/

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

		/**
		 * @method isNode 
		 * @description checks if an object is in a html element node
		 * @param  {object}  element - the node to check
		 * @return {boolean} returns true if the element is a element node otherwise it returns false
		 */
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

	}

	//Build-in core modules
	Mold.prototype.Core = {};

	/**
	 * @module Mold.Core.SeedFactory
	 * @description creates a seed object from a configuration
	 * @param  {object} seedConf - the cofiguration object can contain the following properties
	 *                           - 'name' the name of the seed including the full object path, this property is mandatory
	 *                           - 'type' the seed dna, the dna describes the way how the module will be executed
	 *                           - 'code' the code of the seed, this property is mandatory
	 * @return {object} seedObject - returns a seed object with the config properties plus the following methods and properties
	 *                             - 'state' the current state of the seed
	 */
	Mold.prototype.Core.SeedFactory = function(conf){

		if(!conf){
			throw new Error("seedConf must be defined!");
		}

		if(typeof conf !== 'object'){
			throw new Error("seedConf must be an object!");
		}

		/**
		 * @class Seed 
		 * @description defineds methods and properties of a seed
		 * @param {[type]} properies - properties configuration
		 */
		var Seed = function Seed(properties){
			if(!properties.name){
				throw new SeedError('A seed needs a name!')
			}

			//append propetises
			for(var prop in properties){
				this[prop] = properties[prop];
			}

			this.state = properties.state || Mold.Core.SeedStates.INITIALISING;
		}

		Seed.prototype = {
			/**
			 * @method  hasDependency 
			 * @description checks if a specific dependency exists
			 * @param  {string}  name - the name of the dependency
			 * @return {boolean} returns true if the seed has the given dependency otherwise it return false
			 */
			hasDependency : function(name){
				return Mold.find(this.dependencies, function(value){
					return (value.name === name) ? true : false;
				});
			},

			/**
			 * @method  hasDependencies 
			 * @description checks if the seed has dependcies 
			 * @return {boolean} return true if the seed has dependencies
			 */
			hasDependencies : function(){
				if(this.dependencies && this.dependencies.length){
					return true;
				}
				return false;
			},

			/**
			 * @addDependency 
			 * @description adds a dependency to the seed
			 * @param {string} dependency - the name of the dependency
			 */
			addDependency : function(dependency){
				if(this.hasDependency(dependency)){
					return false;
				}
				if(!this.dependencies){
					this.dependencies = [];
				}
				this.dependencies.push(dependency);
			},
			execute : function(){

			}
		}

		return new Seed(conf);
	
	}

	/**
	 * @module SeedManager 
	 * @description manage all appended seeds
	 */
	Mold.prototype.Core.SeedManager = function(){
		var _seeds = [];
		var _seedIndex = {};

		var _deleteSeedByName = function(name){
			for(var i = 0; i < _seeds.length; i++){
				if(_seeds[i].name === name){
					_seeds.splice(i, 1);
					return true;
				}
			}
			return false;
		}

		return {

			/**
			 * @property {number} len 
			 * @description contains the amount of added seeds
			 */
			get count(){
				return _seeds.length;
			},

			set count(value){
				throw new Error("the property 'len' is not writeable! [Mold.Core.SeedManager]");
			},

			/**
			 * @method add 
			 * @description adds a seed to the seedmangaer
			 * @param {object} seed - the seed
			 */
			add : function(seed){
				if(_seedIndex[seed.name]){
					if(seed.overwrite){
						_deleteSeedByName(seed.name);
					}else{
						return false;
					}
				}
				_seeds.push(seed);
				_seedIndex[seed.name] = seed;
			},

			/**
			 * @method get 
			 * @description returns a seed by the given name
			 * @param  {string} name - the seed name, expects the full name for example Mold.Core.Test
			 * @return {object | null} returns the selected seed if found
			 */
			get : function(seed){
				var name = (typeof seed === 'object') ? seed.name : seed;
				return _seedIndex[name] || null;
			},

			/**
			 * @method remove 
			 * @description removes a seed 
			 * @param {mixed} seed - expects a seed or a seedname
			 */
			remove : function(seed){
				var name = (typeof seed === 'object') ? seed.name : seed;
				delete _seedIndex[name];
				_deleteSeedByName(name);
			}
		}
	}();



	/**
	 * @module Mold.Core.NamespaceManger
	 * @description provide methods for creating / validating a
	 */
	Mold.prototype.Core.NamespaceManager = function(){

		return {

			/**
			 * @method validateName
			 * @description checks if the given name is a valid Mold namespace name
			 * @param  {string} name - a string with the name
			 * @return {boolean} returns true if the name is valid and false if not 
			 */
			validate : function(name){
				if(/^[A-Z]{1}[a-z|A-Z]*$/.test(name)){
					return true;
				}else{
					return false;
				}
			},

			/**
			 * @method create 
			 * @description creates a new namespace with the given name
			 * @param  {string} name - the name of the namespace
			 * @param  {object} [root] - an optional root namespace if this parameter is not set the new namespace will be created inside the globale space
			 * @return {object} returns the create namespace
			 */
			create : function(name, root){
				if(!this.validate(name)){
					throw new Error("'" + name + "' is not a valid Namespace name!");
				}
				root = root || global;
				root[name] = {};
				return root[name];
			},

			/**
			 * @method exists
			 * @description checks if a namespace exists
			 * @param  {string} name - a string with the namespace name
			 * @param  {object} [root] - an optional object with the root namepsace
			 * @return {boolean} returns true if the namespace existes otherwise false
			 */
			exists : function(name, root){
				root = root || global;
				if(root[name]){
					return true;
				}
				return false;
			},

			/**
			 * @method addCode 
			 * @description adds code to the end of the given namespace chain, non existing namespaces will be created
			 * @param {string} chainName - a string with the namespaces seperated by .
			 * @param {mixed} code - the code
			 */
			addCode : function(chainName, code){
				var parts = chainName.split('.');
				var root = global;
				for(var i = 0; i < parts.length - 1; i++){
					var part = parts[i];
					if(!this.exists(part, root)){
						root = this.create(part, root);
					}else{
						root = root[part];
					}
				}
				root[parts[parts.length -1]] = code;
			}
		}
	}();

	Mold.prototype.Core.SeedTypeManager = function(){
		var _seedTypeIndex = {};

		return {
			/**
			 * @method validateSeedType 
			 * @description validates a seed type object
			 * @param  {object} type - a seed type object
			 * @throws {SeedTypeError} if the type object miss mandantory properties
			 */
			validate: function(type){
				if(!type.name){
					throw new SeedTypeError('SeedType \'name\' is not defined!');
				}

				if(!type.create){
					throw new SeedTypeError('SeedType \'create\' is not defined! [' + type.name + ']');
				}

				if(typeof type.create !== 'function'){
					throw new SeedTypeError('SeedType \'create\' is not a function! [' + type.name + ']');
				}


			},

			/**
			 * @property {number} len 
			 * @description returns the amount of stored seed types
			 */
			get count(){
				return Object.keys(_seedTypeIndex).length;
			},

			set count(value){
				throw new Error("the property 'len' is not writeable! [Mold.Core.SeedTypeManger]");
			},

			/**
			 * @method addSeedType 
			 * @description adds a new seed type
			 * @param {object} type - expects a seed typ object
			 */
			add : function(type){
				this.validate(type);
				_seedTypeIndex[type.name] = type;
			},

			/**
			 * @method removeSeedType 
			 * @description removes a seed type by name
			 * @param  {type} name - the seed type name
			 */
			remove : function(name){
				var type = _seedTypeIndex[name];
				if(type && typeof type.destruct === 'function'){
					type.destruct();
				}
				delete _seedTypeIndex[name];
			},

			/**
			 * @method getSeedType 
			 * @description returns a seed type object by the given name
			 * @param  {string} name - a string with the name
			 * @return {name} returns the seed type obejct or null with no object was found
			 */
			get : function(name){
				return _seedTypeIndex[name] || null;
			}
		}

	}();


	Mold.prototype.Core.DependencyManager = function(){
		var _dependenyPropertys = {};

		return {
			check : function(seed){

			},
			addDependencyProperty : function(name){
				_dependenyPropertys = true;
			},
		}
	}();

	/**
	 * @module Mold.Core.SeedStates 
	 * @description includes all available seed states
	 * @type {enum}
	 */
	Mold.prototype.Core.SeedStates = {
		LOADING : 1,
		PREPARSING : 2,
		INITIALISING : 3,
		TRANSPILING : 4,
		PENDING : 5,
		EXECUTING : 6,
		READY : 7, 
		ERROR : 8, 
	}


	/**
	 * @module Mold.Core.SeedFlow 
	 * @static
	 * @description static module provides methods to control the seed flow
	 */
	Mold.prototype.Core.SeedFlow = function(){

		var _stateFlows = {};
		var _afterFlow = {};

		return {
			/**
			 * @method on 
			 * @description adds a flow middleware to the seed flow
			 * @param  {number} state - the state where the middleware should be executed
			 * @param  {function} action - the middleware action
			 * @return {this} returns this for chaining
			 */
			on : function(state, action){
				_stateFlows[state] = _stateFlows[state] || [];
				_stateFlows[state].push(action);
				return this;
			},

			/**
			 * @method onAfter
		 	 * @description adds a after-flow middleware to the seed flow, use this to change the state of a seed
			 * @param  {number} state - the state where the middleware should be executed
			 * @param  {function} action - the middleware action
			 * @return {this} returns this for chaining
			 */
			onAfter : function(state, action){
				_afterFlow[state] = action;
				return this;
			},

			/**
			 * @method exec 
			 * @description starts to execute the seed flow for thegiven seed
			 * @param  {object} seed - the seed
			 * @param  {number} [index] - the index of the current states middleware, this property is optional if not set the index is 0
			 * @return {this} returns this for chaining
			 */
			exec : function(seed, index){
				var index = index || 0;
				if(!_stateFlows[seed.state] || !_stateFlows[seed.state][index]){
					if(_afterFlow[seed.state]){
						index = null;
						var flow = _afterFlow[seed.state];
					}else{
						return;
					}
				}else{
					var flow = _stateFlows[seed.state][index];
				}

				var done = function(){
					var next = (index === null) ? null : index + 1;
					this.exec(seed, next);
				}.bind(this);

				flow(seed, done);

				return this;
			}
		}
	}();

	/**
	 * @module Mold.Core.Config 
	 * @description provides methods to load, set and get configuration file and params
	 * @static
	 */
	Mold.prototype.Core.Config = function(){

		var _configValue = {
			'config-path' : '',
			'config-name' : 'mold.json'
		}

		var _isReady = false;
		var _readyCallbacks = [];

		var _executeIsReady = function(data){
			_isReady = true;
			while(_readyCallbacks.length){
				var callback = _readyCallbacks.pop();
				callback(data);
			}
		}
		
		return {
			/**
			 * @method set 
			 * @description set a configuration parameter
			 * @param {sting} name - the parameter name
			 * @param {mixed} value - the parameter value
			 */
			set : function(name, value){
				_configValue[name] = value;
				return this;
			},

			/**
			 * @method get 
			 * @description returns a configuration parameter
			 * @param  {string} name - the parameters name
			 * @return {mixed} returns the parameter value
			 */
			get : function(name){
				return _configValue[name] || null;
			},

			/**
			 * @method init 
			 * @description initialize the config, loads a configuration file
			 * @return {promise} returns a (psydo-) promise 
			 */
			init : function(){
				var that = this;

				_configValue['config-path'] = Mold.prototype.Core.Initializer.getParam('config-path') || _configValue['config-path'];
				_configValue['config-name'] = Mold.prototype.Core.Initializer.getParam('config-name') || _configValue['config-name'];

				var configFile = new Mold.prototype.Core.File(_configValue['config-path'] + _configValue['config-name']);
				var promise = configFile.load();
				
				promise
					.then(function(data){
						data = JSON.parse(data);
						for(var prop in data){
							that.set(prop, data[prop]);
						}
						_executeIsReady(data);
					})
					.fail(function(err){
						throw new Error("Configuration file not found: '" + _configValue['config-path'] + _configValue['config-name'] + "'");
					})
				
				return promise;
			},

			isReady : function(callback){
				if(_isReady){
					callback();
				}else{
					_readyCallbacks.push(callback);
				}
			}

		}
	}();

	Mold.prototype.Core.Initializer = function(){
		var _params = ['config-name', 'config-path'];
		var _availableParams = {};

		var _getBrowserParam = function(name){
			var param = document.currentScript.getAttribute(name);
			return param || null;
		}

		var _getNodeParam = function(name){
			var argFound = false, value = null;
			for(var i = 0; i < process.argv.length; i++){
				if(argFound){
					value = process.argv[i];
					break;
				}
				if(process.argv[i] === name){
					argFound = true;
				}
			}
			return value;
		}

		return {
			init : function(){
				_availableParams = this.getInitParams();
			},
			getParam : function(name){
				return _availableParams[name] || null;
			},
			getInitParams : function(){
				var output = {};
				_params.forEach(function(entry){
					var result = null;

					if(_isNodeJS){
						result = _getNodeParam(entry);
					}else{
						result = _getBrowserParam(entry);
					}

					if(result){
						output[entry] = result;
					}
				});

				return output;
			}
		}
	}();


	/**
	 * @module Mold.Core.File
	 * @description creates a class calls File wich allows to ready a file on the full stack (node/browser) with the same API
	 * @return {class} returns a File class 
	 */
	Mold.prototype.Core.File = function(filename){

		var _rejected = [];
		var _resolved = [];
		var _data = null;
		var _error = null;
		var undefined;

		var _resolve = function(data){
			var resolve;
			while(resolve = _resolved.shift()){
				resolve(data);
			}
		}

		var _reject = function(err){
			var reject;
			while(reject = _rejected.shift()){
				reject(err);
			}
		}

		var _test = function(){
			if(_data){
				_resolve(_data);
			}
			if(_error){
				_reject(_error);
			}
		}

		var _ajaxLoader = function(){
			var xhr;

			if(XMLHttpRequest !== undefined){
			 	xhr = new XMLHttpRequest();
			}else{
				var versions = [
					"MSXML2.XmlHttp.5.0", 
					"MSXML2.XmlHttp.4.0",
					"MSXML2.XmlHttp.3.0", 
					"MSXML2.XmlHttp.2.0",
					"Microsoft.XmlHttp"
				];
				for(var i = 0; i < versions.length; i++) {
					try {
						xhr = new ActiveXObject(versions[i]);
						break;
					}
					catch(e){}
				}
			}

			xhr.onreadystatechange = function(){
				if(xhr.readyState < 4) {
					return;
				}

				switch(xhr.status){
					case 404:
						_error = "File not found! [" + filename + "]"; 
						break;
				}

				if(xhr.readyState === 4 && xhr.status === 200) {
					_data = xhr.response;
				}

				_test();  
			}

			xhr.open('GET', filename, true);
			xhr.send()	
		}

		var _nodeLoader = function(){
			var fs = require('fs');
			if(!fs.existsSync(filename)){
				_error = "File not found! [" + filename + "]";
				_test();
				return;
			}

			fs.readFile(filename, 'utf8', function (err, data) {
				if(err){
					_error = err;
				}
				if(data){
					_data = data;
				}
				_test();
				console.log("DATA", data)
			})
		}

		/**
		 * @method load 
		 * @description loads the specified file
		 * @return {object} returns a thenabel object with
		 */
		this.load = function(){
			if(Mold.isNodeJS){
				_nodeLoader();
			}else{
				_ajaxLoader();
			}
			return {
				then : function(onresolve){
					_resolved.push(onresolve);
					_test();
					return this;
				},
				fail : function(onfail){
					_rejected.push(onfail);
					_test();
					return this;
				}
			}
		}
	}


/** INIT DEFAULT CONFIGURATION */
	Mold.prototype.init = function(){
		var that = this;
		
		//default seed typs
		this.Core.SeedTypeManager.add({
			name : 'static',
			create : function(seed){
				return seed.code();
			}
		});

		this.Core.SeedTypeManager.add({
			name : 'data',
			create : function(seed){
				return seed;
			}
		});

		//for compatibility with 0.0.1*, don't use this
		this.Core.SeedTypeManager.add({
			name : 'class',
			preCreating : function(seed){
				return seed;
			},
			create : function(seed){
				if(seed.extend){
					seed = Mold.extend(seed.extend, seed)
				}
			
				return Mold.wrap(seed.code, function(that){
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
			}
		});

		this.Core.SeedTypeManager.add({
			name : 'module',
			create : function(seed){
				var module = {
					_exports : null,
					get exports() {
						return this._exports;
					},
					set exports(exported){
						this._exports = exported;
					}
				}

				seed.code.call(seed, module);

				return module.exports;
			}
		});
		
		//configurate seed flow
		this.Core.SeedFlow
			.on(this.Core.SeedStates.LOADING, function(seed, done){
				that.Core.Config.isReady(function(){
					console.log("do LOADING");
					done()	
				})
			})
			.onAfter(this.Core.SeedStates.LOADING, function(seed, done){
				console.log("AFTER LOADING", done.toString())
				seed.state = that.Core.SeedStates.PREPARSING
				done();
			})
			.on(this.Core.SeedStates.PREPARSING, function(seed, done){
				console.log("do PREPARSING");
				done()
			})
			.onAfter(this.Core.SeedStates.PREPARSING, function(seed, done){
				seed.state = that.Core.SeedStates.INITIALISING
				done();
			})
			.on(this.Core.SeedStates.INITIALISING, function(seed, done){
				console.log("do INITIALISING");
				done()
			})
			.onAfter(this.Core.SeedStates.INITIALISING, function(seed, done){
				seed.state = that.Core.SeedStates.TRANSPILING;
				done();
			})
			.on(this.Core.SeedStates.TRANSPILING, function(seed, done){
				console.log("do TRANSPILING");
				done()
			})
			.onAfter(this.Core.SeedStates.TRANSPILING, function(seed, done){
				seed.state = that.Core.SeedStates.PENDING;
				done();
			})
			.on(this.Core.SeedStates.PENDING, function(seed, done){
				console.log("do PENDING");
				done()
			})
			.onAfter(this.Core.SeedStates.PENDING, function(seed, done){
				seed.state = that.Core.SeedStates.EXECUTING;
				done();
			})
			.on(this.Core.SeedStates.EXECUTING, function(seed, done){
				console.log("do EXECUTING");
				done()
			})
			.onAfter(this.Core.SeedStates.EXECUTING, function(seed, done){
				seed.state = that.Core.SeedStates.READY;
				done();
			})
			.on(this.Core.SeedStates.ERROR, function(seed, done){
				throw new Error("ERROR: " + ((seed.error) ? seed.error : "") + "[" + seed.name + "]");
				done()
			})


		console.log("INITIALISING")

		this.Core.Initializer.init();
		this.Core.Config.init() ;
	}

	global._Mold = Mold;

	var Mold = new Mold();


	global.Mold = Mold;
	console.log("LOAD Mold")

})((typeof global !== 'undefined') ? global : this);

