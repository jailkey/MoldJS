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

		this.ready = this._reCreateReadyPromise();

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
			var seed;
			if((seed = this.Core.SeedManager.get(name))){
				var output = new this.Core.Promise(false, { throwError : true, name : "Mold.load" });
				return output.resolve(seed);
			}

			var seed = this.Core.SeedFactory({
				name : name,
				state : this.Core.SeedStates.LOADING
			});

			this.Core.SeedFlow.exec(seed);
			return seed.isReady;
		},

		_reCreateReadyPromise : function (){
			this.ready = new this.Core.Promise(false, { throwError : true, name : "_reCreateReadyPromise" }).all([
				this.Core.Config.isReady,
				this.Core.SeedManager.isReady
			])
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
	 * @module Mold.Core.Promise 
	 * @description implements a Promise A+
	 * @param {function} 
	 */
	Mold.prototype.Core.Promise = function Promise(setup, conf){

		var _state = "pending",
			_value = false,
			_callbacks = [],
			undefined;

		var PromiseError = function(message){
			return {
				name : "PromiseError",
				message : message
			}
		}

		var _changeState = function(state, value){
			
			if ( _state === state ) {
				throw Error("can't transition to same state: " + state);
			}

			if ( 
				_state === "fulfilled" 
				|| _state === "rejeced" 
			) {
				throw Error("can't transition from current state: " + state);
			}

			if (
				state === "fulfilled" 
				&& arguments.length < 2 
			) {
				throw Error("transition to fulfilled must have a non null value");
			}

			if ( 
				state === "rejeced"
				&& value === null 
			) {
				throw Error("transition to rejected must have a non null reason");
			}

			_state = state;
			_value = value;
			_resolve();
			return _state;
		};

		var _resolve = function(){

			if ( _state === "pending" ) {
				return false;
			}

			Mold.eachShift(_callbacks, function(callbackObject){
				var nextCall = (_state === "fulfilled") ? callbackObject.onFulFilled : callbackObject.onRejected;
				if(typeof nextCall !== "function" ){

					callbackObject.promise.changeState(_state, _value );
				}else{

					try {
						var value = nextCall.call(null, _value);
						if (value && typeof value.then === 'function' ){
							value.then(function(value){
								callbackObject.promise.changeState("fulfilled", value);
							}, function(error){
								callbackObject.promise.changeState("rejected", error);
							});

						}else{
							callbackObject.promise.changeState("fulfilled", value);
						}
					}catch(error){
						if(conf.throwError){
							throw new Error(error + ((conf.name) ? " " + conf.name : "" ) + " \n " + nextCall.toString());
						}
						callbackObject.promise.changeState("rejected", error);
						
						throw error.stack;
					}
				}
			});
		
		};

		var _then = function(onFulFilled, onRejected){

			var promise = new Promise(),
				that = this;

			_async(function(){
				_callbacks.push({
					onFulFilled : onFulFilled,
					onRejected : onRejected,
					promise : promise
				});
				_resolve();
			});

			return promise;
		}


		var _fulfill = function(value){
			_changeState("fulfilled", value );
		}

		var _reject = function(reason){
			_changeState( "reject", reason );
		}

		if(setup && typeof setup === "function"){
			setup.call(null, _fulfill, _reject);
		}

		var _async = function(callback) {
			setTimeout(callback, 5);
		};

		return {
			changeState : _changeState,
			async : _async,
		/**
		 * @method state 
		 * @description returns the current state possible values are reject, fulfilled, reject
		 * @return {string} returns a string with current state
		 */
			state : function(){
				return _state;
			},

		/**
		 * @method all 
		 * @description returns a promise wich will be resolved when all promises in the given list are resolved  
		 * @param  {[type]} promises [description]
		 * @return {[type]}          [description]
		 */
			all : function(promises){
				var fullfillCount = 0;
				console.log("ALL PROMISES", promises)
				var promise = new Promise(function(fullfill, resolve){
					var fullfillAll = function(){
						
						fullfillCount++;
						console.log("full fill all", fullfillCount, promises.length)
						if(fullfillCount === promises.length){
							
							fullfill();
						}
					}
					for(var i = 0; i < promises.length; i++){
						promises[i].then(
							fullfillAll,
							resolve
						);
					}
				});
				return promise;
			},
			fail : function(onfail){
				return _then(undefined, onfail);
			},
			success : function(onsuccess){
				return _then(onsuccess, undefined);
			},
			catch : function(onfail){
				return _then(undefined, onfail);
			},
			then : function(onFulFilled, onRejected){
				return _then(onFulFilled, onRejected);
			},
			reject : function(reason) {
				_reject(reason);
			},
			fulfill : function(value){
				_fulfill(value);
			},
			resolve : function(value){
				if(value && typeof value.then === "function"){
					var promise = new Promise(function(resolve, reject){
						value.then(resolve, reject);
					})
					return promise
				}
				_fulfill(value);
				return this;
			}
		}
	};


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
	Mold.prototype.Core.SeedFactory = function SeedFactory(conf){

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

			this._state = properties.state || Mold.Core.SeedStates.INITIALISING;
			this.path = null;
			this.fileData = null;
			this._sid = Mold.getId();
			this._isCreatedPromise = new Mold.Core.Promise(false, { throwError : true, name : "_isCreatedPromise" });
			this.isReady = new Mold.Core.Promise(false, { throwError : true, name : "isReady" });
			this.dependenciesLoaded = new Mold.Core.Promise(false, { throwError : true, name : "dependenciesLoaded" });
			
			this._dependenciesAreLoaded = false;
			var that = this;
			
			this.dependenciesLoaded.then(function(){
				that._dependenciesAreLoaded = true;
			});

			this.dependencies = [];
			this.injections = {};
		}

		Seed.prototype = {
			get sid(){
				return this._sid;
			},

			set sid(sid){
				throw new Error("The property 'sid' is not writeable! [Mold.Core.SeedManager]");
			},

			/**
			 * @method state 
			 * @description get for the state property
			 * @return {number} returns the current state
			 */
			get state(){
				return this._state;
			},

			set state(state){
				this._state = state;
				if(state === Mold.Core.SeedStates.READY){
					this.isReady.resolve(this);
					console.log("CHECK READY", this.name)
					Mold.Core.SeedManager.checkReady();
				}
			},


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

			addInjection : function(injection){
				for(var inject in injection){
					if(!this.injections[inject]){
						this.injections[inject] = injection[inject];
					}
				}
			},

			/**
			 * @property isLoaded 
			 * @description true if the seed is loaded
			 * @return {boolean} 
			 */
			get isLoaded(){
				return (this.state > Mold.Core.SeedStates.LOADING) ? true : false;
			},

			/**
			 * @method load 
			 * @description loads the seed if it is not loaded
			 * @return {promise}
			 */
			load : function(){
				if(!this.isLoaded){
					this.path = Mold.Core.Pathes.getPathFromName(this.name);
					var file = new Mold.Core.File(this.path);
					var promise = file.load();
					var that = this;

					promise
						.then(function(data){
							that.fileData = data;
						})
						.fail(function(){
							throw new SeedError("Can not load seed: '" + that.path + "'! [" + that.name + "]");
						})

					return promise;
				}
			},

			getDependecies : function(){
				Mold.Core.DependencyManager.find(this);
				return this.dependenciesLoaded;
			},

			checkDependencies : function(){
				if(Mold.Core.DependencyManager.checkDependencies(this) && !this._dependenciesAreLoaded){
					this.dependenciesLoaded.resolve(this.dependencies);
				}
				return this;
			},

			catched : function(info, code){
				
				if(this.code){
					throw new SeedError("The seed code is allready created! [" + this.name + "]");
				}
				
				this.code = code;

				for(var prop in info){
					if(prop !== "name"){
						this[prop] = info[prop];
					}
				}
				this._isCreatedPromise.resolve(this);
			},

			create : function(){
				if(!this.fileData){
					throw new SeedError("Can not created script without file data! [" + this.name + "]");
				}
				var fileData = "(function() { var Seed = function(info, code) { Mold.Core.SeedManager.catchSeed(info, code, " + this.sid + ")}\n" + this.fileData + "})()";
				if(_isNodeJS){
					var func = new Function(fileData);
					func();
				}else{
					this.scriptFile = document.createElement('script');
					this.scriptFile.src = 'data:text/javascript,' + encodeURIComponent(fileData)
					document.body.appendChild(this.scriptFile);
				}
				return this._isCreatedPromise;
			},

			/**
			 * [execute description]
			 * @return {[type]} [description]
			 */
			execute : function(){

				var typeHandler = Mold.Core.SeedTypeManager.get(this.type);
				if(!typeHandler){
					throw new SeedError("SeedType '" + this.type + "' not found! [" + this.name + "]")
				}
				if(!this.code){
					throw new SeedError("Code property is not defined! [" + this.name + "]")
				}

				if(Object.keys(this.injections).length){
					var closure = "return (function() { \n";
					for(var inject in this.injections){
						closure += "	var " + inject + " = " + this.injections[inject] + "; \n" ;
					}
					closure += " return " + this.code.toString() + ";})();"
					this.code = new Function(closure);
				}

				Mold.Core.NamespaceManager.addCode(this.name, typeHandler.create(this));
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
		var _readyPromise = new Mold.prototype.Core.Promise(false, { throwError : true });
		var _isReady = false;

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
				throw new Error("The property 'count' is not writeable! [Mold.Core.SeedManager]");
			},

			getBySid : function(sid){
				return Mold.find(_seeds, function(seed){
					return (seed.sid === sid) ? true : false;
				});
			},

			catchSeed : function(seedInfo, seedCode, ident){
				var seed;
				if(seedInfo.name){
					seed = this.get(seedInfo.name);
					//if no seed found with this name create a new one
					if(!seed){
						seed = Mold.Core.SeedFactory({
							name : seedInfo.name,
							state : Mold.Core.SeedStates.PENDING,

						});
						this.add(seed);
						seed.catched(seedInfo, seedCode);
						Mold.Core.SeedFlow.exec(seed)
						return this;
					}
				}else{
					//if no name is defined get seed by ident
					seed = this.getBySid(ident);
				}
				if(seed){
					seed.catched(seedInfo, seedCode);
				}
				return this;
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

			each : function(callback){
				for(var name in _seedIndex){
					callback(_seedIndex[name], name)
				}
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
			},

			/**
			 * @method checkReady 
			 * @description checks if all seeds has the state ready
			 * @return {boolean} returns true if all seeds are ready otherwise it returns false
			 */
			checkReady : function(){
				var i = 0, len = _seeds.length;
				for(; i < len; i++){
					if(_seeds[i].state !== Mold.Core.SeedStates.READY){
						return false;
					}
				}

				//resolve promise and create a new one
				_readyPromise.resolve(_seeds);
				_readyPromise = new Mold.Core.Promise(false, { throwError : true });
				this.isReady = _readyPromise;
				Mold._reCreateReadyPromise();
				
				return true;
			},

			/**
			 * @properts isReady 
			 * description returns a promise which will resolved if all seeds are ready
			 * @return {Boolean} [description]
			 */
			isReady : _readyPromise
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
			 * @property {number} count 
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

			/**
			 * @method find 
			 * @description find all dependecy properties inside the seed and add them as dependencx
			 * @param  {[type]} seed the seed
			 */
			find : function(seed){
				for(var prop in _dependenyPropertys){
					if(seed[prop]){
						if(Array.isArray(seed[prop])){
							for(var i = 0; i < seed[prop].length; i++){
								if(Mold.isObject(seed[prop][i])){
									for(var injection in seed[prop][i]){
										seed.addInjection(seed[prop][i]);
										seed.addDependency(seed[prop][i][injection]);
									}
								}else{
									seed.addDependency(seed[prop][i]);
								}
							}
						}
					}
				}
				return this;
			},

			/**
			 * @method checkDependencies 
			 * @description checks if all dependencies are loaded
			 * @param  {Seed} seed - the seed to check
			 * @return {boolean} returns true if all dependecies are loaded, otherwise false
			 */
			checkDependencies : function(seed){
				var output = true;
				for(var i = 0; i < seed.dependencies.length; i++){
					var depSeed = Mold.Core.SeedManager.get(seed.dependencies[i]);
					if(depSeed){
						if(depSeed.state !== Mold.Core.SeedStates.READY){
							output = false;
						}
					}else{
						Mold.load(seed.dependencies[i]);
						output = false;
					}
				}
				return output;
			},


			checkAll : function(){
				Mold.Core.SeedManager.each(function(seed){
					seed.checkDependencies()
				})
				return this;
			},

			/**
			 * @method addDependencyProperty 
			 * @description adds a dependency property
			 * @param {string} name - name of the property
			 */
			addDependencyProperty : function(name){
				if(!_dependenyPropertys[name]){
					_dependenyPropertys[name] = true;
				}
				return this;
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
		PARSING : 3,
		INSPECTING : 4,
		VALIDATING : 5,
		TRANSPILING : 6,
		INITIALISING : 7,
		PENDING : 8,
		EXECUTING : 9,
		READY : 10, 
		ERROR : 11, 
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

		var _isReady = new Mold.prototype.Core.Promise(false, { throwError : true });
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
			 * @description returns a configuration property
			 * @param  {string} name - the parameters name
			 * @return {mixed} returns the parameter value
			 */
			get : function(name){
				return _configValue[name] || null;
			},

			getAll : function(){
				return _configValue;
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
						_isReady.resolve(data);
					})
					.fail(function(err){
						throw new Error("Configuration file not found: '" + _configValue['config-path'] + _configValue['config-name'] + "'");
					})
				
				return promise;
			},

			isReady : _isReady

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
	 * @module Mold.Core.Pathes 
	 * @description provides methods to transform an generate pathes
	 */
	Mold.prototype.Core.Pathes = function(){
		var _pathHandler = {};

		return {

			/**
			 * @method on 
			 * @description registers a path parsing function for a specific path type
			 * @param  {string} type - the path type    
			 * @param  {Function} callback - the function that should be executed on this type of pathes 
			 */
			on : function(type, callback){
				_pathHandler[type] = callback;
				return this;
			},

			/**
			 * @method getPathFromName 
			 * @description translite a seed loading string into a path
			 * @param  {string} name - the string to convert
			 * @return {string} returns a seed path
			 */
			getPathFromName : function(name){
				var type = 'mold';
				if(~name.indexOf(":")){
					var parts = name.split(":");
					type = parts[0];
					name = parts[1];
				}
				
				if(!_pathHandler[type]){
					throw new Error("Path type '" + type + "' is not supported!");
				}

				return _pathHandler[type](name);
			}
		}
	}();

	/**
	 * @modul Mold.Core.Preprocessor 
	 * @description provides methods for adding / removing and executing preprozessor scripts
	 */
	Mold.prototype.Core.Preprocessor = function(){
		var _preprocessors = {};

		var _getParams = function(args){
			var output = {};
			args = args.replace(/(\S*?)([\s]*?)(=)([\s]*)(\S*)/gm, function(){
				return arguments[1] + arguments[3] + arguments[5];
			})
			var parts = args.split(" ");
			for(var i = 0; i < parts.length; i++){
				if(parts[i] === ""){
					continue;
				}
				if(~parts[i].indexOf("=")){
					var paramParts = parts[i].split("=");
					output[paramParts[0]] = paramParts[1];
				}else{
					output[parts[i]] = true;
				}
			}
			return output;
		}

		var _processCommand = function(command, action, seed){
			var regString = "\\/\\/!" + command + "([\\s\\S]*?)$";
			var regExp = new RegExp(regString, "gm");
			var undefined;
			seed.fileData = seed.fileData.replace(regExp, function(all, params){
				var parameter = _getParams(params);
				var result = action(parameter, seed);
				if(result === undefined){
					return all;
				}else{
					
					return result
				}
			})
		}

		return {
			/**
			 * @method add 
			 * @description adds a new preprocessor
			 * @param {string} name - pre processor name
			 * @param {function} code - pre processor script
			 */
			add : function(name, code){
				_preprocessors[name] = code;
				return this;
			},

			/**
			 * @method remove 
			 * @description removes a preprocessor by name
			 * @param {string} name - name of the preprocessor
			 */
			remove : function(name){
				delete _preprocessors[name];
				return this;
			},
			
			/**
			 * @method exec 
			 * @description execute all preprocessors on a seed
			 * @param  {[type]} seed - the seed that should be preprocessed
			 */
			exec : function(seed){
				for(var command in _preprocessors){
					_processCommand(command, _preprocessors[command], seed);
				}
				return this;
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
			})
		}

		/**
		 * @method load 
		 * @description loads the specified file
		 * @return {object} returns a thenabel object with
		 */
		this.load = function(){
			if(_isNodeJS){
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

		/**
		 * @deprecated
		 */
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

		//add dependecy properties
		this.Core.DependencyManager
			.addDependencyProperty('include');

		//configurate default path handling
		this.Core.Pathes.on('mold', function(name){
			var parts = name.split('.');
			console.log(that.Core.Config.getAll())
			var repoPath = that.Core.Config.get("repositories")[parts[0]];
			if(!repoPath){
				throw new Error("No path for repository '" + parts[0] + "' found!")
			}
			var path = repoPath + "/";
			parts.shift();
			path += parts.join('/');

			return path + '.js';
		});

		//add some default preprocessors
		this.Core.Preprocessor
			.add('seedInfo', function(parameter, seed){
				for(var prop in parameter){
					seed[prop] = parameter[prop];
				}
				return;
			});
		
		//configurate seed flow
		this.Core.SeedFlow
			.on(this.Core.SeedStates.LOADING, function(seed, done){
				that.Core.Config.isReady.then(function(){
					console.log("do LOADING");
					seed.load().then(function(){
						Mold.Core.SeedManager.add(seed);
						done()
					});
				})
			})
			.onAfter(this.Core.SeedStates.LOADING, function(seed, done){
				console.log("AFTER LOADING", done.toString())
				seed.state = that.Core.SeedStates.PREPARSING;

				done();
			})
			.on(this.Core.SeedStates.PREPARSING, function(seed, done){
				that.Core.Preprocessor.exec(seed);
				console.log("do PREPARSING");
				done()
			})
			.onAfter(this.Core.SeedStates.PREPARSING, function(seed, done){
				//if seed is already transpiled skip transpiling step
				if(seed.transpiled){
					seed.state = that.Core.SeedStates.INITIALISING;
				}else{
					seed.state = that.Core.SeedStates.TRANSPILING;
				}
				console.log("seed", seed)
				done();
			})
			.on(this.Core.SeedStates.TRANSPILING, function(seed, done){
				console.log("do TRANSPILING");
				done()
			})
			.onAfter(this.Core.SeedStates.TRANSPILING, function(seed, done){
				seed.state = that.Core.SeedStates.INITIALISING;
				done();
			})
			.on(this.Core.SeedStates.INITIALISING, function(seed, done){
				console.log("do INITIALISING");
				seed.create().then(function(){
					console.log("IS CREATED")
					done()	
				})
				
			})
			.onAfter(this.Core.SeedStates.INITIALISING, function(seed, done){
				seed.state = that.Core.SeedStates.PENDING;
				done()
				
			})
			.on(this.Core.SeedStates.PENDING, function(seed, done){
				console.log("do PENDING", seed.name);
				seed.getDependecies();
				seed.checkDependencies();
				seed.dependenciesLoaded.then(function(){
					done();
				});
			
			})
			.onAfter(this.Core.SeedStates.PENDING, function(seed, done){
				seed.state = that.Core.SeedStates.EXECUTING;
				done();
			})
			.on(this.Core.SeedStates.EXECUTING, function(seed, done){
				seed.execute();
				console.log("EXECUTE ", seed.name)
				done()
			})
			.onAfter(this.Core.SeedStates.EXECUTING, function(seed, done){
				seed.state = that.Core.SeedStates.READY;
				
				
				done();
			})
			.on(that.Core.SeedStates.READY, function(seed, done){
				that.Core.DependencyManager.checkAll();
				done();
			})
			.on(this.Core.SeedStates.ERROR, function(seed, done){
				throw new Error("ERROR: " + ((seed.error) ? seed.error : "") + "[" + seed.name + "]");
				done()
			})


		this.Core.Initializer.init();
		this.Core.Config.init() ;
	}

	global._Mold = Mold;

	var Mold = new Mold();


	global.Mold = Mold;
	console.log("LOAD Mold")

})((typeof global !== 'undefined') ? global : this);

