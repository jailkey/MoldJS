
Seed({
		name : "Mold.Test.Lib.Promise",
		dna : "test"
	},
	function(Promise){
		describe("Test Mold.Lib.Promise", function () {
			
			var promise = false;

			it("create Promise", function(){
				 promise = new Promise();

			});

			it("test Promise.all fullfilled", function(done){
				
				var testOne = new Mold.Lib.Promise(function(fullfill){
					setTimeout(function(){
						fullfill();
					}, 50);
				});
				var testTwo = new Mold.Lib.Promise(function(fullfill){
					setTimeout(function(){
						fullfill()
					}, 100);
				});

				promise.all([
					testOne, testTwo
				]).then(function(){
					done();
				})

				
			});

			it("test Promise.all rejected", function(done){
				var testOne = new Mold.Lib.Promise(function(fullfill){
					window.setTimeout(function(){
						fullfill();
					}, 50);
				});

				var testTwo = new Mold.Lib.Promise(function(fullfill, rejected){
					window.setTimeout(function(){
						rejected()
					}, 100);
				});

				promise.all([
					testOne, testTwo
				]).then(function(){
					
				}, function(){
					done()
				})

			});

			
		});
	}
);
	
