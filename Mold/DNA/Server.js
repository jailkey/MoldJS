Seed({
		name : "Mold.DNA.Server",
		dna : "dna",
		include : [
			"->Mold.Server.Server",
			"->Mold.Server.Middlewares.Router"
		]
	},
	{
		name :  "server",
		dnaInit : function(){
		
		},
		create : function(seed) {
			var target = Mold.createChain(Mold.getSeedChainName(seed));


			if(!seed.config){
				throw "Server config is not defined!";
			}
			
			if(!seed.config.ip){
				throw "Server IP is not defined!";
			}

			if(!seed.config.port){
				throw "Server port is not defined";
			}

			var shared = {};

			if(seed.func.startup){
				seed.func.startup(shared);
			}
			
			var server = new Mold.Server.Server(seed.config.ip, seed.config.port, seed.config, shared);

			if(seed.routes){
				server.use(new Mold.Server.Middlewares.Router(seed.routes));
			}


			if(seed.func.process){
				seed.func.process(server);
			}

			return server;
		}
	}
)