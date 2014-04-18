describe("Mold.Lib.List Tests", function () {
	describe("Load and create List, Test Listmethodes", function(){
		
		var flag = false;
		var isMoldReady = false;
		var testList = false;

		it("Load Seed", function(){

			Mold.ready(function(){
				isMoldReady = true;
			})

			waitsFor(function() {
				return isMoldReady;
			}, "Molde is ready", 750);

			var loader = Mold.load({ name : "external->Mold.Lib.List" });

			loader.bind(function(){
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 750);

		});

		it("create Seed", function(){
			 testList = new Mold.Lib.List(["one", "two", [ "thee.one", "three.two" ], { "four" : "value", "five" : "value"}]);
		});



		
	});


});