Seed({
		name : "Mold.Test.Lib.VDom.StringParser",
		dna : "test"
	},
	function(StringParser){
		describe("Test Mold.Lib.VDom.StringParser", function(){

			it("parse some value nodes", function(){
				var result = StringParser('<a href="test" > {{irgendwas}} </a>  {{wasanders}} anders');

				expect(result.length).toBe(5);
				expect(result[0].type).toBe("markup");
				expect(result[1].type).toBe("node");
				expect(result[1].name).toBe("irgendwas");
			});


			it("parse some value nodes with block content", function(){
				var result = StringParser('<a href="test"> {{#myblock}}  test value {{content}} in block {{/myblock}} </a>');
				expect(result.length).toBe(3);
				expect(result[1].name).toBe("myblock");
				expect(result[1].value).toBe("  test value {{content}} in block ")
				
			})

			it("parse some value nodes with block content and negative block", function(){
				var result = StringParser('<a href="test"> {{#myblock}}  test value {{content}} in block {{/myblock}} {{^myblock}} if not definnde {{/myblock}} </a>');
				expect(result.length).toBe(5);
				expect(result[1].name).toBe("myblock");
				expect(result[1].value).toBe("  test value {{content}} in block ")
				expect(result[3].name).toBe("myblock");
				expect(result[3].nodeType).toBe(3);
			})

			it("parse list in a list", function(){
				var result = StringParser('<a href="test"> {{#myblock}}  test {{#insidelist}}  asdasd {{content}} asd {{/insidelist}} {{/myblock}} {{^myblock}} if not definnde {{/myblock}} </a>');
				expect(result.length).toBe(5);
			})

			xit("parse invalid list and throw an error", function(){
				expect(StringParser('<a href="test"> {{#myblock}}  test {{#insidelist}}  asdasd {{content}} asd {{/ins}} </a>')).toThrowError();
			})

		})
	}
)