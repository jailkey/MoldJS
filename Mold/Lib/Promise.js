"use strict";
Seed({
		name : "Mold.Lib.Promise",
		dna : "class"
	},
	function(setup){

		var _state = "pending",
			_value = false,
			_callbacks = [],
			undefined;

		var _changeState = function(state, value){

			if ( _state === state ) {
				throw new Error("can't transition to same state: " + state);
			}

			if ( 
				_state === "fulfilled" 
				|| _state === "rejeced" 
			) {
				throw new Error("can't transition from current state: " + state);
			}

			if (
				state === "fulfilled" 
				&& arguments.length < 2 
			) {
				throw new Error("transition to fulfilled must have a non null value");
			}

			if ( 
				state === "rejeced"
				&& value === null 
			) {
				throw new Error("transition to rejected must have a non null reason");
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

			Mold.each(_callbacks, function(callbackObject){

				var nextCall = (_state === "fulfilled") ? callbackObject.onFulFilled : callbackObject.onRejected;
				if(typeof nextCall !== "function" ){	
					callbackObject.promise.changeState( _state, _value );

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
			}
		}
	}
);