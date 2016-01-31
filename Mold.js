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
	if(!_isNodeJS){
		var _currentScript = document.currentScript || (function() {
			var scripts = document.getElementsByTagName('script');
			return scripts[scripts.length - 1];
		})();
	}



/** MOLD CONTRUCTOR */
	var Mold = function Mold(){
		
		//create storages
		this.seeds = [];
		this.seedIndex = {};
		this.seedTypeIndex = {};

		this.Errors = {
			SeedError : SeedError,
			DNAError : DNAError,
			SeedTypeError : SeedTypeError
		}

		this.EXIT = '---exit---';

		this.isNodeJS = _isNodeJS;

		this.ready = this._reCreateReadyPromise();

		this.init();
	}

	var __Mold = Mold.prototype;
	
	Mold.prototype = {
		/**
		* @methode getId
		* @desc returns a uinque ID 
		* @return (Object) - returns the uinque ID
		**/
		ident : 0,
		getId : function (){
			this.ident++;
			return this.ident;
		},

/** SEED HANDLING */


		load : function(name){
			var seed;
			if((seed = this.Core.SeedManager.get(name))){
				return seed.isReady;
			}

			var seed = this.Core.SeedFactory({
				name : name,
				state : this.Core.SeedStates.NEW
			});

			this.Core.SeedFlow.exec(seed);
			return seed.isReady;
		},

		_reCreateReadyPromise : function (){
			this.ready = new this.Core.Promise(false, { throwError : true }).all([
				this.Core.Config.isReady,
				this.Core.SeedManager.isReady
			])
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
		    __Mold.each(target, function(element, key, obj){
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
				if(__Mold.isNode(obj) && !handleAsObject){
				
					if(!!window.MutationObserver){
						var observer = new MutationObserver(function(mutations) {
							__Mold.each(mutations, function(mutation) {
								
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

	__Mold = Mold.prototype;

	//Build-in core modules
	Mold.prototype.Core = {};


/**
	 * @module Mold.Core.Promise 
	 * @description implements a Promise A+
	 * @param {function} 
	 */
	Mold.prototype.Core.Promise = function Promise(setup, config){

		var _state = "pending",
			_value = false,
			_callbacks = [],
			undefined,
			config = config || {};

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
		
			_callbacks.eachShift(function(callbackObject){
				var nextCall = (_state === "fulfilled") ? callbackObject.onFulFilled : callbackObject.onRejected;
				if(typeof nextCall !== "function" ){

					callbackObject.promise.changeState(_state, _value);
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
						callbackObject.promise.changeState("rejected", error);

						if(config.throwError){
							console.log("THROW", error)
							throw error;
						}
					}
				}
			});
		
		};

		var _then = function(onFulFilled, onRejected){

			var promise = new Promise(false, config),
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
				var result = [];
				var promise = new Promise(function(fullfill, resolve){
					var fullfillAll = function(data){
						result.push(data);
						fullfillCount++;
						if(fullfillCount === promises.length){
							fullfill(result);
						}
					}
					for(var i = 0; i < promises.length; i++){
						if(!promises[i].then){
							console.log("IST KEIN PROMISE", promises[i])
						}
						promises[i].then(
							fullfillAll,
							resolve
						);
					}
				}, config);

				return promise;
			},

			/**
			 * @method fail 
			 * @description the given onfail callback will be called when the promise will be rejected
			 * @param  {function} onfail the onfail callback
			 */
			fail : function(onfail){
				return _then(undefined, onfail);
			},

			/**
			 * @method then 
			 * @description executes the given callbacks when the promise will be resolved / rejected
			 * @param  {[type]} onFulFilled  - will be executed if the will resolved
			 * @param  {[type]} onRejected  - will be executed if the will rejected
			 */
			then : function(onFulFilled, onRejected){
				return _then(onFulFilled, onRejected);
			},

			/**
			 * @method success 
			 * @description the give callback will called if the promise will be resolved
			 * @param  {[type]} onsuccess - the onsuccess callback
			 */
			success : function(onsuccess){
				return _then(onsuccess, undefined);
			},

			/**
			 * @method catch
			 * @alias for fail
			 */
			catch : function(onfail){
				return _then(undefined, onfail);
			},

			/**
			 * @method reject 
			 * @description rejects the current promise
			 * @param  {mixed} reason - a error message
			 */
			reject : function(reason) {
				_reject(reason);
			},

			/**
			 * @method resolve 
			 * @description] resolves the given promise
			 * @param  {mixed} value - a value
			 */
			resolve : function(value){
				if(value && typeof value.then === "function"){
					var promise = new Promise(function(resolve, reject){
						value.then(resolve, reject);
					}, config)
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

			this.path = null;
			this.fileData = null;
			this._sid = __Mold.getId();
			this._isCreatedPromise = new __Mold.Core.Promise(false, { throwError : true });
			this.isReady = new __Mold.Core.Promise(false, { throwError : true });
			this._isReady = false;
			this.dependenciesLoaded = new __Mold.Core.Promise(false, { throwError : true });
			
			this._dependenciesAreLoaded = false;
			var that = this;
			
			this.dependencies = [];
			this.injections = {};
			this._state = properties.state || __Mold.Core.SeedStates.INITIALISING;

			//append propetises
			for(var prop in properties){
				this[prop] = properties[prop];
			}
			
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
				if(state === __Mold.Core.SeedStates.READY && !this._isReady){
					this.isReady.resolve(this);
					__Mold.Core.SeedManager.checkReady();
					this._isReady = true;
				}
			},


			/**
			 * @method  hasDependency 
			 * @description checks if a specific dependency exists
			 * @param  {string}  name - the name of the dependency
			 * @return {boolean} returns true if the seed has the given dependency otherwise it return false
			 */
			hasDependency : function(name){
				return this.dependencies.find(function(value){
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
				return (this.state > __Mold.Core.SeedStates.LOADING) ? true : false;
			},

			/**
			 * @method load 
			 * @description loads the seed if it is not loaded
			 * @return {promise}
			 */
			load : function(){
				if(!this.isLoaded){
					this.path = __Mold.Core.Pathes.getPathFromName(this.name);
					var file = new __Mold.Core.File(this.path);
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
				__Mold.Core.DependencyManager.find(this);
				return this.dependenciesLoaded;
			},

			checkDependencies : function(){
				var that = this;
				__Mold.Core.DependencyManager.checkDependencies(this).then(function(){
					that.dependenciesLoaded.resolve(that.dependencies);
					that._dependenciesAreLoaded = true;
				})
				return this.dependenciesLoaded;
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
			 * @method execute 
			 * @description executes the seed, injects dependencies if defined and add it to the name space
			 * @return {[type]} [description]
			 */
			execute : function(){
				var typeHandler = __Mold.Core.SeedTypeManager.get(this.type);
				if(!typeHandler){
					console.log("seedType not found", this.name, this.type)
					throw new SeedError("SeedType '" + this.type + "' not found! [" + this.name + "]")
				}
				if(!this.code){
					throw new SeedError("Code property is not defined! [" + this.name + "]")
				}

				if(Object.keys(this.injections).length){
					var closure = "//" + this.name;
					for(var inject in this.injections){
						closure += "	var " + inject + " = " + this.injections[inject] + "; \n" ;
					}
					closure += " return " + this.code.toString();
					this.code = new Function(closure)();
				}

				__Mold.Core.NamespaceManager.addCode(this.name, typeHandler.create(this));
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
		var _readyPromise = new __Mold.Core.Promise(false, { throwError : true });
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

			/**
			 * @method getBySid 
			 * @description returns a seed be the given seed id, if no seed is found it returns undefined
			 * @param  {number} sid - the seed id
			 * @return {mixed} returns a seed or undefined
			 */
			getBySid : function(sid){
				return _seeds.find(function(seed){
					return (seed.sid === sid) ? true : false;
				});
			},

			/**
			 * @method catchSeed 
			 * @description catches a seed and ad the catched information to the registerd seed
			 * @param  {object} seedInfo - an object with seed informations
			 * @param  {function} seedCode - the code of the seed
			 * @param  {number} [ident] -  the seed id
			 */
			catchSeed : function(seedInfo, seedCode, ident){
				var seed;
				if(seedInfo.name){
					seed = this.get(seedInfo.name);
					//if no seed found with this name create a new one
					if(!seed){
						seed = __Mold.Core.SeedFactory({
							name : seedInfo.name,
							state : __Mold.Core.SeedStates.PENDING,

						});
						this.add(seed);
						seed.catched(seedInfo, seedCode);
						__Mold.Core.SeedFlow.exec(seed)
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
				return this;
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
			 * @method each 
			 * @description iterates through the all added seeds and executes a callback per seed with the as argument
			 * @param  {dunction} callback - a function with the seed as argument
			 */
			each : function(callback){
				for(var name in _seedIndex){
					callback(_seedIndex[name], name)
				}

				return this;
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
				return this;
			},

			/**
			 * @method checkReady 
			 * @description checks if all seeds has the state ready
			 * @return {boolean} returns true if all seeds are ready otherwise it returns false
			 */
			checkReady : function(){
				var i = 0, len = _seeds.length;
				for(; i < len; i++){
					if(_seeds[i].state !== __Mold.Core.SeedStates.READY){
						return false;
					}
				}

				//resolve promise and create a new one
				_readyPromise.resolve(_seeds);
				_readyPromise = new __Mold.Core.Promise(false, { throwError : true });
				this.isReady = _readyPromise;
				__Mold._reCreateReadyPromise();
				
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
				return this;
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

		var _getRelativeDependencies = function(dep, seed){
			var depParts = dep.split(".");
			var seedName = seed.name;
			
			if(depParts[0] === ""){
				
				var nameParts = seedName.split(".");
				depParts.shift();
				nameParts.pop();
				return nameParts.concat(depParts).join('.');
			}

			return dep;
		}

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

								if(__Mold.isObject(seed[prop][i])){

									for(var injection in seed[prop][i]){
										seed[prop][i][injection] = _getRelativeDependencies(seed[prop][i][injection], seed)
										seed.addInjection(seed[prop][i]);
										seed.addDependency(seed[prop][i][injection]);
									}
								}else{
									seed.addDependency(_getRelativeDependencies(seed[prop][i], seed));
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
			
				var seedsLoades = [];

				for(var i = 0; i < seed.dependencies.length; i++){
					var depSeed = __Mold.Core.SeedManager.get(seed.dependencies[i]);
					if(depSeed){
						seedsLoades.push(depSeed.isReady);
					}else{
						var promise =  __Mold.load(seed.dependencies[i]);

						seedsLoades.push(promise);
					}
				}
	
				var promise = new __Mold.Core.Promise(false, { throwError : true });
				if(seedsLoades.length){
					promise = promise.all(seedsLoades, { throwError : true });
				}else{
					promise.resolve();
				}
				return promise;
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
		NEW : 1,
		LOADING : 2,
		LOADED : 2,
		PREPARSING : 3,
		PARSING : 4,
		INSPECTING : 5,
		VALIDATING : 6,
		TRANSPILING : 7,
		INITIALISING : 8,
		PENDING : 9,
		EXECUTING : 10,
		READY : 11, 
		ERROR : 12, 
	}


	/**
	 * @module Mold.Core.SeedFlow 
	 * @static
	 * @description static module provides methods to control the seed flow
	 */
	Mold.prototype.Core.SeedFlow = function(){

		var _stateFlows = {};
		var _afterFlow = {};
		var _executedSeedFlows = {};

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
				if(_executedSeedFlows[seed.name] && _executedSeedFlows[seed.name][seed.state] >= index){
					return;
				}
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

				_executedSeedFlows[seed.name] = _executedSeedFlows[seed.name] || {};
				_executedSeedFlows[seed.name][seed.state] = index;
				flow(seed, done);

				return this;
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
			},

			/**
			 * @method getMoldPath 
			 * @description returns the path current Mols.js path
			 * @return {string} returns a string
			 */
			getMoldPath : function(){
				if(_isNodeJS){
					var path = require("path");
					return path.relative(process.cwd(), __dirname) + "/"
				}else{
					var path = _currentScript.getAttribute('src');
					if(~path.indexOf("/")){
						path = path.substring(0, path.lastIndexOf("/") + 1);
					}else{
						path = "";
					}
					return path;
				}
			},

			/**
			 * @method getCurrentPath 
			 * @description returns the current relative path
			 * @return {string} returns the current relative path
			 */
			getCurrentPath : function(){
				return "";
			},

			/**
			 * @method exists 
			 * @description checks if a path exists
			 * @platform node
			 * @param  {string} path - the path to check
			 * @param  {string} type - the path type to check, possible values are 'file' and 'dir'
			 * @return {boolean} returns true if the path exists otherwise false 
			 */
			exists : function(path, type){
				if(_isNodeJS){
					var fs = require('fs');
					try{
						var stats = fs.lstatSync(path);
						switch(type){
							case 'file' :
								return stats.isFile();
							case 'dir' :
								return stats.isDirectory();
						}

						return false;
					}catch(e){
						return false;
					}
					return false;
				}
				return true;
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
			local : {
				'config-path' : __Mold.Core.Pathes.getCurrentPath(),
				'config-name' : 'mold.json'
			},
			global : {
				'config-path' : __Mold.Core.Pathes.getMoldPath(),
				'config-name' : 'mold.json',
			}
		}

		var _defaultType = 'local';

		var _isReady = new __Mold.Core.Promise(false, { throwError : true });
		var _readyCallbacks = [];

		var _executeIsReady = function(data){
			_isReady = true;
			while(_readyCallbacks.length){
				var callback = _readyCallbacks.pop();
				callback(data);
			}
		}
		
		return {
			switchConfig : function(type){
				_defaultType = type;
			},

			/**
			 * @method set 
			 * @description set a configuration parameter
			 * @param {sting} name - the parameter name
			 * @param {mixed} value - the parameter value
			 */
			set : function(name, value, type){
				type = type || _defaultType;
				_configValue[type] = _configValue[type] || {};
				_configValue[type][name] = value;
				return this;
			},

			/**
			 * @method get 
			 * @description returns a configuration property
			 * @param  {string} name - the parameters name
			 * @return {mixed} returns the parameter value
			 */
			get : function(name, type){
				var undefined;
				type = type || _defaultType;
				if(!_configValue[type]){
					throw new Error("Config type '" + type + "' is not defined!")
				}
				return (_configValue[type][name] === undefined) ? null : _configValue[type][name];
			},

			/**
			 * @method getAll 
			 * @description returns the hole configuration file
			 * @param  {string} [type] - optional the type of configuration possible values are 'local' and 'global' 
			 * @return {[type]}      [description]
			 */
			getAll : function(type){
				if(type){
					return _configValue[type];
				}
				return _configValue;
			},

			/**
			 * @method loadConfig 
			 * @description loads a configuration file 
			 * @param  {string} path - path to the configuration file
			 * @param  {string} type - type of the configuration (local/global)
			 * @return {promise} returns a promise which will be resolved when the configuration file ist loaded
			 */
			loadConfig : function(path, type){
				type = type || _defaultType;
				
				var that = this;
				var configFile = new __Mold.Core.File(path);
				var promise = configFile.load();

				promise
					.then(function(data){
						data = JSON.parse(data);
						for(var prop in data){
							that.set(prop, data[prop], type);
						}
					})
					.fail(function(err){
						throw new Error("Configuration file not found: '" + path + "'!");
					})

			
				return promise;
			},

			/**
			 * @method init 
			 * @description initialize the config, loads a configuration file
			 * @return {promise} returns a (psydo-) promise 
			 */
			init : function(){
				var that = this;

				var configPath = __Mold.Core.Initializer.getParam('config-path') || this.get('config-path', _defaultType);
				var configName = __Mold.Core.Initializer.getParam('config-name') || this.get('config-name', _defaultType);
				var promise = this.loadConfig(configPath + configName);
				
				//use two config files (if exists) only on node
				if(_isNodeJS){
					//if a local file exists load also the local once
					var localConfigPath = this.get('config-path', 'global');
					var localConfigName = this.get('config-name', 'global');
					var fs = require('fs');
					try {
						var stats = fs.lstatSync(localConfigPath + localConfigName);
						if(stats.isFile()){
							return new __Mold.Core.Promise(function(resolve, reject){
								promise.then(function(data){
									var localPromise = that.loadConfig(configPath + configName, 'global');

									localPromise.then(function(localData){
										_isReady.resolve([localData, data]);
										resolve([localData, data]);
									});
								});
							}, { throwError : true });
						}
					}catch(e){}
					
				}

				promise.then(function(data){
					_isReady.resolve(data);
				});

				return promise;
			},

			isReady : _isReady

		}
	}();

	/**
	 * @namespace PolyFillManger 
	 * @description handles polyfills, use this to avoid problems with overwriting
	 */
	Mold.prototype.Core.PolyFillManger = function(){
		var _polyFills = {};

		return {
			/**
			 * @method add 
			 * @description adds a polyfill
			 * @param {string} name - name of the pollyfill
			 * @param {code} code - poly fillcode
			 */
			add : function(polyfill){
				if(!polyfill.name){
					throw new Error("Polyfill 'name' is not defined");
				}
				if(!polyfill.code){
					throw new Error("Polyfill 'code' is not defined");
				}
				if(_polyFills[polyfill.name]){
					throw new Error("Polyfill '" + name + "' already exists!");
				}
				_polyFills[polyfill.name] = polyfill;
				if(!polyfill.object || !polyfill.method){
					_polyFills[polyfill.name].code();
				}else{
					if(!polyfill.object.prototype[polyfill.method]){
						_polyFills[polyfill.name].code();
					}
				}
				return this;
			}
		}
	}()

	Mold.prototype.Core.Initializer = function(){
		var _params = ['config-name', 'config-path', 'global-config-name', 'global-config-path'];
		var _availableParams = {};
		var _cliArguments = [];

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

		var _intiCliCommands = function(){
			var command = { name : null, parameter : {} }, getValue = false;
			for(var i = 0; i < process.argv.length; i++){
				var part = process.argv[i];

				if(part.startsWith('--')){
					command.paramenter[part.substring(2, part.length)] = true;
					getValue = false;
				}else if(part.startsWith('-')){
					command.paramenter[part.substring(1, part.length)] = "";
					getValue = true;
				}else if(getValue){
					command.paramenter[command.paramenter.length - 1] += getValue;
				}else if('+'){
					_cliArguments.push(command);
					command = { name : null, parameter : {} };
					getValue = false;
				}else{
					command.name = part;
					getValue = false;
				}
			}
		}

		return {
			isCLI : function(){

			},
			init : function(){
				_availableParams = this.getInitParams();
				if(_isNodeJS){
					_intiCliCommands();
				}
			},
			getParam : function(name){
				return _availableParams[name] || null;
			},
			getCLIArguments : function(){
				return _cliArguments;
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
	 * @modul Mold.Core.Preprocessor 
	 * @description provides methods for adding / removing and executing preprozessor scripts
	 */
	Mold.prototype.Core.Preprocessor = function(){
		var _preprocessors = [];

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

		var _getCommandActions = function(command, seed){
			var actions = []
			var regString = "\\/\\/!" + command + "([\\s\\S]*?)$";
			var regExp = new RegExp(regString, "gm");
			seed.fileData.replace(regExp, function(all, params){
				actions.push({ parameter  : _getParams(params) });
				return all;
			});
			return actions;
		}

		var _applyCommand = function(command, actions, seed){
			var count = -1;
			var regString = "\\/\\/!" + command + "([\\s\\S]*?)$";
			var regExp = new RegExp(regString, "gm");
			seed.fileData = seed.fileData.replace(regExp, function(all){
				count++;
				if(actions[count].result){
					return actions[count].result;
				}
				return all;
			});
		}

		var _processCommand = function(command, action, seed, done){
			var regString = "\\/\\/!" + command + "([\\s\\S]*?)$";
			var regExp = new RegExp(regString, "gm");
			var undefined;
			seed.fileData = seed.fileData.replace(regExp, function(all, params){
				var parameter = _getParams(params);
				var result = action(parameter, seed, done);
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
				_preprocessors.push({
					name : name,
					code : code
				});
				return this;
			},

			/**
			 * @method remove 
			 * @description removes a preprocessor by name
			 * @param {string} name - name of the preprocessor
			 */
			remove : function(name){
				for(var i = 0; i < _preprocessors.length; i++){
					if(_preprocessors[i].name === name){
						_preprocessors.splice(i, 1);
						break;
					}
				}
				return this;
			},
			
			/**
			 * @method exec 
			 * @description execute all preprocessors on a seed
			 * @param  {[type]} seed - the seed that should be preprocessed
			 */
			exec : function(seed){
				return new __Mold.Core.Promise(function(resolve){
					var i = 0;
					var next = function(){
						var process = _preprocessors[i] || null;
						if(process){
							var actions = _getCommandActions(process.name, seed);
							var y = 0;
							var nextAction = function(){
								var action = actions[y] || null;
								if(!action){
									_applyCommand(process.name, actions, seed)
									i++;
									next();
									return;
								}

								var done = function(result){
									action.result = result;
									y++
									nextAction();
								}

								process.code(action.parameter, seed, done) 

							}.bind(this)
							nextAction();
						}else{
							resolve(seed);
						}

					}.bind(this);
					next();
				}, { throwError : true });
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

			try {
				var stats = fs.lstatSync(filename);
				if(stats.isFile()) {
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
			}catch(e){
				_error = "File not found! [" + filename + "]";
				_test();
			}
		
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
		__Mold = this;

		//add polyfills
		this.Core.PolyFillManger
			.add({
				name : 'String.startsWith',
				code : function(){
					String.prototype.startsWith = function(searchString, position) {
						position = position || 0;
						return this.indexOf(searchString, position) === position;
					};
				},
				object : String,
				method : 'startsWith'
			})

			.add({
				name : 'String.endsWith',
				code : function(){
					String.prototype.endsWith = function(searchString, position) {
						var subjectString = this.toString();
						if(typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
							position = subjectString.length;
						}	
						position -= searchString.length;
						var lastIndex = subjectString.indexOf(searchString, position);
						return lastIndex !== -1 && lastIndex === position;
					};
				},
				object : String,
				method : 'endsWith'
			})
			
			.add({
				name : 'Array.find',
				code : function(){
					Array.prototype.find = function(predicate) {
						if (this == null) {
							throw new TypeError('Array.prototype.find called on null or undefined');
						}
						if (typeof predicate !== 'function') {
							throw new TypeError('predicate must be a function');
						}
						var list = Object(this);
						var length = list.length >>> 0;
						var thisArg = arguments[1];
						var value;
						for (var i = 0; i < length; i++) {
							value = list[i];
							if (predicate.call(thisArg, value, i, list)) {
								return value;
							}
						}
						return undefined;
					};
				},
				object : Array,
				method : 'find'

			})

			/**
			 * @polyfill eachShift
			 * @description iterates through an array and remove the selected item until the array is empty
			 * @param {array} collection the array
			 * @param  {function} callback  method will called on each entry, given paramter is the entry value           
			 */
			.add({
				name : 'Array.eachShift', 
				code : function(){
					Array.prototype.eachShift = function(predicate){
						if (this == null) {
							throw new TypeError('Array.prototype.eachShift called on null or undefined');
						}
						if (typeof predicate !== 'function') {
							throw new TypeError('predicate must be a function');
						}
						while(this.length){
							var selected = this.shift();
							predicate.call(this, selected);
						}
						return this;
					}
				},
				object : Array,
				method : 'eachShift'
			})
		
		//default seed typs
		this.Core.SeedTypeManager
			.add({
				name : 'action',
				create : function(seed){
					return seed.code();
				}
			})
			.add({
				name : 'static',
				create : function(seed){
					return seed.code;
				}
			})
			.add({
				name : 'data',
				create : function(seed){
					return seed.code;
				}
			})
			.add({
				/**
				 * @deprecated
				 */
				//for compatibility with 0.0.1*, don't use this
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
			var createPath = function(confType){
				var parts = name.split('.');
				var conf = that.Core.Config.get("repositories", confType)
				if(!conf && confType === "global"){
					throw new Error("No repositiories in " + confType + " config' found! [" + name + "]")
				}
				var repoPath = that.Core.Config.get("repositories", confType)[parts[0]];
				if(!repoPath && confType === "global"){
					throw new Error("No path for repository '" + parts[0] + "' found! [" + name + "]")
				}
				var path = repoPath + "/";
				parts.shift();
				path += parts.join('/') + '.js';
	
				if(!that.Core.Pathes.exists(path) && confType !== 'global'){
					return createPath('global');
				}
				return path;
			}

			return createPath('local');
			
		});

		//add some default preprocessors
		this.Core.Preprocessor
			.add('info', function(parameter, seed, done){
				for(var prop in parameter){
					seed[prop] = parameter[prop];
				}
				done();
			})
			.add('include', function(parameter, seed, done){
				if(parameter.seed){
					Mold.load(parameter.seed).then(function(loaded){
						var codeString = loaded.code.toString();
						codeString = codeString.substring(codeString.indexOf("{") + 1, codeString.lastIndexOf("}"));
						//console.log(codeString)
						done(codeString);
					})
				}else{
					done();
				}
			});
		
		//configurate seed flow
		this.Core.SeedFlow
			.on(this.Core.SeedStates.NEW, function(seed, done){
				Mold.Core.SeedManager.add(seed);
				that.Core.Config.isReady.then(function(){
					seed.state = that.Core.SeedStates.LOADING;
					seed.load().then(function(){
						seed.state = that.Core.SeedStates.LOADED;
						done()
					});
				})
			})
			.on(this.Core.SeedStates.LOADED, function(seed, done){
				done();
			})
			.onAfter(this.Core.SeedStates.LOADED, function(seed, done){
				//console.log("AFTER LOADING");
				seed.state = that.Core.SeedStates.PREPARSING;
				done();
			})
			.on(this.Core.SeedStates.PREPARSING, function(seed, done){
				//console.log("do PREPARSING");
				that.Core.Preprocessor.exec(seed).then(done);
			})
			.onAfter(this.Core.SeedStates.PREPARSING, function(seed, done){
				//if seed is already transpiled skip transpiling step
				if(seed.transpiled){
					seed.state = that.Core.SeedStates.INITIALISING;
				}else{
					seed.state = that.Core.SeedStates.TRANSPILING;
				}
				done();
			})
			.on(this.Core.SeedStates.TRANSPILING, function(seed, done){
				//console.log("do TRANSPILING", seed.name);
				done()
			})
			.onAfter(this.Core.SeedStates.TRANSPILING, function(seed, done){
				seed.state = that.Core.SeedStates.INITIALISING;
				done();
			})
			.on(this.Core.SeedStates.INITIALISING, function(seed, done){
				//console.log("do INITIALISING");
				seed.create().then(function(){
				//	console.log("IS CREATED")
					done()	
				})
				
			})
			.onAfter(this.Core.SeedStates.INITIALISING, function(seed, done){
				seed.state = that.Core.SeedStates.PENDING;
				done()
				
			})
			.on(this.Core.SeedStates.PENDING, function(seed, done){
				//console.log("do PENDING", seed.name);
				seed.getDependecies();
				seed.checkDependencies().then(function(){
					done();
				});
			
			})
			.onAfter(this.Core.SeedStates.PENDING, function(seed, done){
				seed.state = that.Core.SeedStates.EXECUTING;
				done();
			})
			.on(this.Core.SeedStates.EXECUTING, function(seed, done){
				//console.log("EXECUTING", seed.name, seed.state)
				seed.execute();
				done()
			})
			.onAfter(this.Core.SeedStates.EXECUTING, function(seed, done){
				seed.state = that.Core.SeedStates.READY;
				done();
			})
			.on(that.Core.SeedStates.READY, function(seed, done){
				//console.log("SEED READY", seed.name)

				done();
			})
			.on(this.Core.SeedStates.ERROR, function(seed, done){
				throw new Error("ERROR: " + ((seed.error) ? seed.error : "") + "[" + seed.name + "]");
				done()
			});
		

		this.Core.Initializer.init();
		this.Core.Config.init();
		//register core seeds 
		this.Core.SeedManager
			.add(
				this.Core.SeedFactory({
					name : "Mold.Core.SeedManager",
					state : this.Core.SeedStates.READY,
					code : this.Core.SeedManager
				})
			)
			.add(
				this.Core.SeedFactory({
					name : "Mold.Core.SeedFactory",
					state : this.Core.SeedStates.READY,
					code : this.Core.SeedFactory
				})
			)
			.add(
				this.Core.SeedFactory({
					name : "Mold.Core.Promise",
					state : this.Core.SeedStates.READY,
					code : this.Core.Promise
				})
			)
			.add(
				this.Core.SeedFactory({
					name : "Mold.Core.File",
					state : this.Core.SeedStates.READY,
					code : this.Core.File
				})
			)
			.add(
				this.Core.SeedFactory({
					name : "Mold.Core.Pathes",
					state : this.Core.SeedStates.READY,
					code : this.Core.Pathes
				})
			)
			.add(
				this.Core.SeedFactory({
					name : "Mold.Core.Initializer",
					state : this.Core.SeedStates.READY,
					code : this.Core.Initializer
				})
			)
			.add(
				this.Core.SeedFactory({
					name : "Mold.Core.Config",
					state : this.Core.SeedStates.READY,
					code : this.Core.Config
				})
			)
	}

	global._Mold = Mold;

	var Mold = new Mold();


	global.Mold = Mold;
	console.log("LOAD Mold")

})((typeof global !== 'undefined') ? global : this);
