Seed({
		name : "Mold.Server.Middlewares.JsonParser",
		dna : "middleware",
		include : [
			"Mold.DNA.Middleware",
		]
	},
	function(){

		return function(req, res, next){
				console.log(req)

		}
	}
);