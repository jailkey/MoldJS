Seed({
		name : "Mold.Router",
		dna : "class",
		include : [
			"->Mold.Lib.UrlRouter",
			"->Mold.Server.Middleware"
		]
	},
	function(data){

		var routerInstances = {};

		return new Mold.Server.Middleware("router", function(req, res, session, next){
			getInstance(session);
			var router = new Mold.Lib.UrlRouter(data);
			router.setLocation(session.data.get('location'));
			router.setServerParameter(req, res, session, next);
			console.log("init")
			if(!router.initRoutes()){
				res._moldResponse.fileNotFound();
				if(!res._moldResponse.routesFound){
					res._moldResponse.noRoutesFound = true;
				}
				next();
			}else{
				res._moldResponse.routesFound = true;
			}
		})
	}
)