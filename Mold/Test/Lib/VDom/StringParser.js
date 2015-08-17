Seed({
		name : "Mold.Test.Lib.VDom.StringParser",
		dna : "test"
	},
	function(StringParser){
		describe("Test Mold.Lib.VDom.StringParser", function(){

			it("parse some value nodes", function(){
				var result = StringParser('{{#block}} <a href="test" > {{irgendwas}} </a>  {{wasanders}} anders {{/block}} s');
				
				expect(result.length).toBe(3);
				expect(result[0].type).toBe(8);
				expect(result[1].type).toBe(2);
				expect(result[1].name).toBe('block');
			});


			it("parse some value nodes with block content", function(){
				var result = StringParser('<a href="test"> {{#myblock}}  test value {{content}} in block {{/myblock}} </a>');
				expect(result.length).toBe(3);
				expect(result[1].name).toBe("myblock");
				
			})

			it("parse some value nodes with block content and negative block", function(){
				var result = StringParser('<a href="test"> {{#myblock}}  test value {{content}} in block {{/myblock}} {{^myblock}} if not definnde {{/myblock}} </a>');
				expect(result.length).toBe(4);
			})

			it("parse list in a list", function(){
				var result = StringParser('<a href="test"> {{#myblock}}  test {{#insidelist}}  asdasd {{content}} asd {{/insidelist}} {{/myblock}} {{^myblock}} if not definnde {{/myblock}} </a>');
				expect(result.length).toBe(4);
			})

			it("parse invalid list and throw an error", function(){
				expect(function() { StringParser('<a href="test"> {{#myblock}}  test {{#insidelist}}  asdasd {{content}} asd {{/ins}} </a>') }).toThrowError();
			})

		})
	}
)