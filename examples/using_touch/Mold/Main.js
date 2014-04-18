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
		console.log("test")
		var canvas = new Mold.Lib.Element("div");

		document.querySelector("body").appendChild(canvas);

		canvas.css({
			height : "400px",
			width : "300"
		});

		canvas.on('touchstart', function(e){
			//e.preventDefault();
		});
		canvas.on('touchmove', function(event) {
			console.log("touchemove", event)
			 event.preventDefault();
		});

	}
);