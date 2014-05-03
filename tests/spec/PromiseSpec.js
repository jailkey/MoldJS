describe("Mold.Lib.Promise Tests", function () {
	describe("Load and create Promise, Promise Methode", function(){
		
		var flag = false;
		var isMoldReady = false;
		var promise = false;

		it("Load Seed", function(){

			Mold.ready(function(){
				isMoldReady = true;
			})

			waitsFor(function() {
				return isMoldReady;
			}, "Molde is ready", 750);

			var loader = Mold.load({ name : "external->Mold.Lib.Promise" });

			loader.bind(function(){
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 750);

		});

		it("create Promise", function(){
			 promise = new Mold.Lib.Promise();

		});

		it("test Promise.all fullfilled", function(){
			flag = false;
			var testOne = new Mold.Lib.Promise(function(fullfill){
				window.setTimeout(function(){
					fullfill();
					console.log("fullfill one")
				}, 1000);
			});
			var testTwo = new Mold.Lib.Promise(function(fullfill){
				window.setTimeout(function(){
					fullfill()
					console.log("fullfill two")
				}, 2000);
			});
			promise.all([
				testOne, testTwo
			]).then(function(){
				console.log("ready")
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 5000);
		});

		it("test Promise.all rejected", function(){
			flag = false;
			var testOne = new Mold.Lib.Promise(function(fullfill){
				window.setTimeout(function(){
					fullfill();
					console.log("fullfill one")
				}, 1000);
			});
			var testTwo = new Mold.Lib.Promise(function(fullfill, rejected){
				window.setTimeout(function(){
					rejected()
					console.log("fullfill two")
				}, 2000);
			});
			promise.all([
				testOne, testTwo
			]).then(function(){
				console.log("ready")
				
			}, function(){
				console.log("rejected")
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 5000);
		});

		
	});


});