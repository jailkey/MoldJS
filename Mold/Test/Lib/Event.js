Seed({
		name : "Mold.Test.Lib.Event",
		dna : "test"
	},
	function(Event){

		var flag = false,
			testModel = false,
			testElement = false;

		describe("Test Mold.Lib.Event", function(){
			var testObject = {};
			
			it("mix events into object", function(){
				Mold.mixin(testObject, new Event(testObject));
				console.log("test")
			});

			it("use methode on and trigger with data", function(done){
				test.on("test.event", function(e.data){
					expect(e.data.test).toBe(true)
					done()
				});

				test.trigger("test.event", {test : true});
			})




		

		});
	}
)