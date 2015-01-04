Seed(
	{ 
		name : "Mold.Server.RestServer",
		dna : "class",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Observer",
			"Mold.Server.Session",
			"Mold.Lib.Sequence"
		],
		description : "",
		version : 0.1
	},
	function(ip, port, config){
		
		var http = Mold.node.require('http');
		var that = this;
		var _routes = [];
		var _middlewares = [];

		Mold.mixin(this, new Mold.Lib.Event(this));

		var _getSequence = function(){

		}
		
		var _startServer = function(){
			process.on('uncaughtException', function (error) {
			   console.log(error.stack);
			});

			try{
				http.createServer(function (req, res) {
					var session = Mold.Server.Session.create(req);
					var sequenze = new Mold.Lib.Sequence();

					session.data.set('location', {
						pathname : req.url.split("?")[0],
						search : (req.url.split("?").length > 1) ? req.url.split("?")[1] : "" ,
						hash : ""
					})


					Mold.each(_middlewares, function(middleware){
						sequenze = sequenze.step(function(next){
							middleware.call(null, req, res, session, next);
						});
					});


				}).listen(port, ip);

				console.log("server started")

			}catch(e){
				console.log("Fehler", e);
			}
		}
		
		Mold.Lib.Observer.on("redirect", function(){
			//console.log("redirect");
		});
	
		_startServer();
		this.publics = {
			start : _startServer,
			route : function(route){
				_routes.push(route);
			},
			use : function(middleware){
				if(middleware.action){
					_middlewares.push(middleware.action);
				}else{
					_middlewares.push(middleware);
				}
				return this;
			}
		}
	}
);