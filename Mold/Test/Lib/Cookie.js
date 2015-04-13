Seed({
		name : "Mold.Test.Lib.Cookie",
		dna : "test"
	},
	function(Cookie){
		
		describe("Test Mold.Lib.Cookie", function(){
			var instance;
			var cookieString = "myCookie2= myValue2; Expires=Fri, 26 Dec 2014 17:23:52 GMT; HttpOnly";

			it("create instance with cookie content", function(){
				instance = new Mold.Lib.Cookie(cookieString);
				expect(instance.get("myCookie2")).toBe(" myValue2");
				expect(instance.get("HttpOnly")).toBe(true);
			})

			it("set more cookievalue", function(){
				instance.set("myCookie3", "hans");
				expect(instance.get("myCookie3")).toBe("hans");
			})

			it("get cookieString", function(){
				expect(instance.getString()).toBe("myCookie2= myValue2;Expires=Fri;26 Dec 2014 17:23:52 GMT=true;HttpOnly=true;myCookie3=hans;");
			});
		})
	}
)