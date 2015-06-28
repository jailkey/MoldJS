Seed({
		name : "Mold.Test.Tools.Doc.HTML",
		dna : "test"
	},
	function(HTMLDoc){
		
		describe("Test Mold.Tools.Doc.HTML", function () {
			
			var doc = new HTMLDoc('Mold/Test/Tools/Doc/html_doc_test.html');
			var data = false;
			
			it("get parsed data", function(success){
				doc
					.get()
					.then(function(result){
						data = result;
						success();
					})
			});

			it("test if module is parsed", function(){

				expect(data[0].name).toBe("Textmodul");
				expect(data[0].snippets.length).toBe(4);
				expect(data[0].snippets[0].description).toBe("default Headings");
			})
		});
	}
);