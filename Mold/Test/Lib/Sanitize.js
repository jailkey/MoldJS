Seed({
		name : "Mold.Test.Lib.Sanitize",
		dna : "test"
	},
	function(Sanitize){
		
		describe("Test Mold.Lib.Sanitize" , function(){
			var san = false;

			it("create instace", function(){
				san  = new Sanitize();
			})

			it(".whitelist()", function(){
				var result = san.whitelist("abcde", "aed");
				expect(result).toBe("ade");
			})
			

			it(".blacklist()", function(){
				var result = san.blacklist("abcde", "aed");
				expect(result).toBe("bc");
			})

			it(".url()", function(){
				var result = san.url('/hans/"testmann/?@asd/.)(&)%$nas');
				expect(result).toBe("/hans/testmann/?asd/.&nas");
			})


			
		});	
		
	}
)