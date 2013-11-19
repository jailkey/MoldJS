describe("Mold Core Lib", function () {

	

	describe("Mold.each", function(){

	});

	describe("Mold.find", function(){
		
	});

	describe("Mold.some", function(){
		
	});

	describe("Mold.keys", function(){
		
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

			var loader = Mold.load({ name : "Mold.Misc.Singelton" });
			loader.bind(function(){
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 750);

		});

		it("create Instance and execute Method", function(){
			var singelton  = new Mold.Misc.Singelton();
			expect(singelton.publicMethod()).toEqual(true);
		});

		
	});

	describe("Mold.isSupported", function(){
		
	});

	describe("Mold.addFeatureTest", function(){
		
	});

	describe("Mold.addMethod", function(){
		
	});

	describe("Mold.injectBefore", function(){
		
	});

	describe("Mold.extend", function(){
		
	});

	describe("Mold.mixing", function(){
		
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