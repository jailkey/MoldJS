"use strict";
(function(){
	var global = this;

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

		this.states = {
			LOADING : 1,
			INITIALISING : 2,
			TRANSPILING : 3,
			PENDING : 4,
			EXECUTING : 5,
			READY : 6, 
			ERROR : 7, 
		}

		this.stateFlows = {};
		for(var state in this.states){
			this.stateFlows[this.states[state]] = [];
		}

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

		/**
		 * @method seedFactory 
		 * @description creates a seed object from a configuration
		 * @param  {object} seedConf - the cofiguration object can contain the following properties
		 *                           - 'name' the name of the seed including the full object path, this property is mandatory
		 *                           - 'dna' the seed dna, the dna describes the way how the module will be executed
		 *                           - 'code' the code of the seed, this property is mandatory
		 * @return {object} seedObject - returns a seed object with the config properties plus the following methods and properties
		 *                             - 'state' the current state of the seed
		 */
		seedFactory : function(seedConf){
			if(!seedConf){
				throw new Error("seedConf must be defined!");
			}

			if(typeof seedConf !== 'object'){
				throw new Error("seedConf must be an object!");
			}

			var seedPrototype = {
				_id : this.getId(),
				_oldState : null,
				_currentState : null,
				_changedState : false,
				stateHasChanged : function(){
					var output = this._changedState;
					this._changedState = false;
					return output;
				}
			}

			Object.defineProperty(
				seedPrototype,
				'state', {
					get : function(){
						return this._currentState;
					},
					set : function(state){
						this._currentState = state;
						if(this._currentState !== this._oldState){
							this._oldState = this._currentState
						}
					}
				}
			)
			
			seedPrototype.state = this.states.INITIALISING;

			return this.mixin(seedPrototype, seedConf);
		},
		
		/**
		 * @method validateSeed 
		 * @description validates a seed object throws an error if the object is invalid else
		 */
		validateSeed : function(seed){

			if(!seed.name){
				throw new SeedError('Seed name property is not defined!');
			}

			if(!seed.state){
				throw new SeedError('Seed state property is not defined! [' + seed.name + ']');
			}

			if(!seed.type){
				throw new SeedError('Seed type is not defined! [' + seed.name + ']');
			}

			if(!this.seedTypeIndex[seed.type]){
				throw new SeedError('SeedType \'' + seed.type + '\' does not exist! [' + seed.name + ']');
			}

			if(!this.isValidState(seed.state)){
				throw new SeedError('Seed state "' + seed.state + '" is not valid! [' + seed.name + ']');
			}

			if(seed.state > this.states.LOADING && !seed.code){
				throw new SeedError('Seed code property is not defined! [' + seed.name + ']');
			}

			if(seed.state > this.states.TRANSPILING && typeof seed.code !== 'function'){
				throw new SeedError('Seed code property must be a function! [' + seed.name + ']');
			}
			
			return true;
		},


		/**
		 * @method addSeed 
		 * @description adds a new seed to Mold
		 * @param {object} seed - the seed
		 */
		addSeed : function(seed){
			this.validateSeed(seed);
			if(this.seedIndex[seed.name] && !seed.overwrite){
				return;
			}
			this.seeds.push(seed);
			this.seedIndex[seed.name] = seed;
			seed.state = this.states.PENDING;
			this.checkSeedFlow();
		},
		
		/**
		 * @method removeSeed 
		 * @description removes a seed from Mold
		 * @param  {object|string} a seed object or a seed name
		 */
		removeSeed : function(seed){
			var name = (typeof seed === 'object') ? seed.name : seed;
			delete this.seedIndex[name];
			for(var i = 0; i < this.seeds.length; i++){
				if(this.seeds[i].name === name){
					this.seeds.splice(i, 1);
					return;
				}
			}
		},

		executeSeed : function(seed){
			seed.state = this.states.EXECUTING;
			var seedType = this.getSeedType(seed.type);
			this.addCodeToNamespace(seed.name, seedType.create(seed));
			seed.state = this.states.READY;
		},

		checkDependencies : function(seed){
			for(var i = 0; i < seed.dependencies.length; i++){
				var dep =  seed.dependencies[i];
				if(!this.seedIndex[dep] || this.seedIndex[dep].state !== this.states.READY ){
					return false;
				}
			}
			return true;
		},


/** STATE FLOW HANDLING **/
		/**
		 * @method checkSeedFlow 
		 * @description checks the state flow of the seeds
		 */
		checkSeedFlow : function(){
			var i = 0, len = this.seeds.length;
			for(; i < len; i++){
				var seed = this.seeds[i];
				//if(seed.stateHasChanged()){
					var flows = null;
					for(var state in this.stateFlows){
						if(flows = this.stateFlows[state]){
							for(var y = 0; y < flows.length; y++){
								flows[y].call(this, seed);
							}
						}
					}
				//}
				
			}
		},

		isValidState : function(checkState){
			for(var state in this.states){
				if(this.states[state] === checkState){
					return true;
				}
			}
			return false;
		},

		addStateFlow : function(state, code){
			console.log("adds state", this.stateFlows, state)
			this.stateFlows[state].push(code.bind(this));
		},

		getStateFlows : function(name){
			return this.stateFlows[name] || null;
		},

/** SEED TYPE HANDLING **/
		
		/**
		 * @method validateSeedType 
		 * @description validates a seed type object
		 * @param  {object} type - a seed type object
		 * @throws {SeedTypeError} if the type object miss mandantory properties
		 */
		validateSeedType: function(type){
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
		 * @method addSeedType 
		 * @description adds a new seed type
		 * @param {object} type - expects a seed typ object
		 */
		addSeedType : function(type){
			this.validateSeedType(type);
			this.seedTypeIndex[type.name] = type;
		},

		/**
		 * @method removeSeedType 
		 * @description removes a seed type by name
		 * @param  {type} name - the seed type name
		 */
		removeSeedType : function(name){
			var type = this.seedTypeIndex[name];
			if(type && typeof type.destruct === 'function'){
				type.destruct();
			}
			delete this.seedTypeIndex[name];
		},

		/**
		 * @method getSeedType 
		 * @description returns a seed type object by the given name
		 * @param  {string} name - a string with the name
		 * @return {name} returns the seed type obejct or null with no object was found
		 */
		getSeedType : function(name){
			return this.seedTypeIndex[name] || null;
		},
		
/** NAMESPACE HANDLING **/

		/**
		 * @method validateNamespaceName 
		 * @description checks if the given name is a valid Mold namespace name
		 * @param  {string} name - a string with the name
		 * @return {boolean} returns true if the name is valid and false if not 
		 */
		validateNamespaceName : function(name){
			if(/^[A-Z]{1}[a-z|A-Z]*$/.test(name)){
				return true;
			}else{
				return false;
			}
		},

		/**
		 * @method createNamespace 
		 * @description creates a new namespace with the given name
		 * @param  {string} name - the name of the namespace
		 * @param  {object} [root] - an optional root namespace if this parameter is not set the new namespace will be created inside the globale space
		 * @return {object} returns the create namespace
		 */
		createNamespace : function(name, root){
			if(!this.validateNamespaceName(name)){
				throw new Error("'" + name + "' is not a valid Namespace name!");
			}
			root = root || global;
			root[name] = {};
			return root[name];
		},

		/**
		 * @method namespaceExists 
		 * @description checks if a namespace exists
		 * @param  {string} name - a string with the namespace name
		 * @param  {object} [root] - an optional object with the root namepsace
		 * @return {boolean} returns true if the namespace existes otherwise false
		 */
		namespaceExists : function(name, root){
			root = root || global;
			if(root[name]){
				return true;
			}
			return false;
		},

		/**
		 * @method addCodeToNamespace 
		 * @description adds code to the end of the given namespace chain, non existing namespaces will be created
		 * @param {string} chainName - a string with the namespaces seperated by .
		 * @param {mixed} code - the code
		 */
		addCodeToNamespace : function(chainName, code){
			var parts = chainName.split('.');
			var root = global;
			for(var i = 0; i < parts.length - 1; i++){
				var part = parts[i];
				if(!this.namespaceExists(part, root)){
					root = this.createNamespace(part, root);
				}else{
					root = root[part];
				}
			}
			root[parts[parts.length -1]] = code;
		},



	

/**  OBJECT HANDLING  **/
	 	/**
		* @methode mixin
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
		}

	}


/** INIT DEFAULT CONFIGURATION */
	Mold.prototype.init = function(){

		//default seed typs
		this.addSeedType({
			name : 'static',
			create : function(seed){
				return seed.code();
			}
		});

		this.addSeedType({
			name : 'data',
			create : function(seed){
				return seed;
			}
		});


		this.addStateFlow(this.states.PENDING, function(seed){
			if(seed.dependencies){
				if(this.checkDependencies(seed)){
					this.executeSeed(seed);
				}
			}else{
				console.log("EXECUTE SEED")
				this.executeSeed(seed);
			}
		})
	}


	var Mold = new Mold();


	global.Mold = Mold;

}).call(this);
console.log(Mold)