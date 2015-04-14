
Seed({
		name : "Mold.Test.Lib.List",
		dna : "test"
	},
	function(List){
		describe("Test Mold.Lib.List", function () {

			var flag = false;
			var isMoldReady = false;
			var testList = false;


			it("create list", function(){
				 testList = new List(["one", "two", [ "thee.one", "three.two" ], { "four" : "value", "five" : "value"}]);
			});

			it(".push()", function(done){
				var addResult = false;

				testList.on("list.item.add", function(){
					testList.off("list.item.add")
					done();
				});

				testList.push("six");
				expect(testList[4]).toEqual("six");
				expect(testList.length).toEqual(5);

				
			});

			it("Test List Item changed", function(done){
				var propertyChangedResult = false;
				testList.on("list.item.change.0", function(e){
					testList.off("list.item.change.0")
					expect(e.data.index).toEqual(0)
					done();
				})

				testList[0] = "notonlyone";


			});

			it("Test .pop()", function(done){
			
				var removeListener = function(e){
					expect(e.data.oldValue).toEqual("six");
					expect(e.data.index).toEqual(4);
					expect(e.data.length).toEqual(4);
					testList.off("list.item.remove");
					done();
				}
				testList.on("list.item.remove", removeListener);
				expect(testList.length).toEqual(5);
				testList.pop();

				//expect(testList.length).toEqual(4);
				//expect(testList[0]).toEqual("notonlyone");
				
			});

			it(".shift()", function(done){
				var addResult = false;
				var changeResult = false;
				
				
				testList.on("list.item.remove", function(e){
					testList.off("list.item.remove");
					expect(e.data.index).toEqual(2);
					expect(e.data.length).toEqual(3);
					done();
				});
			
				it("list.item.change event", function(next){
					testList.on("list.item.change.0", function(e){
						testList.off("list.item.change.0");
						expect(e.data.index).toEqual(0);
						expect(e.data.value).toEqual("two");
						next();
					});
				})
		
				expect(testList.length).toEqual(4);

				testList.shift();
				expect(testList.length).toEqual(3);
				expect(testList[0]).toEqual("two");
			

			});

			it(".unshift()", function(done){
				var addFirstResult = false;
				var addSecondeResult= false;
				var counter = 4;

				
				testList.on("list.item.add", function(e){
					testList.off("list.item.add")
					addFirstResult = true;
					expect(e.data.length).toEqual(counter);
					counter++;
					done();
				});
			
				it("list.item.change event", function(next){
					testList.on("list.item.change.1", function(e){
						testList.off("list.item.change.1")
						expect(e.data.value).toEqual("two");
						next();
					});
				});

				expect(testList.length).toEqual(3);
				testList.unshift("one", "two");
				expect(testList.length).toEqual(5);
				expect(testList[0]).toEqual("one");

			
			});

			it(".concat()", function(done){
				var addResult = false;
				testList.on("list.item.add", function(e){
					if(e.data.value === "seven"){
						testList.off("list.item.add")
						done()
					}
				});

				expect(testList.length).toEqual(5);
				testList.concat(["six", "seven"]);
				expect(testList.length).toEqual(7);

			
			});
			

			it(".splice()", function(done){
				var addResult = false;
				testList.on("list.item.remove", function(e){
					testList.off("list.item.remove");
					expect(e.data.index).toEqual(6);
					done();
				});
				testList.splice(3, 2, "insert");
			});



			it(".splice() add some content", function(done){
				var addResult = false;
				var countAdded = 0;
				testList.on("list.item.add", function(e){
					countAdded++;
					if(countAdded === 4){
						testList.off("list.item.add");
						done();
					}
				});
				
				testList.splice(1, 0, "insert", "test", "nochwas", "irgendwie");

			});

			it("Test List in List", function(){
				var result = "";

				testList.push({
					"item" : "test",
					"submlist" : [
						{ "subitem" : "value"}
					]
				})

				//console.log("-->", testList);
			});

			
		});
	}
);
	
