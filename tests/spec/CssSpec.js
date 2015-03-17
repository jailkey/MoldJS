describe("Test Mold.Lib.Model", function(){

	var flag = false;
	var isMoldReady = false;
	var testModel = false;

	describe("Load and create Model", function(){
		it("Load Seed", function(){

			Mold.ready(function(){
				isMoldReady = true;
			})

			waitsFor(function() {
				return isMoldReady;
			}, "Molde is ready", 750);

			var loader = Mold.load({ name : "->Mold.Lib.CSS" });

			loader.bind(function(){
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 2050);

		});

		it("create Seed and test rendering", function(){
			var style = new Mold.Lib.CSS(function(){/*|
			
				.test {
					background-color: #efefef;
				}


			|*/});

			
			style.exec();
			var backgroundColor = window.getComputedStyle(document.querySelector(".test")).backgroundColor;
			expect(Mold.Lib.Color.rgbToHex(backgroundColor)).toEqual("#efefef");

		});

		it("create Seed and test with appending Data", function(){
			
			var style = new Mold.Lib.CSS(function(){/*|
				.test {
					background-color: #efefef;
				}

			|*/});
			
			style.append({
				test : "#ff0000"
			});

			var backgroundColor = window.getComputedStyle(document.querySelector(".test")).backgroundColor;
			expect(Mold.Lib.Color.rgbToHex(backgroundColor)).toEqual("#ff0000");
		});

	});

});