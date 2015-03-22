Seed({
		name : "Mold.Tools.Test.TDD",
		dna : "class",
		include : [
			"Mold.Lib.Sequence",
			"Mold.Lib.Event"
		]
	},
	function(test){
		"use strict";
		//test root object
		var _rootTest = {
			type : "root",
			description : "test root",
			action : function(){},
			parent : parent || false,
			error : false,
			success : false,
			children : []
		}

		var _parent = null,
			_reporter = [],
			_that = this,
			_timeOut = 1000;

		Mold.mixin(this, new Mold.Lib.Event(this));

		var _now = function(){
			if(performance){
				return performance.now();
			}else{
				if(Date.now){
					return Date.now();
				}else{
					return Date().getTime();
				}
			}
		}

		/**
		 * _hasFunctionParameter
		 * @description checks if a function has parameter
		 * @param  {function}  func the function
		 * @return {Boolean} return true or false
		 */
		var _hasFunctionParameter = function(func){

			func = func.toString();
			func = func.substring(0, func.lastIndexOf("}")+1);

			var pattern = new RegExp("function\\s*\(([\\s\\S]*?)\)\\s*\{([\\s\\S]*?)\}$", "g"),
				matches = pattern.exec(func);

			if(matches){
				var parameter = matches[2];

				parameter = parameter.replace("(", "").replace(")", "");
				
				if(Mold.trim(parameter)){
					return true;
				}
			}
			return false;
		}

		/**
		 * [_addTest description]
		 * @param {object} test [description]
		 * {
		 * 	type : "describe/it",
		 * 	caller : "func",
		 * 	description : "descripton",
		 * 	error : "description"
		 * 	success : "descripion"
		 * 	children : [],
		 * 	parent : object,
		 * }
		 */
		var _testCounter = 0;
		var _addTest = function(type, description, action, parent){
			_testCounter++;
			var test = {
				type : type,
				description : description,
				action : action,
				parent : parent || false,
				error : false,
				success : false,
				children : []
			}
			if(parent){
				parent.children.push(test);
			}else{
				_rootTest.children.push(test)
			}
		}

		var _spys = {};
		var _spyOn = function(object, method){

			var spyApi = {
				name : "spy",
				hasBeenCalled : false,
				arguments : false,
				object : object,
				method : method,
				returnValue : null
			}

			var oldFunc = object[method];
			//console.log("create spy", object, method)
			object[method] = function(getspy){
				if(getspy === "--getspy"){
					return spyApi;
				}
				spyApi.hasBeenCalled = true;
				spyApi.arguments = arguments;
				if(spyApi.returnValue !== null){
					return spyApi.returnValue;
				}
				return oldFunc.apply(null, arguments);
			}
			return _expect(object[method]);
		}

		var _describe = function(description, action){
			_addTest("describe", description, action, _parent);
		}

		var _it = function(description, action){
			_addTest("it", description, action, _parent);
		}

		var _before = function(description, action){
			if(typeof description === "function"){
				action = description
				description = '';
			}
			_addTest("before", description, action, _parent);
		}

		

		var _beforeEach = function(description, action){
			if(typeof description === "function"){
				action = description
				description = '';
			}
			_addTest("beforeEach", description, action, _parent);
		}

		var _after = function(description, action){
			if(typeof description === "function"){
				action = description
				description = '';
			}
			_addTest("after", description, action, _parent);
		}

		var _afterEach = function(description, action){
			if(typeof description === "function"){
				action = description
				description = '';
			}
			_addTest("afterEach", description, action, _parent);
		}

		var _getTestByType = function(type, children){
			return Mold.find(children, function(value){
				if(value.type === type){
					return value;
				}
				return false;
			})
		}

		/**
		 * _execAsync
		 * @description executes a test ansychonous
		 * @param  {object}   test
		 * @param  {object}   context 
		 * @param  {function} callback 
		 * @return {void} 
		 */
		
		var _timeoutList = {};
		var _clearTimeout = function(test){
			var timeout = test.type + test.description;
			if(_timeoutList[timeout]){
				clearTimeout( _timeoutList[timeout]);
				delete _timeoutList[timeout];
			}
		}

		var _execAsync = function(test, context, callback){
			_timeoutList[test.type + test.description] = setTimeout(function(){
				test.success = false;
				test.error = "Timeout in '" + (test.description ? test.description : test.type )+  "'!";
				callback.call(context);
			}, _timeOut);

			var withTimeout = function(){
				//console.log("CALL", test.description, callback.toString())
				callback.call(context);
				_clearTimeout(test);
			}

			test.action.call(context, withTimeout);
		}

		var _isTestContext = function(test){
			var contexts = ["it", "describe"];
			return Mold.contains(contexts, test.type)
		}

		/**
		 * _nextChild
		 * @description 
		 * @param  {object} parent     [description]
		 * @param  {number} level      [description]
		 * @param  {object} context    [description]
		 * @param  {function} testsReady [description]
		 * @return {void}            [description]
		 */
		var _nextChild = function(parent, level, context, testsReady){
			

			if(!parent.children[level]){
				return;
			}
			level = level || 0;

			var currentTest = parent.children[level],
				sequence = new Mold.Lib.Sequence();
		

			sequence
				.step(function(next){
					if(level === 0){
						var before = _getTestByType("before", parent.children);

						if(before){
							_execute(before, parent, context, next, testsReady);
							return;
						}else{
							next();
						}
					}else{
						next();
					}
				})
				.step(function(next){
					var beforeEach = _getTestByType("beforeEach", parent.children);
					if(beforeEach && _isTestContext(currentTest)){
						_execute(beforeEach, parent, context,  next, testsReady );
						return;
					}else{
						next();
					}
				})
				.step(function(next){
					if(_isTestContext(currentTest)){
		
						_execute(parent.children[level], parent, context, next, testsReady);
						return;
					}else{
						next();
					}
				})
				.step(function(next){
					var afterEachValue = _getTestByType("afterEach", parent.children);
					if(afterEachValue && _isTestContext(currentTest)){
						_execute(afterEachValue, parent, context, next, testsReady, false);
						//return;
					}else{
						next();
					}
				})
				.step(function(next){
					if(parent.children.length -1 === level){
						var after = _getTestByType("after", parent.children);
						if(after && _isTestContext(currentTest)){
							_execute(after, parent, context, function(){}, testsReady);
						}
					}
					level++;
					_nextChild(parent, level, context, testsReady);	
				});

		}


		/**
		 * _execute
		 * @description executes a test
		 * @param  {[type]} test       [description]
		 * @param  {[type]} parent     [description]
		 * @param  {[type]} context    [description]
		 * @param  {[type]} ready      [description]
		 * @param  {[type]} testsReady [description]
		 * @return {[type]}            [description]
		 */
		var _executeCounter = 0;
		var _startExecutionCounter = 0;
		var _execute = function(test, parent, context, ready, testsReady, stopCheckingChilds){
			_parent = test;
			//if describe renew context
			if(test.type === "describe"){
				context = {};
			}
			_startExecutionCounter++;
			context = context || {};
			var startTime = _now();

			//check childs after execution
			var execReady = function(){
				var endTime = _now();
				test.executionTime = endTime - startTime;
				if(_parent && _parent.children.length && !stopCheckingChilds){
					_nextChild(_parent, 0, context, testsReady)
				}
				
				ready();
				_executeCounter++;
				//console.log("----------------->",_startExecutionCounter,  _executeCounter, _testCounter)
				if(_executeCounter >= _startExecutionCounter){
					//trigger ready if all tests are executed
					_that.trigger("tests.ready", { count : _testCounter });
				}
			}

			try {
				var result = true;
				test.success = true;

				//exex async
				if(_hasFunctionParameter(test.action)){
					_execAsync(test, context, execReady);
				}else{
				//exec sync
					var result = test.action.call(context);
					if(result && typeof result.then === "function"){
						result.then(execReady);
					}else{
						execReady();
					}
					
				}

			}catch(e){
				//if error occurs write it to result;
				result = e;
				test.success = false;
				test.error = e;
				_clearTimeout(test)
				execReady();
			}

		}

		/**
		 * _run run test
		 * @return {void} [description]
		 */
		var _run = function(){
			_that.on("tests.ready", function(){
				_report(_rootTest);
			});
			_nextChild(_rootTest, 0, {});
		}
		/**
		 * _objectEqual 
		 * @description compares two objects
		 * @param  {object} input  [description]
		 * @param  {object} target [description]
		 * @return {boolean} return true if both objects are equal
		 */
		var _objectEqual = function(input, target){
			var output = true;
			Mold.each(input, function(inputValue, inputName){
				Mold.each(target, function(targetValue, targetName){
					if(Mold.isArray(inputValue) || Mold.isObject(inputValue)){
						output = _objectEqual(inputValue, targetValue);
					}
					if(typeof inputValue === "function"){
						if(inputValue.toString() !== targetValue.toString()){
							output = false;
							return Mold.EXIT;
						}
					}else{
						if(inputValue !== targetValue){
							output = false;
							return Mold.EXIT;
						}
					}
				})
			});

			return output;
		}

		/**
		 * _expect 
		 * @description liste of expections
		 * @param  {mixed} input
		 * @param  {boolean} negate
		 * @return {object} retuns the api methodes
		 */
		var _expect = function(input, negate){
			var undefined;
			var api =  {
				toBe : function(value){
					input = (negate) ? !input : input;
					if(input === value){
						return _expect(input);
					}else{
						throw new Error(input + " is " +((negate) ? "not " : "")+ "not equal " + value);
					}
				},
				toEqual : function(value){
					input = (negate) ? !input : input;
					if(typeof value === "function"){
						if(input.toString() === value.toString()){
							return _expect(input);
						}else{
							throw new Error("'" + input + "' is" +((negate) ? " not" : "")+ " not equal " + value);
						}
					}

					if(typeof value === "object"){
						if(_objectEqual(input, value)){
							return _expect(input);
						}else{
							throw new Error("'" + input + "' is" +((negate) ? " not" : "")+ " not equal " + value);
						}
					}
					throw new Error("wrong toEqual value function ord object expected!");
				},
				toMatch : function(match){
					if(
						(!negate && match.test(input))
						|| (negate && !match.test(input))
					){
						return _expect(input);
					}else{
						throw new Error("'" +input + "' does" +((negate) ? " not" : "")+ " match " + match);
					}
				},
				toBeDefined : function(){
					if(
						(!negate && input !== undefined)
						|| (negate && input === undefined)
					){
						return _expect(input);
					}else{
						throw new Error("'" +input + "' is" +((negate) ? " not" : "")+ " not defined!");
					}
				},
				toBeUndefined : function(){
					if(
						(!negate && input === undefined)
						|| (negate && input !== undefined)
					){
						return _expect(input);
					}else{
						throw new Error("'" +input + "' is" +((negate) ? " not" : "")+ " defined!");
					}
				},
				toBeNull : function(){
					if(
						(!negate && input === null)
						|| (negate && input !== null)
					){
						return _expect(input);
					}else{
						throw new Error("'" +input + "' is" +((negate) ? " not" : "")+ " defined!");
					}
				},
				toBeFalsy : function(){
					if(
						(!negate && !input)
						|| (negate && input)
					){
						return _expect(input);
					}else{
						throw new Error("'" +input + "' is" +((negate) ? " not" : "")+ " defined!");
					}
				},
				toBePromise : function(){
					if(
						(!negate && typeof input.then === "function")
						|| (negate && typeof input.then !== "function")
					){
						return _expect(input);
					}else{
						throw new Error("'" +input + "' is" +((negate) ? " not" : "")+ " a promise!");
					}
				},
				toBeInstanceOf : function(value){
					if(typeof value === "string" && Mold.startsWith(value, "Mold.")){
						if(
							(!negate && input.instanceOf && input.instanceOf === value)
							|| (!negate && input.className && input.className === value)
							|| (negate && input.instanceOf && input.instanceOf !== value)
							|| (negate && input.className && input.className !== value)
						){
							return _expect(input);
						}else{
							throw new Error("'" +input + "' is" +((negate) ? " not" : "")+ " a instanceof " + value + " !");
						}
					}else{
						if(
							(!negate && input instanceof value)
							|| (negate && !input instanceof value)
						){
							return _expect(input);
						}else{
							throw new Error("'" +input + "' is" +((negate) ? " not" : "")+ " a instanceof " + value + " !");
						}
					}

				},
				toContain : function(value){
					if(
						(!negate && Mold.contains(input, value))
						|| (negate && !Mold.contains(input, value))
					){
						return _expect(input);
					}else{
						throw new Error("'" +input + "' " +((negate) ? " not" : "")+ " contains " + value +  "!");
					}
				},
				toBeLessThan : function(value){
					if(
						(!negate && (+input < value))
						|| (negate && (+input >= value))
					){
						return _expect(input);
					}else{
						throw new Error("'" +input + "' " +((negate) ? " not" : "")+ " contains " + value +  "!");
					}
				},
				toBeGreaterThan : function(value){
					if(
						(!negate && (+input > value))
						|| (negate && (+input <= value))
					){
						return _expect(input);
					}else{
						throw new Error("'" +input + "' " +((negate) ? " not" : "")+ " contains " + value +  "!");
					}
				},
				toBeCloseTo : function(value, precision){
					if(
						(
							!negate && (value + precision) > input
							&&  (value - precision) < input
						)
						|| (
							negate && (value + precision) < input
							&&  (value - precision) > input
						)
					){
						return _expect(input);
					}else{
						throw new Error("'" +input + "' is " +((negate) ? " not" : "")+ " not close to " + value +  "!");
					}

				},
				toThrow : function(){
					if(!negate){
						try {
							input.call();
						}catch(e){
							return _expect(input);
						}finally{
							throw new Error("'" +input + "' do not " +((negate) ? " not" : "")+ " throw an error " +  "!");
						}
					}
					if(negate){
						try {
							input.call();
						}catch(e){
							throw new Error("'" +input + "' " +((negate) ? " not" : "")+ " throw an error " +  "!");
						}finally{
							return _expect(input);
						}
					}
				},
				toHaveBeenCalled : function(){
					var spy = false;
					if((spy = input.call(null, "--getspy"))){
						if(spy.name === "spy"){
							if(
								(!negate && spy.hasBeenCalled)
								|| (negate && !spy.hasBeenCalled)
							){
								return _expect(input);
							}else{
								throw new Error("'" +spy.method + "'  has " + (negate ? "" : "not ") + "been called!");
							}
							
						}
					}
					throw new Error("Use a spy to spy method execution!");
					
				},
				toHaveBeenCalledWith : function(){
					var spy = false;
					if((spy = input.call(null, "--getspy"))){
						if(spy.name === "spy"){
							var argumentTest = true;
							var argumentsArray = [];
							Mold.each(arguments, function(args, i){
								if(spy.arguments[i] !== args){
									argumentTest = false;
								}
								argumentsArray.push(args);
							})
							if(
								(!negate && spy.hasBeenCalled && argumentTest)
								|| (negate && !argumentTest)
							){
								return _expect(input);
							}else{

								throw new Error("'" +spy.method + "'  has " + (negate ? "" : "not ") + "been called with arguments '" + argumentsArray.join(", ") + "'!");
							}
						}
					}
					throw new Error("Use a spy to spy method execution!");
				},
				returnValue : function(value){
					var spy = false;
					if((spy = input.call(null, "--getspy"))){
						spy.returnValue = value;
						return _expect(input);
					}
					throw new Error("Use a spy to spy method execution!");
				}
				
			}
			if(!negate){
				api.not = _expect(input, true);
			}

			Object.defineProperty(api, 'and', {
				get: function() {
					return _expect(input, negate);;
				}
			});

			return api;
		}

		/**
		 * _reporte
		 * @description adds the report to all reporters
		 * @return {[type]} [description]
		 */
		var _report = function(){
			Mold.each(_reporter, function(reporter){
				reporter.addResult(_rootTest);
			});
		}
		/**
		 * _addReporter
		 * @description  adds a reporter
		 * @param {object} a reporter object
		 */
		var _addReporter = function(report){
			_reporter.push(report);
		}

		/**
		 * _test
		 * @description adds a complete testsuit
		 * @param  {function} testFunction 
		 * @return {void} 
		 */
		var _test = function(testFunction){
			
			var interfaceString = "",
				args = [];
			
			for(var i = 1; i < arguments.length; i++){
				args.push(arguments[i]);
			}

			Mold.each(this, function(value, name){
				interfaceString += "var " + name + " = this['" + name +"'];\n";
			});

			var theTest = Mold.injectBefore(testFunction, interfaceString);
			theTest.apply(this, args);
		}

		this.publics = {
			timeout : function(timeout){
				_timeOut = timeout
			},
			addExpect : function(name, value){
				_expect[name] = value;
			},
			before : _before,
			spyOn : _spyOn,
			beforeEach : _beforeEach,
			after : _after,
			afterEach : _afterEach,
			test : _test,
			addTest : _addTest,
			describe : _describe,
			xdescribe : function(){},
			it : _it,
			xit : function(){},
			run : _run,
			expect : _expect,
			addReporter : _addReporter
		}
	}
)