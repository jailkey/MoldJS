Seed({
		name : "Mold.Test.Lib.Worker",
		include : [
			"Mold.Lib.Ajax",
			"Mold.Tools.Dev.CodeInclude"
		],
		dna : "test"
	},
	function(Worker){

		var worker = false,
			observer,
			test = false;

		describe("Test Mold.Lib.Worker", function(){

			it("create test worker", function(){
				worker = new Worker(function(input){
					var output = input + 2;
					return output;
				})
			})

			it("send message to worker and recive it", function(done){
				worker.on("message", function(e){
					expect(e.data).toBe(7);
					done();
				})
				worker.post(5)
			})


			it("create worker an send object", function(done){

				worker = new Worker(function(input){
					var output = input.test + 2;
					return { test : output };
				})

				worker.on("message", function(e){
					console.log("message", e);
					expect(e.data.test).toBe(10);
					done();
				})
				worker.post({ test : 8})
			})

			it("create worker with include", function(done){
				
				worker = new Worker(function(input){

					//°include Mold.Lib.EventStore as Mold.Lib.EventStore
					//°include Mold.Lib.Event as Mold.Lib.Event
					//°include Mold.Lib.Promise as Mold.Lib.Promise
					//°include Mold.Lib.Ajax as Mold.Lib.Ajax
				
					var ajax = new Mold.Lib.Ajax();
					var output = input.test + 2;
					return { test : output };
				})

				worker.on("message", function(e){
					console.log("message", e);
					expect(e.data.test).toBe(10);
					done();
				})
				worker.post({ test : 8})
			})





		});
	}
)