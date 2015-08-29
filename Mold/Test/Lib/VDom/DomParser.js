Seed({
		name: "Mold.Test.Lib.VDom.DomParser",
		dna : "test"
	},
	function(VDomParser){
		xdescribe("Test Mold.Lib.VDom.DomParser", function(){
			console.log("test dom parser")
			var result = false;
			var input = document.createElement("div");
			input.innerHTML = '    <a href="{{attribute}}"> Hans {{nachname}} - {{beruf}}</a>';

			it("Load NodeBuilder before", function(done){
				Mold.load({ name : "Mold.Lib.VDom.NodeBuilder"}).bind(done);
			})


			it("parse child nodes", function(){
				result = VDomParser(input.childNodes);
			
			})

			it("check if result has correct vDomNodes", function(){
				//expect(result[1].nachname).toBeDefined();
				//expect(result[1].beruf).toBeDefined();
			});
		})
	}
)