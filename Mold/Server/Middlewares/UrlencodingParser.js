Seed({
		name : "Mold.Server.Middlewares.UrlencodingParser",
		dna : "middleware",
		platform : "node",
		include : [
			"Mold.DNA.Middleware",
			{ Encoder : "Mold.Lib.Encode" }
		],

	},
	function(){

		return function(req, res, next){
			if(req.body){
				throw new Error("Request body is already defined!")
			}
			
			if(req.headers['content-type'] !== 'application/x-www-form-urlencoded'){
				throw new Error("Can only parse content-type application/json as json!");
			}

			req.body  = {};

		
			req.on("data", function(chunk){
				var data = chunk.toString('utf8');
				var vars = data.split("&");
				Mold.each(vars, function(value){
					var splited = value.split("=");
					splited[1] = splited[1].replace(/\+/g, " ");
					splited[0] = splited[0].replace(/\+/g, " ");
					req.body[Encoder.decodeURL(splited[0])] = Encoder.decodeURL(splited[1]);
				})
			});

			req.on("end", function(){

				next();
			});
		}
	}
);