jasmine.getEnv().defaultTimeoutInterval = 20000;

describe("Mold Core Lib", function () {

//SEEDHANLDING
	describe("Mold.Core.SeedFactory", function(){
		it("create a new seed and check methods and properties", function(){
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
			expect(seed.addDependency).toBeDefined();
			expect(seed.addInjection).toBeDefined();
			expect(seed.load).toBeDefined();
			//expect(seed.getDependecies).toBeDefined();
			//expect(seed.checkDependencies).toBeDefined();
			expect(seed.catched).toBeDefined();
			expect(seed.create).toBeDefined();
			expect(seed.execute).toBeDefined();
		});
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

		it("get a seed with .getBySid", function(){
			var sid = seed.sid;
			expect(Mold.Core.SeedManager.getBySid(sid)).toBe(seed);
		})


		it("get a seed with .getBySid", function(){
			var count = 0;
			Mold.Core.SeedManager.each(function(){
				count++;
			})
			expect(Mold.Core.SeedManager.count).toBe(count);
		})

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

			it("test if a namspace exists with .exists", function(){
				expect(Mold.Core.NamespaceManager.exists('Herbert')).toBe(false);
			})

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
				expect(function() { Mold.Core.NamespaceManager.create('aerbe8rt', test) }).toThrow(new Error("'aerbe8rt' is not a valid Namespace name! [instance:origin]"));
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

		xit("test wrong seed types with .validate", function(){
			expect(function(){
				Mold.Core.SeedTypeManager.validate({
					create : "test"
				})
			}).toThrow(new Error('SeedType \'name\' is not defined!'))

			expect(function(){
				Mold.Core.SeedTypeManager.validate({
					name : "test"
				})
			}).toThrow(new Error('SeedType \'create\' is not defined! [test]'))
			
		})

		it("test the amount of SeedTypes with .count", function(){
			typeLen = Mold.Core.SeedTypeManager.count;
			expect(Mold.Core.SeedTypeManager.count).toBe(typeLen);
			expect(function(){ Mold.Core.SeedTypeManager.count = 5; }).toThrow(new Error("the property 'len' is not writeable! [Mold.Core.SeedTypeManger] [instance:origin]"));
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

	describe("Mold.Core.DependencyManager", function(){

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
				expect(Mold.Core.Config.get('name')).toBe('Mold');
				done();
			});

		})
	});


	describe("Mold.Core.Pathes", function(){

		it("checks name path with .getPathFromName", function(){
			expect(Mold.Core.Pathes.getPathFromName("App.Test")).toBe('App/Test.js');
			expect(Mold.Core.Pathes.getPathFromName("Mold.Test")).toBe('../Mold/Test.js');
		})

		it("checks the current Mold.js path .getMoldPath", function(){
			console.log("Mold.Core.Pathes.getMoldPath()", Mold.Core.Pathes.getMoldPath());
			expect(Mold.Core.Pathes.getMoldPath()).toBe('../');
		})

		it("checks get current path", function(){
			expect(Mold.Core.Pathes.getCurrentPath()).toBe("");
		})

		if(Mold.isNodeJS){
			it("check path with .exist (only on nodejs)", function(){
				expect(Mold.Core.Pathes.exists('App/Test.js', 'file')).toBe(true);
			})
		}

		it("checks if a path is a mold seed path", function(){
			console.log(Mold.Core.Pathes.isMoldPath("Mold.Test"))
			expect(Mold.Core.Pathes.isMoldPath("Mold.Test")).toBe(true);
			expect(Mold.Core.Pathes.isMoldPath("mold.Test")).toBe(false);
			expect(Mold.Core.Pathes.isMoldPath("http://.Test")).toBe(false);
			expect(Mold.Core.Pathes.isMoldPath("irgendwas")).toBe(false);
			expect(Mold.Core.Pathes.isMoldPath("App")).toBe(true);
		})
		
	})

	describe("Mold.Core.SeedFlow", function(){
		it("check loading flow", function(done){
			Mold.Core.SeedFlow.on(Mold.Core.SeedStates.LOADED, function(seed, next){
				//console.log("SEEDDATA", seed.fileData)
				//expect(seed.fileData).not.toBe(null);
				next();
				done();
			})
			Mold.load("App.Test");
		})

	})

	describe("Mold.Core.SeedManger", function(){

		it("checks if seed manger is ready", function(next){
			Mold.Core.SeedManager.isReady.then(function(data){
				expect(data.length).toBeDefined();
				next();
			})
		
		});
	});

	describe("Mold.Core.DependenciesManager", function(){
	
	})

	describe("test build in seed types", function(){
		
	})


	describe("Check methods after seed is loaded", function(){
		//Mold.Core.SeedManager.checkReady()
		//seed.hasDependencies
	})


	//SPECIAL CHECKS
	describe("Check forced loadings with defect dependecies", function(){
		it("Disable errors via config", function(){
			Mold.Core.Config.set('disable-dependency-errors', true);
			expect(Mold.Core.Config.get('disable-dependency-errors')).toBe(true)
		})
		it("test loading a seed with no existin dependencies", function(done){
			Mold.load("App.Dieter").then(function(){
				console.log("Dieter is loaded")
				Mold.Core.Config.set('disable-dependency-errors', false);
				expect(Mold.Core.Config.get('disable-dependency-errors')).toBe(false)
				done();
			})
			.catch(function(err){
				console.log("FEHLER", err)
			})
		})
	})

	describe("Check loading with disabled executing", function(){
		it("activate stop executing", function(){
			Mold.Core.Config.set('stop-seed-creating', true);
			expect(Mold.Core.Config.get('stop-seed-creating')).toBe(true)
		})
		it("test loading a seed without executing", function(done){
			Mold.load("App.TestNoExec").then(function(seed){
				expect(seed.executedValue).toBeUndefined()
				Mold.Core.Config.set('stop-seed-creating', false);
				expect(Mold.Core.Config.get('stop-seed-creating')).toBe(false)
				done();
			})
			.catch(function(err){
				console.log("FEHLER", err)
			})
		});
	})




//TEST MOLD BUILD IN AND POLYFILLS
	describe("Mold.merge", function(){
		it("Test merging objects", function(){
			var objOne = {
				hans : {
					test : 'value1',
					anothertest : 'notoverwritten'
				}
			}

			var objTwo = {
				hans : {
					test : 'value2'
				},
				wasanderes : true
			}

			var result = Mold.merge(objOne, objTwo);
			expect(result.hans.test).toBe('value2');
			expect(result.hans.anothertest).toBe('notoverwritten');
			expect(result.wasanderes).toBe(true);
		})
	})

	describe("Mold.diff", function(){
		it("Test diffing two data struktures", function(){
			var objOne =  {
				test : [
					"Apfel",
					"Banane",
					"Kirsche"
				],

				testTwo : [
					{ "eins" : "zwei" },
					{ "drei" : "vier" },
					{ "sieben" : {
						"test" : "peter"
					}}
				],

				"hund" : "katze",
				"schokolade" : "bratwurst"
			};

			var objTwo =  {
				test : [
					"Apfel",
					"Test",
					"Kirsche"
				],

				testTwo : [
					{ "vier" : "" },
					{ "drei" : "zwölf" },
					{ "sieben" : {
							"testzwei" : "peter"
						}
					}	
				],

				"hanse" : "katze",
				"schokolade" : "bratwurst"
			}

			var result = Mold.diff(objOne, objTwo);

			expect(result.hund).toEqual("katze")
			expect(result.schokolade).toBeUndefined();
			expect(result.test.indexOf("Apfel")).toBe(-1);
			expect(result.test.indexOf("Kirsche")).toBe(-1);
			expect(result.test.indexOf("Banane")).toBe(0);

			expect(result.testTwo[0].eins).toBe("zwei");
			expect(result.testTwo[1].sieben.test).toBe("peter");

			console.log("result", result)
		})
	});

	describe("Array.isArray", function(){
		it("Test if array is an array", function(){
			var testArray = ["one", "two", "three"];
			expect(Array.isArray(testArray)).toEqual(true);
		});
		it("Test if object is an array", function(){
			var testObject = { "one" : "value", "two" : "moreValue" }
			expect(Array.isArray(testObject)).toEqual(false);
		})
		it("Test if string is an array", function(){
			var testString = "Irgendwas";
			expect(Array.isArray(testString)).toEqual(false);
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
				console.log(err)
				expect(err.message).toBe('File not found! [tessdsdt.txt] [instance:origin]')
				done();
			})
		})
	})


});