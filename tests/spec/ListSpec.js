describe("Mold.Lib.List Tests", function () {
	describe("Load and create List, Test Listmthodes", function(){
		var flag = false;
		var isMoldReady = false;
		var testList = false;
		it("Load Seed", function(){
			Mold.ready(function(){
				isMoldReady = true;
			})

			waitsFor(function() {
				return isMoldReady;
			}, "Molde is ready", 750);

			var loader = Mold.load({ name : "external->Mold.Lib.List" });
			loader.bind(function(){
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 750);

		});
		it("create Seed", function(){
			 testList = new Mold.Lib.List(["one", "two", [ "thee.one", "three.two" ], { "four" : "value", "five" : "value"}]);
		});
		it("Test push", function(){
			var addResult = false;
			testList.on("list.item.add", function(){
				console.log("addItem")
				addResult = true;
			});
			testList.push("six");
			expect(testList[4]).toEqual("six");
			expect(testList.length).toEqual(5);
			waitsFor(function() {
				return addResult;
			}, "list.add.item Event fired", 750);
		});
		it("Test Item changed", function(){
			var propertyChangedResult = false;
			testList.on("list.item.change.0", function(e){
				
				expect(e.data.index).toEqual(0)
				propertyChangedResult = true;
			})
			testList[0] = "notonlyone";
			waitsFor(function(){
				return propertyChangedResult
			}, "List Item Change Event", 750);


		})
	});


});