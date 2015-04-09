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

			it(".insert a document in db", function(done){
				database
					.insert("mycollection", { 'hans' : 'peter' })
					.then(function(data){
						expect(data.result.ok).toBe(1);
						done();
					})
					.fail(function(err){
						console.log("FAILURE!", err)
					})
			});


			it(".findOne dont finds a document", function(done){
				database
					.findOne("mycollection", { 'superman' : 'hero' })
					.then(function(data){
						expect(data).toBe(null);
						done();
					});
			});

			it(".findOne document", function(done){
				database
					.findOne("mycollection", { 'hans' : 'peter' })
					.then(function(data){
						expect(data.hans).toBe('peter');
						done();
					});
			});

			it(".update all documents", function(done){
				database
					.update("mycollection", { 'hans' : 'peter' }, { $set : { 'hans' : 'klaus' } }, { multi : true })
					.then(function(data){
						expect(data.result.ok).toBe(1);
						done();
					}).fail(function(){
						console.log("FIAL")
					});
			});

			it("test if all updateded found", function(done){
				database
					.findOne("mycollection", { 'hans' : 'klaus' })
					.then(function(data){
						expect(data.hans).toBe('klaus');
						done();
					});
			});

			it(".remove from database", function(done){
				database
					.remove("mycollection", { 'hans' : 'klaus' })
					.then(function(data){
						expect(data.result.ok).toBe(1);
						done();
					});
			});

			it("test if it is deleted", function(done){
				database
					.findOne("mycollection", { 'hans' : 'klaus' })
					.then(function(data){
						expect(data).toBe(null);
						done();
					});
			});


			it("close Database", function(done){
				database.on("connection.closed", function(){
					done();
				})

				database.close();
			});



		

		});
	}
)