jasmine.getEnv().defaultTimeoutInterval = 20000;

describe("Mold Core Lib", function () {

//SEEDHANLDING
	describe("Mold.Core.SeedFactory", function(){
		it("create a new seed and check methods an properties", function(){
			var seed = Mold.Core.SeedFactory({
				name : "Mold.Test",
				type : "module",
				code : function(){

				}
			})
			expect(seed.state).toEqual(Mold.Core.SeedStates.INITIALISING);
			expect(seed.name).toEqual("Mold.Test");
			expect(seed.hasDependency).toBeDefined();
			expect(seed.hasDependencies).toBeDefined();
		});
	})	

	xdescribe("Mold.validateSeed", function(){
		var seed = Mold.seedFactory({type : "testirgendwaskomisches"})

		it("validate the seed without a name", function(){
			expect(function() { Mold.validateSeed(seed); }).toThrow(new Mold.errors.SeedError('Seed name property is not defined!'))
		});

		it("set a name and validate without code", function(){
			seed.name = "Mold.Test";
			expect(function() { Mold.validateSeed(seed); }).toThrow(new Mold.errors.SeedError('SeedType \'testirgendwaskomisches\' does not exist! [Mold.Test]'))
		})

		it("set a name and validate without code", function(){
			seed.type = "static";
			expect(function() { Mold.validateSeed(seed); }).toThrow(new Mold.errors.SeedError('Seed code property is not defined! [Mold.Test]'))
		})


		it("set a codestring and validate with wrong state", function(){
			seed.code = "Mold.Test";
			seed.state = Mold.states.EXECUTING;
			expect(function() { Mold.validateSeed(seed); }).toThrow(new Mold.errors.SeedError('Seed code property must be a function! [Mold.Test]'));
		})

		it("set code to a function and validate", function(){
			seed.code = function(){};
			expect(Mold.validateSeed(seed)).toBe(true);
		})

	})

	describe("Mold.Core.SeedManager", function(){
		var seed = Mold.Core.SeedFactory({
			name : "Mold.Test",
			type : "module",
			code : function(){}
		})
		
		it("adds a seed with .add", function(){
			var oldLength = Mold.Core.SeedManager.count;
			expect(Mold.Core.SeedManager.count).toBe(oldLength);
			expect(Mold.Core.SeedManager.get("Mold.Test")).not.toBe(seed);
			expect(seed.state).toBe(Mold.Core.SeedStates.INITIALISING);
			Mold.Core.SeedManager.add(seed);
			expect(Mold.Core.SeedManager.count).toBe(oldLength + 1);
		});


		it("get a seed with .get", function(){
			expect(Mold.Core.SeedManager.get("Mold.Test")).toBe(seed);
		});

		it("it removes the seed", function(){
			var oldLength = Mold.Core.SeedManager.count;
			Mold.Core.SeedManager.remove(seed);
			expect(Mold.Core.SeedManager.count).toBe(oldLength - 1);
			expect(Mold.Core.SeedManager.get("Mold.Test")).not.toBe(seed);
		})
	});

//Mold.Core.NamespaceManger
	describe("Test Mold.Core.NamespaceManger", function(){
		describe('validates a name with .validate()', function(){
			it("test a name with spaces", function(){
				expect(Mold.Core.NamespaceManager.validate('A asdasd')).toBe(false)
			});

			it("test name with number", function(){
				expect(Mold.Core.NamespaceManager.validate('A3asd')).toBe(false)
			});

			it("test name with a short begining", function(){
				expect(Mold.Core.NamespaceManager.validate('test')).toBe(false)
			});

			it("test correct name", function(){
				expect(Mold.Core.NamespaceManager.validate('Test')).toBe(true)
			});
		});

		describe("creates a namepace with .create", function(){
			it("creates a new Namespace", function(){
			
				Mold.Core.NamespaceManager.create('Herbert');
				expect(Herbert).toBeDefined();
			})

			it("creates a new namespace in a given object", function(){
				var test = {};
				Mold.Core.NamespaceManager.create('Herbert', test);
				expect(test.Herbert).toBeDefined();
			})

			it("try to create a new namespace a unvalid name", function(){
				var test = {};
				expect(function() { Mold.Core.NamespaceManager.create('aerbe8rt', test) }).toThrow(new Error("'aerbe8rt' is not a valid Namespace name!"));
			})
		})


		describe("adds code to namespace with .addCode", function(){
			it("creates a namepace chain inside of Mold and put an object to it", function(){
				Mold.Core.NamespaceManager.addCode("Mold.Test.HansPeter", { test : 1 });
				expect(Mold.Test.HansPeter.test).toBe(1);
			});

			it("creates a namepace chain in the global scope", function(){
				Mold.Core.NamespaceManager.addCode("App.Test.HansPeter", { test : 1 });
				expect(App.Test.HansPeter.test).toBe(1);
			});
		})
	});

	


//SEED TYPE HANDLING
	describe("Test Mold.Core.SeedTypeManager", function(){
		var typeLen;
		it("test the amount of SeedTypes with .count", function(){
			typeLen = Mold.Core.SeedTypeManager.count;
			expect(Mold.Core.SeedTypeManager.count).toBe(typeLen);
			expect(function(){ Mold.Core.SeedTypeManager.count = 5; }).toThrow( new Error("the property 'len' is not writeable! [Mold.Core.SeedTypeManger]"));
		});
		it("add seed type with .add", function(){
			
			Mold.Core.SeedTypeManager.add({
				name : 'testtype',
				create : function(){}
			})

			expect(Mold.Core.SeedTypeManager.count).toBe(typeLen + 1);
		});

		it("remove seed type with .remove", function(){
			Mold.Core.SeedTypeManager.remove('testtype')
			expect(Mold.Core.SeedTypeManager.count).toBe(typeLen);
		});

		it("get seed type with .get", function(){
			expect(Mold.Core.SeedTypeManager.get('static').name).toBe('static');
		})
		
	})

	describe("Mold.Core.Config", function(){
		it("Test default config settings", function(){
			expect(Mold.Core.Config.get('config-name')).toBe('mold.json');
		})

		it("set and get a config value", function(){
			Mold.Core.Config.set('onlyAtestValue', '---val---');
			expect(Mold.Core.Config.get('onlyAtestValue')).toBe('---val---');
		})

		it("test config settings from mold.json", function(done){
			
			Mold.Core.Config.isReady.then(function(){
				expect(Mold.Core.Config.get('name')).toBe('DefaultMoldRepo');
				done();
			});

		})

	});


	describe("Mold.Core.Pathes", function(){

		it("checks name path with .getPathFromName", function(){

			expect(Mold.Core.Pathes.getPathFromName("App.Test")).toBe('App/Test.js');
			expect(Mold.Core.Pathes.getPathFromName("Mold.Test")).toBe('../Mold/Test.js');
		
		})
	})

	describe("Mold.Core.SeedFlow", function(){
		it("check loading flow", function(done){
			Mold.Core.SeedFlow.on(Mold.Core.SeedStates.LOADING, function(seed, next){
				expect(seed.fileData).not.toBe(null);
				next();
				done();
			})
			Mold.load("App.Test");
		})

	})

	describe("Mold.Core.SeedManger", function(){

		it("checks if seed manger is ready", function(next){

			Mold.Core.SeedManager.isReady.then(function(data){
				expect(data.length).toBe(3)
				next();
			})
		
		});
	});

	describe("Mold.Core.DependenciesManager", function(){
	
	})

	describe("test build in seed types", function(){
		
	})




//TEST MOLD METHODS

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

		
		
	});

//TEST INTEGRATED CORE MODULES
	describe("Mold.Core.File", function(){
		var file = null;
		it("Test if module exists", function(){
			expect(Mold.Core.File).toBeDefined();
		})

		it("create file object", function(done){
			var file = new Mold.Core.File('test.txt');
			expect(file.load).toBeDefined();

			file.load().then(function(data){
				expect(data).toBe('test irgendwas text ganz viel')
				done();
			})
		})

		it("create  and load no existing file", function(done){
			var file = new Mold.Core.File('tessdsdt.txt');
			expect(file.load).toBeDefined();

			file.load().fail(function(err){
				expect(err).toBe('File not found! [tessdsdt.txt]')
				done();
			})
		})
	})


});