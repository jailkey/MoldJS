Seed({
		name : "Mold.Server.Middlewares.JsonParser",
		dna : "middleware",
		platform : "node",
		include : [
			"Mold.DNA.Middleware",
		],

	},
	function(){

		return function(req, res, next){
			if(req.body){
				throw new Error("Request body is already defined!")
			}
			
			if(req.headers['content-type'] !== 'application/json'){
				throw new Error("Can only parse content-type application/json as json!");
			}

			req.body =  {};
		
			req.on("data", function(chunk){
				var data = chunk.toString('utf8');
				req.body = JSON.parse(data);
			});

			req.on("end", function(){
				next();
			});
			
		}
	}
);