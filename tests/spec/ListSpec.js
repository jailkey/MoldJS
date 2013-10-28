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

		it("Test List.push", function(){
			var addResult = false;

			console.log("push")

			testList.on("list.item.add", function(){
				addResult = true;
			});

			testList.push("six");

			expect(testList[4]).toEqual("six");
			expect(testList.length).toEqual(5);

			waitsFor(function() {
				testList.off("list.item.add");
				return addResult;
			}, "list.add.item Event fired", 750);
		});

		it("Test List Item changed", function(){
			var propertyChangedResult = false;
			testList.on("list.item.change.0", function(e){
				expect(e.data.index).toEqual(0)
				propertyChangedResult = true;
			})

			testList[0] = "notonlyone";

			waitsFor(function(){
				testList.off("list.item.change.0");
				return propertyChangedResult
			}, "List Item Change Event", 750);


		});
		it("Test List.pop", function(){
			var addResult = false;
			console.log("pop")
			var removeListener = function(e){
				console.log("callback pop")
				expect(e.data.oldValue).toEqual("six");
				expect(e.data.index).toEqual(4);
				expect(e.data.length).toEqual(4);
				addResult = true;
			}
			testList.on("list.item.remove", removeListener);

			expect(testList.length).toEqual(5);
			testList.pop();

			expect(testList.length).toEqual(4);
			expect(testList[0]).toEqual("notonlyone");
			waitsFor(function(e) {
				testList.off("list.item.remove");
				return addResult;
			}, "list.add.remove Event fired", 750);
		});

		it("Test List.shift", function(){
			var addResult = false;
			var changeResult = false;
			console.log("shift")
			testList.on("list.item.remove", function(e){
				expect(e.data.index).toEqual(3);
				expect(e.data.length).toEqual(3);
				addResult = true;
			});
			testList.on("list.item.change.0", function(e){
				expect(e.data.index).toEqual(0);
				expect(e.data.value).toEqual("two");
				changeResult = true;
			});
			expect(testList.length).toEqual(4);
			testList.shift();
			expect(testList.length).toEqual(3);
			expect(testList[0]).toEqual("two");
			waitsFor(function(e) {
				testList.off("list.item.remove");
				return addResult;
			}, "list.item.remove Event fired", 750);

			waitsFor(function(e) {
				testList.off("list.item.change.0");
				return addResult;
			}, "list.item.change Event fired", 750);
		});

		it("Test List.unshift", function(){
			var addFirstResult = false;
			var addSecondeResult= false;
			var counter = 4;
			testList.on("list.item.add", function(e){		
				addFirstResult = true;
				expect(e.data.length).toEqual(counter);
				counter++;
				
			});
			
			testList.on("list.item.change.1", function(e){
				console.log("list.item.change.1")
				expect(e.data.value).toEqual("two");
				addSecondeResult = true;
			});

			expect(testList.length).toEqual(3);
			testList.unshift("one", "two");
			expect(testList.length).toEqual(5);
			expect(testList[0]).toEqual("one");

			waitsFor(function(e) {	
				return addFirstResult;
			}, "first list.add.add Event fired", 750);

			waitsFor(function(e) {
				return addSecondeResult;
			}, "second list.add.add Event fired", 750);
		});

		it("Test List.concat", function(){
			var addResult = false;
			testList.on("list.item.add", function(e){
				if(e.data.value === "seven"){
					addResult = true;
				}
			});

			expect(testList.length).toEqual(5);
			testList.concat(["six", "seven"]);
			expect(testList.length).toEqual(7);

			waitsFor(function(e) {	
				return addResult;
			}, "second list.add.add Event fired", 750);
		});

		it("Test List.splice", function(){
			var addResult = false;
			testList.on("list.item.remove", function(e){
				expect(e.data.index).toEqual(7);
				addResult = true;
			});

			testList.splice(3, 2, "insert");

			waitsFor(function(e) {	
				return addResult;
			}, "second list.add.add Event fired", 750);

		});

		
	});


});