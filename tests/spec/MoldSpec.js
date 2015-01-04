describe("Mold Core Lib", function () {

	

	describe("Mold.each", function(){

		it("Test iteration through an array", function(){
			var testArray = ['one', 'two', 'three'],
				result = '',
				indexSum = 0;
			
			Mold.each(testArray, function(entry, index){
				result += entry;
				indexSum += index;
			});
			expect(result).toEqual("onetwothree");
			expect(indexSum).toEqual(3);
		});

		it("Test iteration through an object", function(){
			var testArray = { 
					'one' : 'apple',
					'two' : 'pear',
					'three' : 'tomato' 
				},
				result = '',
				indexSum = '';
			
			Mold.each(testArray, function(entry, index){
				result += entry;
				indexSum += index;
			});
			expect(result).toEqual("applepeartomato");
			expect(indexSum).toEqual("onetwothree");
		});

	});

	describe("Mold.eachShift", function(){
		it("Test iteration through an array and delete the elements", function(){
			var testArray = ['one', 'two', 'three'],
				result = ''
			
			Mold.eachShift(testArray, function(entry, index){
				result += entry;
				
			});
			expect(result).toEqual("onetwothree");
			expect(testArray.length).toEqual(0);
		});
	});

	describe("Mold.find", function(){
		it("Test find a value in an array", function(){

			var testArray = ['apple', 'pear', 'tomato'];
			
			var result = Mold.find(testArray, function(entry){
				if(entry === 'pear'){
					return true;
				}
				
			});
			expect(result).toEqual('pear');
			
		});

		it("Test find a value in an object ", function(){

			var test = { 
				'one' : 'apple',
				'two' : 'pear',
				'three' : 'tomato' 
			}
			
			var result = Mold.find(test, function(entry, index){
				if(index === 'two'){
					return true;
				}
				
			});
			expect(result).toEqual('pear');
			
		});
	});

	describe("Mold.some", function(){
		
		it("Test .some with false values", function(){

			var test = { 
					'apple' : 'fruit',
					'pear' : 'fruit',
					'banana' : 'fruit',
				},
				undefined;
			
			var result = Mold.some(test, function(entry, index){
				if(entry === 'vegetable'){
					return true;
				}
				
			});

			expect(result).toEqual(undefined);
			
		});

		it("Test .some with true values", function(){

			var test = { 
				'apple' : 'fruit',
				'pear' : 'fruit',
				'tomato' : 'vegetable',
			}
			
			var result = Mold.some(test, function(entry, index){
		
				if(entry === 'vegetable'){
					return true;
				}
				
			});

			expect(result).toEqual(true);
			
		});
	});

	describe("Mold.filter", function(){

	})

	describe("Mold.reject", function(){
		it("Test .reject with a list of objects", function(){

			var test = [
					{ type : 'apple',  color : 'yellow'},
					{ type : 'pear', color : 'green'},
					{ type : 'cite', color : 'yellow'},
				],
				undefined;
			
			var result = Mold.reject(test, function(entryOne, entryTwo){
				console.log("entrys compare", entryOne, entryTwo)
				if(entryOne.color === entryTwo.color){
					return false;
				}else{
					return true;
				}
				
			});
			console.log("result", result)
			expect(result.length).toEqual(2);
			
		});
	})


	describe("Mold.keys", function(){
		it("Test if keys return an array with the object keys", function(){

			var test = { 
				'apple' : 'fruit',
				'pear' : 'fruit',
				'tomato' : 'vegetable',
			}
			
			var result = Mold.keys(test);
			
			expect(result).toEqual(['apple', 'pear', 'tomato']);
			
		});
	});

	describe("Mold.contains", function(){
		it("Test if an object contains a specified value", function(){
			var test = { 
				'apple' : 'fruit',
				'pear' : 'fruit',
				'tomato' : 'vegetable',
			}
			expect(Mold.contains(test, 'vegetable')).toEqual(true);
		})
	});

	describe("Mold.is", function(){
		it("Test if a variable is defined", function(){
			var test = 0;

			expect(Mold.is(test)).toEqual(true);

			var test = false;

			expect(Mold.is(test)).toEqual(true);

			var test = null;

			expect(Mold.is(test)).toEqual(true);
		});

		it("Test if a variable is undefined", function(){
			var test;
			expect(Mold.is(test)).toEqual(false);
		})
	});

	describe("Mold.isArray", function(){
		it("Test if array is an array", function(){
			var testArray = ["one", "two", "three"];
			expect(Mold.isArray(testArray)).toEqual(true);
		});
		it("Test if object is an array", function(){
			var testObject = { "one" : "value", "two" : "moreValue" }
			expect(Mold.isArray(testObject)).toEqual(false);
		})
		it("Test if string is an array", function(){
			var testString = "Irgendwas";
			expect(Mold.isArray(testString)).toEqual(false);
		})
	});

	describe("Mold.isObject", function(){
		it("Test if array is an object", function(){
			var testArray = ["one", "two", "three"];
			expect(Mold.isObject(testArray)).toEqual(false);
		});
		it("Test if object is an object", function(){
			var testObject = { "one" : "value", "two" : "moreValue" }
			expect(Mold.isObject(testObject)).toEqual(true);
		})
		it("Test if string is an object", function(){
			var testString = "Irgendwas";
			expect(Mold.isObject(testString)).toEqual(false);
		})
	});

	describe("Mold.isNodeList", function(){
		it("Test if array is a nodelist", function(){
			var testArray = ["one", "two", "three"];
			expect(Mold.isNodeList(testArray)).toEqual(false);
		});
		it("Test if object is a nodelist", function(){
			var testObject = { "one" : "value", "two" : "moreValue" }
			expect(Mold.isNodeList(testObject)).toEqual(false);
		});
		it("Test if string is a nodelist", function(){
			var testString = "Irgendwas";
			expect(Mold.isNodeList(testString)).toEqual(false);
		});
		it("Test if nodelist is a nodelist", function(){
			var fragment = document.createDocumentFragment(),
    			element = document.createElement('div');

    		fragment.appendChild(element);
			expect(Mold.isNodeList(fragment.childNodes)).toEqual(true);
		});

		
	});

	describe("Mold.getMainScript", function(){
		
	});

	describe("Mold.addDNA", function(){
		
	});

	describe("Mold.getDNA", function(){
		
	});

	describe("Mold.getDNABySeedName", function(){
		
	});

	describe("Mold.cue", function(){
		
	});

	describe("Mold.addLoadingProperty", function(){
		
	});

	describe("Mold.getLoadingproperties", function(){
		
	});

	describe("Mold.getSeed", function(){
		
	});


	describe("Mold.getRawSeed", function(){
		
	});

	describe("Mold.getSeedChainName", function(){
		
	});

	describe("Mold.getTargetName", function(){
		
	});

	describe("Mold.createChain", function(){
		
	});

	describe("Mold.checkSeedCue", function(){
		
	});

	describe("Mold.checkLoadedNames", function(){
		
	});

	describe("Mold.addSeed", function(){
		
	});

	describe("Mold.loadScript", function(){
		
	});

	describe("Mold.load", function(){
		var flag = false;
		var isMoldReady = false;
		it("Load Seed", function(){
			Mold.ready(function(){
				isMoldReady = true;
			})

			waitsFor(function() {
				return isMoldReady;
			}, "Molde is ready", 750);

			var loader = Mold.load({ name : "Mold.Test" });
			loader.bind(function(){
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 1750);

		});

		it("create instance and test imported seeds", function(){
			var testInstance = new Mold.Test();

			expect(testInstance.testMethod()).toEqual(true);
		});

		
	});

	describe("Mold.load with external Dependencies", function(){
		var waitForJquery = false;
		var isMoldReady = false;
		it("Load Seed and wait for jQuery", function(){
		

			var loader = Mold.load({ name : "Mold.WithjQuery" });
			loader.bind(function(){
				waitForJquery = true;
			})

			waitsFor(function() {
			
				return waitForJquery;
			}, "Seed and jQuery succsessfully loaded", 2500);


		});
		
		it("test if jQuery and plugin is available", function(){
			expect(Mold.WithjQuery.test()._hsla[1]).toEqual(0);
		});
	});


	describe("Mold.load and inject dependency", function(){
		var wait = false;
		var isMoldReady = false;
		it("Load Seed and wait for Dependencies", function(){
		

			var loader = Mold.load({ name : "Mold.TestWithInjection" });
			loader.bind(function(){
				wait = true;
			})

			waitsFor(function() {
			
				return wait;
			}, "Seed and jQuery succsessfully loaded", 2500);


		});
		
		it("test if jQuery and plugin is available", function(){
			expect(Mold.TestWithInjection()).toEqual("TEST");
		});
	});


	describe("Mold.addMethod", function(){
		
	});

	describe("Mold.injectBefore", function(){
		
	});

	describe("Mold.extend", function(){
		
		var instance = false;

		var superClass = function(param){
			this.param = param
			
			this.mainMethod = function(){
				return 'result from super';
			}
		}
		
		var subClass = function(){
			
			this.subMethod = function(){
				return 'result from sub';
			}

			this.getParam = function(){
				return this.param;
			}
		}

		var thirtClass = function(){
			this.iAmTheThirt = 'yes';
		}

		it("Extend a object and create instance", function(){
			subClass = Mold.extend(superClass, subClass);
			instance = new subClass("entry");
		})

		it("Test superClass and subclass method", function(){
			
			expect(instance.mainMethod()).toEqual('result from super');
			expect(instance.subMethod()).toEqual('result from sub');
		})

		it("Test if parameter deliverd to superClass", function(){
			expect(instance.param).toEqual('entry');
		})

	});

	describe("Mold.mixin", function(){
		var objectOne = {
			propertyOne : 'value'
		}

		var objectTwo = {
			propertyTwo : 'anotherValue'
		}

		it("Mix objects", function(){
			Mold.mixin(objectOne, objectTwo);
		});

		it("Test mix", function(){
			expect(objectOne.propertyTwo).toEqual('anotherValue');
		})
	});


	describe("Mold.getId", function(){
		
	});

	describe("Mold.callWithDynamicArguments", function(){
		
	});

	describe("Mold.wrap", function(){
		
	});

	describe("Mold.clone", function(){
		
	});

	describe("Mold.watch", function(){
		
	});


	describe("Mold.watch and Mold.unwatch", function(){
		
	});

	describe("Mold.watch and Mold.unwatch", function(){
		
	})






});