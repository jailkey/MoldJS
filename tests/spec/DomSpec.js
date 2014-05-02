describe("Mold.Lib.Document Tests", function () {
	describe("Load and create Dom, Test methodes", function(){
		
		var flag = false;
		var isMoldReady = false;
		var testDom = false;

		it("Load Seed", function(){

			Mold.ready(function(){
				isMoldReady = true;
			})

			waitsFor(function() {
				return isMoldReady;
			}, "Molde is ready", 750);

			var loader = Mold.load({ name : "external->Mold.Lib.Document" });

			loader.bind(function(){
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 750);

		});

		it("create Document", function(){
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

		it("test .getElementById", function(){
			var element = testDom.getElementById("a-list");
			expect(element.nodeName).toEqual("ul");
		})


		it("test .getElementsByTagName", function(){
			var elements = testDom.getElementsByTagName("div");
			
			expect(elements.length).toEqual(2);
		});


		it("test _root.innerHTML", function(){
			var root = testDom.get();
			console.log("root", root)
			console.log("innerHTML", root.innerHTML)
			
		});






		
	});


});