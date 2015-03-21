Seed({
		name : "Mold.Tools.Test.TDD",
		dna : "class"
	},
	function(test){

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
			_timeOut = 1000;

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
		var _addTest = function(type, description, action, parent){
			var test = {
				type : type,
				description : description,
				action : action,
				parent : parent || false,
				error : false,
				success : false,
				children : [],
				parent : parent || false
			}
			if(parent){
				parent.children.push(test);
			}else{
				_rootTest.children.push(test)
			}
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

		var _getTestByType = function(type, children){
			return Mold.find(children, function(value){
				if(value.type === type){
					return value;
				}
				return false;
			})
		}

		var _execAsync = function(test, context, callback){
			var timeout = setTimeout(function(){
				test.success = false;
				test.error = "Timeout in '" + (test.description ? test.description : test.type )+  "'!";
				callback.call(context);
			}, _timeOut);

			var withTimeout = function(){
				callback.call(context);
				clearTimeout(timeout);
			}

			test.action.call(context, withTimeout);
		}

		/**
		 * _nextChild
		 * @description 
		 * @param  {[type]} parent     [description]
		 * @param  {[type]} level      [description]
		 * @param  {[type]} context    [description]
		 * @param  {[type]} testsReady [description]
		 * @return {[type]}            [description]
		 */
		var _nextChild = function(parent, level, context, testsReady){
			level = level || 0;

			if(!parent.children[level]){
				return "ready";
			}
			//exec after execution
			var ready = function(){

				if(parent.children.length -1 > level){
					level++;

					_nextChild(parent, level, context, testsReady);
				}else{

					var after = _getTestByType("after", parent.children);
					if(after){
						//after.action.call(context);
						_execute(after, parent, context, function(){
							if(!parent.parent){
								testsReady();
							}
						},
						testsReady);
					}else{
						if(!parent.parent){
							testsReady();
						}
					}
					
				}

			}

			//executed after before rules are executed
			var afterBefore = function(){
				var beforeEach = _getTestByType("beforeEach", parent.children);
				if(beforeEach){
					console.log("EXEC BEFORE EACH")
					_execute(beforeEach, parent, context,  function(){
							afterBeforeEach()
						}, 
						testsReady
					);
				}else{
					afterBeforeEach();
				}
			}

			//execute after the before each rule
			var afterBeforeEach = function(){
				if(
					parent.children[level].type === "describe"
					|| parent.children[level].type === "it"
				){
					_execute(parent.children[level], parent, context, ready, testsReady);
				}else{
					ready()
				}
			}
			
			if(level === 0){
				var before = _getTestByType("before", parent.children);
				if(before){
					_execute(before, parent, context, function(){
							afterBefore()
						},
						testsReady
					);
				}else{
					afterBefore()
				}
			}else{
				afterBefore();
			}
			

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
		var _execute = function(test, parent, context, ready, testsReady){
			_parent = test;

			//if describe renew context
			if(test.type === "describe"){
				context = {};
			}

			context = context || {};

			var execReady = function(){

				if(_parent && _parent.children.length){
					_nextChild(_parent, 0, context, testsReady)
				}
				ready();
			}

			try {
				var result = true;
				test.success = true;

				if(_hasFunctionParameter(test.action)){
					_execAsync(test, context, execReady);
				}else{
					var result = test.action.call(context);
					console.log("EXEC", test.name)
					if(result && typeof result.then === "function"){
						result.then(execReady);
					}else{
						execReady();
					}
					
				}

			}catch(e){
				result = e;
				test.success = false;
				test.error = e;
			}

		}

		/**
		 * _run run test
		 * @return {void} [description]
		 */
		var _run = function(){
			_nextChild(_rootTest, 0, {}, function(){
				_report(_rootTest);
			})
		}
		/**
		 * _objectEqual 
		 * @description compares two objects
		 * @param  {obejct} input  [description]
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

				},
				toBeGreaterThan : function(value){

				},
				toBeCloseTo : function(value){

				},
				toThrow : function(value){

				}
				
			}
			if(!negate){
				api.not = _expect(input, true);
			}

			return api;
		}

		var _report = function(){
			Mold.each(_reporter, function(reporter){
				reporter.addResult(_rootTest);
			});
		}

		var _addReporter = function(report){
			_reporter.push(report);
		}

		var _test = function(testFunction){
			var interfaceString = "";
			Mold.each(this, function(value, name){
				interfaceString += "var " + name + " = this['" + name +"'];\n";
			});

			var theTest = Mold.injectBefore(testFunction, interfaceString);
			theTest.call(this);
		}

		this.publics = {
			timeout : function(timeout){
				_timeOut = timeout
			},
			addExpect : function(name, value){
				_expect[name] = value;
			},
			before : _before,
			beforeEach : _beforeEach,
			after : _after,
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