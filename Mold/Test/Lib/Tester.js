
Seed({
		name : "Mold.Test.Lib.Tester",
		dna : "test"
	},
	function(Tester){
		//Use the Jasmin specs for testing the testtool
		//http://jasmine.github.io/2.2/introduction.html
		describe("test Mold.Lib.Tester", function(){
			describe("A suite", function() {
				it("contains spec with an expectation", function() {
					expect(true).toBe(true);
				});
			});

			describe("A suite is just a function", function() {
				var a;

				it("and so is a spec", function() {
					a = true;
					expect(a).toBe(true);
				});
			});

		})
	}
);
	
