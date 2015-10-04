"use strict";
/**
 * @method Mold.Lib.Promise
 * @description creates a new promise
 * @param {function} setup a function
 */
Seed({
		name : "Mold.Lib.Promise",
		dna : "class",
		test : "Mold.Test.Lib.Promise"
	},
	function(setup){

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
						
						callbackObject.promise.changeState("rejected", error);
						
						throw error.stack;
					}
				}
			});
		
		};

		var _then = function(onFulFilled, onRejected){

			var promise = new Mold.Lib.Promise(),
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

		this.publics = {
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
				var promise = new Mold.Lib.Promise(function(fullfill, resolve){
					var fullfillAll = function(){
						fullfillCount++;
						if(fullfillCount === promises.length){
							fullfill.call();
						}
					}
					Mold.each(promises, function(prom){
						prom.then(
							fullfillAll,
							resolve
						);
					});
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
					var promise = new Mold.Lib.Promise(function(resolve, reject){
						value.then(resolve, reject);
					})
					return promise
				}
				_fulfill(value);
				return this;
			}
		}
	}
);