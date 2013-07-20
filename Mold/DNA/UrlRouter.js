Seed({
		name : "Mold.DNA.UrlRouter",
		dna : "dna",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.GlobalEvents",
			"Mold.Lib.UrlRouter"
		]
	},
	{
		name : "urlrouter",
		create : function(seed){			
		
			try{
				if(typeof seed.func === "object"){
					var urlRouter = new Mold.Lib.UrlRouter(seed);
					//Mold.DNA.UrlRouter.init(seed);
					urlRouter.initRoutes();
					if(typeof window != "undefined" && window){
						if(seed.onhashchange && seed.onhashchange === "update"){
							window.addEventListener("hashchange", urlRouter.initRoutes, false);
						}
					}else if(Mold.isNodeJS){
						Mold.Lib.GlobalEvents.on("location.update", function(data){
							urlRouter.setLocation( data.data.location );
							urlRouter.initRoutes();
						});
					}
				}
			}catch(e){
				Mold.log("Error", { code : 3, dnaname: "urlrouter", error : e});
			}
		}
	}
);