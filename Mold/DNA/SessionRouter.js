Seed({
		name : "Mold.DNA.SessionRouter",
		dna : "dna",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Observer",
			"Mold.Lib.UrlRouter"
		]
	},
	{
		name : "sessionrouter",
		create : function(seed){

			//var target = Mold.createChain(Mold.getSeedChainName(seed));
	
			return function (session){
				var router = new Mold.Lib.UrlRouter(seed.func);
				router.initRoutes();
				router.setEventObject(session.data.get("userevents"));

				session.data.get("userevents").on("location.update", function(data){
					router.setLocation(data.data.location);
					console.log("LOCATION UPDATE")
					router.setServerParameter(data.data.request, data.data.response, data.data.session);
					router.initRoutes();
				});
				return router;
			}
			
		}
	}
);