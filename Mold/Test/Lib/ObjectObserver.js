Seed({
		name : "Mold.Test.Lib.ObjectObserver",
		dna : "test"
	},
	function(ObjectObserver){

		var testObject = false,
			observer,
			test = false;

		describe("Test Mold.Lib.ObjectObserver", function(){

			it("create test object", function(){
				testObject = {
					one : "irgendwas",
					two : "wasanderes",
					three : "nochwas"
				}

				observer = new ObjectObserver(testObject)
			})

			it("observe object property change", function(done){
				test = function(data){
	
					expect(data.type).toBe("update");
					expect(data.name).toBe("one");
					expect(data.oldValue).toBe("irgendwas");
					expect(data.object.one).toBe("six");
					observer.unobserve(test);
					done();
				}

				observer.observe(test)

				testObject.one = "six";
			});


		});
	}
)