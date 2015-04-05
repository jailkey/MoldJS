Seed({
		name : "Mold.MyTest",
		dna : "test"
	},
	function(MyClass){

		describe("test Mold.MyClass", function(){
			var instance;

			it("create instace of MyClass", function(){
				instance =  new MyClass();
				expect(instance).toBeInstanceOf(MyClass);
			})

			it("check initial value with .getValue", function(){
				expect(instance.getValue()).toBe(42);
				expect(instance.getValue()).not.toBe(23)
			})

			it("set value with .setValue", function(){
				instance.setValue(23);
				expect(instance.getValue()).toBe(23);
				expect(instance.getValue()).not.toBe(43);
			})
		});

	}
);