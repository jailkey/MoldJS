Seed({
		name : "Mold.DNA.SessionRouter",
		dna : "dna",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.GlobalEvents",
			"Mold.Lib.UrlRouter"
		]
	},
	{
		name : "sessionrouter",
		create : function(seed){

			var target = Mold.createChain(Mold.getSeedChainName(seed));
	
			target[Mold.getTargetName(seed)] = function (session){
				var router = new Mold.Lib.UrlRouter(seed);
				router.initRoutes();
				router.setEventObject(session.data.get("userevents"));
				session.data.get("userevents").on("location.update", function(data){
					router.setLocation(data.data.location );
					router.setServerParameter(data.data.request, data.data.response, data.data.session);
					router.initRoutes();
				});
				return router;
			}
			
		}
	}
);