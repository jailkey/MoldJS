Seed({
		name : "Mold.Test.Lib.ArrayObserver",
		dna : "test"
	},
	function(ArrayObserver){

		var testArray = false,
			observer,
			test = false;;

		describe("Test Mold.Lib.ArrayObserver", function(){

			it("create test array", function(){
				testArray = [
					"one",
					"two",
					"three",
					"four",
					"five"
				]

				observer = new ArrayObserver(testArray)
			})

			it("observe push", function(done){
				test = function(data){
					expect(data.type).toBe("splice");
					expect(data.addedCount).toBe(1);
					expect(data.index).toBe(5);
					expect(data.object.length).toBe(6);
					expect(data.object[5]).toBe("six");
					expect(data.removed.length).toBe(0);
					observer.unobserve(test);
					done();
				}

				observer.observe(test)

				testArray.push("six");
			});

			it("observe splice", function(done){
				test = function(data){

					expect(data.type).toBe("splice");
					expect(data.addedCount).toBe(3);
					expect(data.index).toBe(2);
					expect(data.object.length).toBe(7);
					expect(data.object[4]).toBe("nine");
					expect(data.object[6]).toBe("six");
					expect(data.removed.length).toBe(2);
					expect(data.removed[0]).toBe("three");
					expect(data.removed[1]).toBe("four");
					observer.unobserve(test);
					done();
				}
				observer.observe(test)

				testArray.splice(2, 2, "seven", "eight", "nine");

			});

			it("observe pop", function(done){
				test = function(data){
					expect(data.type).toBe("splice");
					expect(data.addedCount).toBe(0);
					expect(data.index).toBe(6);
					expect(data.object.length).toBe(6);
					expect(data.object[4]).toBe("nine");
					expect(data.object[5]).toBe("five");
					expect(data.removed.length).toBe(1);
					expect(data.removed[0]).toBe("six");
					observer.unobserve(test);
					done();
				}
				observer.observe(test)

				testArray.pop();

			});


			it("observe shift", function(done){
				test = function(data){
					expect(data.type).toBe("splice");
					expect(data.addedCount).toBe(0);
					expect(data.index).toBe(0);
					expect(data.object.length).toBe(5);
					expect(data.removed.length).toBe(1);
					expect(data.removed[0]).toBe("one");
					observer.unobserve(test);
					done();
				}
				observer.observe(test)

				testArray.shift();

			});

			it("observe unshift", function(done){
				test = function(data){

					expect(data.type).toBe("splice");
					expect(data.addedCount).toBe(3);
					expect(data.index).toBe(0);
					expect(data.object.length).toBe(8);
					expect(data.object[0]).toBe("one");
					expect(data.removed.length).toBe(0);
					observer.unobserve(test);
					done();
				}
				observer.observe(test)

				testArray.unshift("one", "two", "three");

			});

			it("observe modifie array value", function(done){
				test = function(data){
				
					expect(data.type).toBe("update");
					expect(data.oldValue).toBe("one");
					expect(data.name).toBe("0");
					expect(data.object.length).toBe(8);
					observer.unobserve(test);
					done();
				}
				observer.observe(test)

				testArray[0] = "ten";

			});


		});
	}
)