Seed(
	{ 
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Lib.Touch",
			"external->Mold.Lib.Element"
		]
	},
	function(){


		var canvas = new Mold.Lib.Element("div");

		document.querySelector("body").appendChild(canvas);

		canvas.css({
			height : "400px",
			width : "300"
		});

		var touchi = new Mold.Lib.Touch(canvas);
		
		touchi.on("pinch.in", function(){
			console.log("zomm in")
		
		}).on("pinch.out", function(){
			console.log("zomm out")
		
		}).on("single.tap", function(e){
			console.log("Single Tab")
		
		}).on("double.tap", function(e){
			console.log("DoubleTab")
		}).on("hold", function(){
			console.log("HOLD");
		}).on("swipe.right", function(){
			console.log("Swipe right")
		}).on("swipe.left", function(){
			console.log("Swipe left")
		}).on("swipe.up", function(){
			console.log("Swipe up")
		}).on("swipe.down", function(){
			console.log("Swipe down")
		}).on("rotate", function(){
			console.log("rotate")
		}).on("drag.down", function(){
			console.log("drag down")
		}).on("drag.up", function(){
			console.log("drag up")
		});

	}
);