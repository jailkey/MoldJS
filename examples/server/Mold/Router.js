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

		var getInstance = function(session){
			console.log(session);

		}

		return new Mold.Server.Middleware("router", function(req, res, session, next){
			getInstance(session);
			var router = new Mold.Lib.UrlRouter(data);
			router.setLocation(session.data.get('location'));
			router.setServerParameter(req, res, session, next);
			router.initRoutes();
	
		})
	}
)