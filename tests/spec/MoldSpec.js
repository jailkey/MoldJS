describe("Mold Core Lib", function () {

//SEEDHANLDING
	describe("Mold.seedFactory", function(){
		it("Test the factory result", function(){
			var seed = Mold.seedFactory({
				name : "Mold.Test",
				dna : "module",
				code : function(){

				}
			})
			expect(seed.state).toEqual(Mold.states.INITIALISING);
			expect(seed.name).toEqual("Mold.Test")
		});
	})	

	describe("Mold.validateSeed", function(){
		var seed = Mold.seedFactory({dna : "module"})

		it("validate the seed without a name", function(){
			expect(function() { Mold.validateSeed(seed); }).toThrow(new Mold.errors.SeedError('Seed name property is not defined!'))
		});


		it("set a name and validate without code", function(){
			seed.name = "Mold.Test";
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

	describe("Mold.addSeed and removeSeed", function(){
		var seed = Mold.seedFactory({
			name : "Mold.Test",
			dna : "module",
			code : function(){

			}
		});
		
		it("adds a seed", function(){
			expect(Mold.seeds.length).toBe(0);
			expect(Mold.seedIndex["Mold.Test"]).not.toBe(seed);
			expect(seed.state).toBe(Mold.states.INITIALISING);
			Mold.addSeed(seed);
			expect(seed.state).toBe(Mold.states.PENDING);
			expect(Mold.seeds.length).toBe(1);
			expect(Mold.seedIndex["Mold.Test"]).toBe(seed);
		})

		it("it removes the seed", function(){
			Mold.removeSeed(seed);
			expect(Mold.seeds.length).toBe(0);
			expect(Mold.seedIndex["Mold.Test"]).not.toBe(seed);
		})
	});

//NAMESPACE HANLDING
	describe("validated Namespace names with Mold.validateNamespaceName", function(){
		it("test name with spaces", function(){
			expect(Mold.validateNamespaceName('A asdasd')).toBe(false)
		});

		it("test name with number", function(){
			expect(Mold.validateNamespaceName('A3asd')).toBe(false)
		});

		it("test name with a short begining", function(){
			expect(Mold.validateNamespaceName('test')).toBe(false)
		});

		it("test correct name", function(){
			expect(Mold.validateNamespaceName('Test')).toBe(true)
		});
	});

	describe("Mold.createNamespace", function(){
		it("creates a new Namespace", function(){
		
			Mold.createNamespace('Herbert');
			expect(window.Herbert).toBeDefined();
		})

		it("creates a new namespace in a given object", function(){
			var test = {};
			Mold.createNamespace('Herbert', test);
			expect(test.Herbert).toBeDefined();
		})

		it("try to create a new namespace a unvalid name", function(){
			var test = {};
			expect(function() { Mold.createNamespace('aerbe8rt', test) }).toThrow(new Error("'aerbe8rt' is not a valid Namespace name!"));
		})
	})

	describe("Mold.addCodeToNamespace", function(){
		it("creates a namepace chain inside of Mold and put an object to it", function(){
			Mold.addCodeToNamespace("Mold.Test.HansPeter", { test : 1 });
			expect(Mold.Test.HansPeter.test).toBe(1);
		});

		it("creates a namepace chain in the global scope", function(){
			Mold.addCodeToNamespace("App.Test.HansPeter", { test : 1 });
			expect(App.Test.HansPeter.test).toBe(1);
		});
	})

//SEED TYPE HANDLING
	describe("add and get seed typs", function(){
		var typeLen = Object.keys(Mold.seedTypeIndex).length;
		it("add a seed type with Mold.addSeedType", function(){
			expect(Object.keys(Mold.seedTypeIndex).length).toBe(typeLen);

			Mold.addSeedType({
				name : 'testtype',
				create : function(){}
			})

			expect(Object.keys(Mold.seedTypeIndex).length).toBe(typeLen + 1);
		});

		it("remove seed type with Mold.removeSeedType", function(){
			Mold.removeSeedType('testtype')
			expect(Object.keys(Mold.seedTypeIndex).length).toBe(typeLen);
		});

		it("get seed type with Mold.getSeedType", function(){
			expect(Mold.getSeedType('static').name).toBe('static');
		})
		
	})


//TEST METHODS
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


});