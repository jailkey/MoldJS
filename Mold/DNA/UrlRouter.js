Seed({
		name : "Mold.DNA.UrlRouter",
		dna : "dna",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Observer",
			"Mold.Lib.UrlRouter"
		]
	},
	{
		name : "urlrouter",
		create : function(seed){
			
			if(typeof seed.func === "object"){
				var urlRouter = new Mold.Lib.UrlRouter(seed.func);
				//Mold.DNA.UrlRouter.init(seed);
				urlRouter.initRoutes();
				if(typeof window != "undefined" && window){
					if(!seed.onhashchange || seed.onhashchange !== "disabled"){
						window.addEventListener("hashchange", urlRouter.initRoutes, false);
					}
				}else if(Mold.isNodeJS){
					Mold.Lib.Observer.sub("location.update", function(data){
						urlRouter.setLocation(data.data.location);
						urlRouter.setServerParameter(data.data.request, data.data.response, data.data.session);
						urlRouter.initRoutes();
					});
				}
			}
			
		}
	}
);