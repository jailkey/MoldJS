Seed({
		name : "Mold.Server.Middlewares.Router",
		dna : "middleware",
		include : [
			"Mold.DNA.Middleware",
			"Mold.Lib.UrlRouter"
		]
	},
	function(data){

		return function(req, res, next){

			var router = new Mold.Lib.UrlRouter(data);
			var session = req.session;
			router.setLocation(session.data.get('location'));
			router.setServerParameter(req, res, session, next);

			if(!router.initRoutes()){
				res._moldResponse.fileNotFound();
				if(!res._moldResponse.routesFound){
					res._moldResponse.noRoutesFound = true;
				}
				next();
			}else{
				res._moldResponse.routesFound = true;
			}
		}
	}
)