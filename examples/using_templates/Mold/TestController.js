Seed({
		name : "Mold.TestController",
		dna : "controller",
		include : [
			"Mold.TestView",
			"external->Mold.DNA.Controller",
			"external->Mold.Lib.Observer"
		]
	},
	function(config){

	//	console.log("controller test", config);
		
		var view = this.register(new Mold.TestView());

		var observer = new Mold.Lib.Observer(config, {
			"*" : "@config.change",
			"image.len" : "@image.added",
			"image.*.*" : function(){
				console.log("IMAGE ATTRIBUTE CHANGE", arguments)
			}
		});

		console.log("start", config)

		observer.on("config.change", function(e){
			console.log("config data change", e.data, config)

		})

		observer.on("image.attribute.change", function(e){
			console.log("image.attribute.title.change", e.data, config)

		})

		observer.on("image.added", function(e){
			console.log("image added", config)

		})



/*

		this.observe(config, {
			"*" : "@config.change"
			"image.len" : "@image.added",
			"@image.attribute.title.change" : "image[*].title"
		})

		window.setInterval(
			function(){
				console.log(config);
			}, 
			20000
		);
*/
		

		//console.log("scope", this.scope);
	}
)