Seed(
	{ 
		name : "Mold.Server.RestServer",
		dna : "class",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Observer",
			"Mold.Server.Session"
		],
		description : "",
		version : 0.1
	},
	function(ip, port, config){
		
		var http = require('http');
		var that = this;
		var _routes = [];
		Mold.mixing(this, new Mold.Lib.Event(this));
		
		var _startServer = function(){
			process.on('uncaughtException', function (error) {
			   console.log(error.stack);
			});
			try{
			
			http.createServer(function (req, res) {
				var session = Mold.Server.Session.create(req);
				that.trigger("ready", { request : req, result : res, session : session} );
				if(!session.data.get("routes")){
					session.data.set("routes", []);
					Mold.each(_routes, function(route){
						session.data.set("routes", new route(session));
					});
				}
				var location =  {
					pathname : req.url.split("?")[0],
					search : (req.url.split("?").length > 1) ? req.url.split("?")[1] : "" ,
					hash : ""
				};			
				
				session.data.get("userevents").trigger("location.update", { location : location, request : req, response : res, session : session });

			}).listen(port, ip);
			
			}catch(e){
				console.log("Fehler", e);
			}
		}
		
		Mold.Lib.Observer.on("redirect", function(){
			//console.log("redirect");
		});
		console.log("start server");
	
		this.publics = {
			start : _startServer,
			addRoute : function(route){
				_routes.push(route);
			}
		}
	}
);