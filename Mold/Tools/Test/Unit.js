Seed({
		name : "Mold.Tools.Test.Unit",
		dna : "action",
		include : [
			"Mold.Tools.Test.TDD",
			"Mold.Tools.Test.ConsoleReporter"
		]
	},
	function(){

		var simpleUnit = new Mold.Tools.Test.TDD();
		simpleUnit.addReporter(new Mold.Tools.Test.ConsoleReporter());
		simpleUnit.test(function(){
			describe("My First Test", function(){
				this.peter = "hans"
				var test = "";
				
				beforeEach("before each testing", function(done){
					test = "to was rein"
					console.log("before each", this.peter)
					done();
				})

				after("TESCHT NACHHER", function(done){
					setTimeout(function(){
						done();
					}, 500)
				})
				
				describe("My sub Test", function(){
					this.hans = "peter";
					
					it("sub sub Test something", function(){
						var hasn;
						expect(hasn).toBeDefined();
					})
				});

				it("Test aync test", function(done){
					console.log("mach es anycron");
					done();
				})

				it("noch ein Test lala", function(){
					console.log("mach was anderes");
				})
			});
		});
		simpleUnit.run();
		
		Mold.addPostProcessor("unittest", function(createdSeed, rawSeed){
			if(rawSeed.test){
				if(typeof rawSeed.test === "function"){
					

				}
			}
		});

		//if not nodejs run default tests
		if(!Mold.isNodeJS){
			Mold.load({
				name : "Mold.Lib.*"
			}).bind(function(){
				//console.log("Package loaded!")
			});
		}

	}
);