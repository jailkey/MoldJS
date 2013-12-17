Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Component.SlideShow"
		]
	},
	function(){
		console.log("SlideShow")
		var slideShow = new Mold.Component.SlideShow();
		console.log(slideShow);
		slideShow.append(document)
	}
);