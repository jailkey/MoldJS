Seed({
		name : "Mold.Test.Lib.Document",
		dna : "test"
	},
	function(Doc){
		describe("Test Mold.Lib.Document", function () {
			var testDom = false;
			it("create document", function(){
				 testDom = new Mold.Lib.Document(function(){
				 	/*|
				 		{{#test}}
				 		<link rel="stylesheet" type="text/css" href="formate.css" />
						<div class="irgendwas">
							<ul id="a-list"> 
								<li> ÖÖ ??ßßß lalal@  <a href="#" alt="mein Link">Tlinktest</a></li>
							</ul>
							<br>
							<br>
							Einfach So <span> irgendwelcher</span> text
							<div> Noch ein div </div><br>
						</div>
						{{/test}}
				 	|*/
				 });
			});

			it(".getElementById()", function(){
				var element = testDom.getElementById("a-list");
				expect(element.nodeName).toBe("ul");
			})


			it(".getElementsByTagName()", function(){
				var elements = testDom.getElementsByTagName("div");
				
				expect(elements.length).toBe(2);
			});


			it("_root.innerHTML()", function(){
				var root = testDom.get();
				
			});

		});
	}
)