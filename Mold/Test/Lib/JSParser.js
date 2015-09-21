Seed({
		name : "Mold.Test.Lib.JSParser",
		dna : "test",
		include : [
			"Mold.Lib.File"
		]
	},
	function(JSParser){

		var testContent;
		var parser;

		describe("Mold.Test.Lib.JSParser", function(){
			console.log("START TEST")
			it("create new parser", function(){
				parser = new JSParser();
			});

			it("get test data from file", function(done){
		
				var file = new Mold.Lib.File("../Mold/Lib/ViewFilter.js");

				file.content(function(content){
					testContent = content;
					done();
				})
			})

			it("parse test data", function(){
				parser.parse(testContent);
			})

		});
	}
)