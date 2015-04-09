Seed({
		name : "Mold.Test.Adapter.Mongo",
		dna : "test",
		include : [
			{ Model : "Mold.Lib.Model" },
			"Mold.Lib.Mongo"
		]
	},
	function(MongoAdapter){

		describe("Test Mold.Adapter.Mongo", function(){

			var testModel;
			var database = new Mold.Lib.Mongo();
			var testId = false;
			var modelConf  = {};
			var newTestModel = false;

			it("connect database", function(done){
				database
					.connect("mongodb://localhost/test")
					.then(function(){
						modelConf  = {
						 	properties : {
						 		"name" : "string",
						 		"vorname" : "string",
						 	},
						 	adapter : new MongoAdapter(database, "mycollection", "_id")
						 }
						done();
					});
			});

			it("create model", function(){
				 testModel = new Model(modelConf);
			});

			it("add data to model and save", function(done){
				testModel.data.name = "Hans";
				testModel.data.vorname = "Peter";
				testModel.save().then(function(){
					testId = testModel.getId();
					done()
				});
			})

			it("change data ", function(done){
				testModel.data.name = "Hubertus";
				testModel.data.vorname = "Hamster";
				testModel.save().then(function(){
					done()
				});
			})

			it("check if data is changed data ", function(done){
				testModel.data.name = "Hubertus";
				testModel.data.vorname = "Hamster";
				testModel.save().then(function(){
					done()
				});
			})

			it("create new instance with saved data", function(done){
				newTestModel = new Model(modelConf);
				newTestModel.load(testId).then(function(){
					expect(newTestModel.data.vorname).toBe("Hamster");
					expect(newTestModel.data.name).toBe("Hubertus");
					done()
				});
			})

			
			it("delete model", function(done){
				newTestModel.remove().then(function(){
					expect(newTestModel.data.vorname).toBeUndefined();
					expect(newTestModel.data.name).toBeUndefined();
					done()
				});
			})

			it("check if id is still in database", function(done){
				database
					.findOne("mycollection", { _id : testId })
					.then(function(result){
						if(!result){
							done();
						}
					})
			})


			it("close database", function(){
				database.close();
			})
		})
		
	}
)