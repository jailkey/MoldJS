describe("Mold.Lib.Sequence Test", function () {
	
		
	var flag = false;
	var isMoldReady = false;
	var sequence = false;

	it("Load Seed", function(){

		Mold.ready(function(){
			isMoldReady = true;
		})

		waitsFor(function() {
			return isMoldReady;
		}, "Molde is ready", 750);

		var loader = Mold.load({ name : "external->Mold.Lib.Sequence" });

		loader.bind(function(){
			flag = true;
		})

		waitsFor(function() {
			return flag;
		}, "Seed succsessfully loaded", 750);

	});


	it("test some steps", function(){
		sequence = new Mold.Lib.Sequence();
		sequence
			.step(function(next){
				console.log("step 1");
				next();
				
			})
			.step(function(next){
				console.log("step 2");
				window.setTimeout(function(){
					next("testparam");
				}, 1000);

			})
			.step(function(next){
				console.log("step 3");
				next();
			})

	});

	it("test step repeating and previous", function(){
		sequence = new Mold.Lib.Sequence();
		var counter = 0;
		sequence
			.step(function(next){
				console.log("test 2 - step 1");
				counter++;
				window.setTimeout(function(){
					next();
				}, 1000);
				
			})
			.step(function(next, previous, repeat){
				console.log("test 2 - step 2");
				window.setTimeout(function(){
					if(counter === 1){
						previous();
					}else if(counter === 2){
						repeat();
						counter++;
					}else{
						next();
					}
				}, 2000);

			})
			.step(function(next){
				console.log("test 2 - step 3");
				next();
			})

	});

});