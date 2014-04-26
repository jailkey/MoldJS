describe("Mold.Lib.List Tests", function () {
	describe("Load and create List, Test Listmethodes", function(){
		
		var flag = false;
		var isMoldReady = false;
		var testWorker = false;

		it("Load Seed", function(){

			Mold.ready(function(){
				isMoldReady = true;
			})

			waitsFor(function() {
				return isMoldReady;
			}, "Molde is ready", 750);

			var loader = Mold.load({ name : "external->Mold.Lib.Worker" });

			loader.bind(function(){
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 750);

		});

		it("create Worker", function(){
			 testWorker = new Mold.Lib.Worker(function(e){
			 	var test = e.data;
			 	postMessage({"test" : "irgendwas", "e" : is})

			 });
		});

		it("send message to worker", function(){
			testWorker.post({ "messagea" : "MY Message"});

			testWorker.on("message", function(e){
				console.log("MESSAGE FROM WORKER", e)
			})

		});

		
	});


});