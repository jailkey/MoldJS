Seed({
		name : "Mold.Test.Lib.Mongo",
		dna : "test"
	},
	function(Mongo){
		describe("Test Mold.Lib.Mongo", function () {
			var testDom = false;
			var database = new Mongo();
			it("connect db", function(done){
				database
					.connect("mongodb://localhost/test")
					.then(done)
					.fail(function(){
						console.log("FEHLER")
					});
			});

			it("insert a document in db", function(done){
				database
					.insert("mycollection", { 'hans' : 'peter' })
					.then(function(data){
						console.log("my data", data)
						done()
					})
					.fail(function(err){
						console.log("FAILURE!", err)
					})
			});
		

		});
	}
)