Seed(
	{ 
		name : "Mold.Server.Server",
		dna : "class",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Observer",
			"Mold.Server.Session",
			"Mold.Lib.Sequence",
			"Mold.Server.Middleware",
			"Mold.Lib.Header",
			"Mold.Server.Response",
			"Mold.Lib.Path",
			"Mold.Server.Middlewares.Router"
		],
		description : "",
		version : 0.1,

	},
	function(ip, port, config, shared){

		var config = config || {};
		
		var http = Mold.node.require('http'),
			fs = require("fs"),
			normalize = require("path").normalize,
			_routes = [],
			_projectFile =  Mold.getProjectFile(),
			_clientRepo = (_projectFile.client) ? _projectFile.client['local-repository'] : false,
			_sharedClientAlias = (_projectFile.client) ? _projectFile.client['shared-alias'] : false,
			_sharedRepo = (_projectFile.shared) ? _projectFile.shared : false,
			_standardIndexFile = config.indexFile || "index.html"
			_middlewares = {
				"start" : [],
				"middle" : [],
				"end" : [],
			};


		Mold.mixin(this, new Mold.Lib.Event(this));

		var _use = function(middleware, position){
			position = position || "middle";
			if(middleware.action){
				_middlewares[position].push(middleware.action);
			}else{
				_middlewares[position].push(middleware);
			}
		}

		var _startServer = function(){
			process.on('uncaughtException', function (error) {
			   console.log(error.stack);
			});

			try{
				http.createServer(function (req, res) {
					req.config = config;
					req.shared = shared;
					var session = Mold.Server.Session.create(req);
					var sequenze = new Mold.Lib.Sequence();

				

					session.data.set('location', {
						pathname : req.url.split("?")[0],
						search : (req.url.split("?").length > 1) ? req.url.split("?")[1] : "" ,
						hash : ""
					})

					req.session = session;


					Mold.each(_middlewares["start"], function(middleware){
						sequenze = sequenze.step(function(next){
							middleware.call(null, req, res, next);
						});
					});

					Mold.each(_middlewares["middle"], function(middleware){
						sequenze = sequenze.step(function(next){
							middleware.call(null, req, res, next);
						});
					});

					Mold.each(_middlewares["end"], function(middleware){
						sequenze = sequenze.step(function(next){
							middleware.call(null, req, res, next);
						});
					});

				}).listen(port, ip, function(){

					//reset user process user if startet with sudo to avoid running nodejs with root permissions
					var uid = parseInt(process.env.SUDO_UID);
				    if (uid){
				    	process.setuid(uid);
				    }
				});

			

			}catch(e){
				throw e;
			}
		}

		var _addStandardMiddleWare = function(){
			
			//add repsonse methodes/propertys
			_use(function(req, res, next){
				res._moldResponse  = new Mold.Server.Response(res);
				next();
			}, "start");


			//Content Methodes
			_use(function(req, res, next){
				res.addData = function(data, type){
					res._moldResponse.addData(data, type);
				}
				res.addFile = function(file){
					res._moldResponse.addFile(file);
				}
				res.redirect = res._moldResponse.redirect;
				next();
			}, "start");


			//add shared root alias for client if exists
			if(_sharedClientAlias){
				var sharedRoute = {}
				sharedRoute['GET/' + _sharedClientAlias + '*'] = function(e){
					var currentDir = process.cwd(),
						queryPath = currentDir + _sharedRepo + e.data.request.url.replace("/"+_sharedClientAlias, "");

					e.data.response.addFile(normalize(queryPath));
					e.data.next();
				}
				var shared = new Mold.Server.Middlewares.Router(sharedRoute);
				_use(shared, "start");
			}


			//handle static files
			_use(function(req, res, next){
				if(res._moldResponse.noRoutesFound){
					if(_clientRepo){
						var path =  normalize(_clientRepo + Mold.Lib.Path.getRelativePathName(req.url));
						if(!fs.existsSync(path) || fs.lstatSync(path).isDirectory()){
							path = normalize(path + "/" + _standardIndexFile);
							if(!fs.existsSync(path)){
								res._moldResponse.fileNotFound();
								next();
								return;
							}
						}
						res._moldResponse.addFile(path);
					}else{
						res._moldResponse.fileNotFound();
					}
				}
				next();
			}, "end");


		//handle end
			_use(function(req, res, next){
				res._moldResponse.create();
				next();
			}, "end");

		}
		

		//Start
		_startServer();
		_addStandardMiddleWare();

		this.publics = {
			start : _startServer,
			route : function(route){
				_routes.push(route);
			},
			use : function(middleware, position){
				_use(middleware)
				return this;
			}
		}
	}
);