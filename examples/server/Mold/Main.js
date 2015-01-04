Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"->Mold.Server.RestServer",
			"->Mold.Server.Middleware",
			"Mold.Router"
		]
	},
	function(){

		var server = new Mold.Server.RestServer('127.0.0.1', '1137');


		server.use(function(req, res, session, next){
			console.log("one")
			req.test = "Irgendwas"

			res.writeJSON = function(data){
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(data));
				res.end();
			}

			next();
		})

		var router = new Mold.Router({
			'/test/:name/:id' : 'Mold.Test',
			'/wasanderes' : 'Mold.Test2'
		});

		console.log(router);
		
		server.use(router)

		

		server.use(function(req, res, session, next){
			console.log("two")
			next();
		});


		server.use(function(req, res, session, next){
			console.log("three")
			setTimeout(next, 1000);
		});


		server.use(function(req, res, session, next){
			console.log("four")
			next();
		});


		//server.route(Mold.Router)
	}
)