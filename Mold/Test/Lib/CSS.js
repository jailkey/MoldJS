Seed({
		name : "Mold.Test.Lib.CSS",
		dna : "test"
	},
	function(CSS){

		var flag = false,
			testModel = false,
			testElement = false;

		describe("Test Mold.Lib.CSS", function(){

			it("create test element", function(){
				testElement = document.createElement("div");
				testElement.className = "test";
				document.body.appendChild(testElement)
			})

			it("create Seed and test rendering", function(){
				var style = new Mold.Lib.CSS(function(){/*|
				
					.test {
						background-color: #efefef;
					}


				|*/});

				style.exec();
				var backgroundColor = window.getComputedStyle(testElement).backgroundColor;
				expect(Mold.Lib.Color.rgbToHex(backgroundColor)).toBe("#efefef");

			});

			it("create Seed and test appending Data", function(){
				
				var style = new Mold.Lib.CSS(function(){/*|
					.test {
						background-color: {{test}};
					}

				|*/});
				
				style.append({
					test : "#ff0000"
				});

				var backgroundColor = window.getComputedStyle(testElement).backgroundColor;
				expect(Mold.Lib.Color.rgbToHex(backgroundColor)).toBe("#ff0000");
			});

		});
	}
)