Seed({
		name : "Mold.Lib.UrlRouter",
		dna : "class",
		author : "Jan Kaufmann",
		platform : "isomorph",
		include : [
			"Mold.Lib.Observer",
			"Mold.Lib.Sequence",
			"Mold.Defaults.RouteFilter"
		]
	},
	function(routes){
		var _path, 
			_params, 
			_hashes,
			_routes = routes,
			_loadedSeeds = {}, 
			_filter =  [],
			_request = false,
			_response = false, 
			_next = false,
			_session = {};
		
		//var _seed = seed;
		var _events = Mold.Lib.Observer;
		
		var _location =  {
			pathname : "",
			search : "",
			hash : "",
			methode : ""
		};
		
		var _location = (Mold.isNodeJS) ? _location : document.location;
		
		var that = this;

		var _addFilter = function(filter){
			_filter.push(filter);
		}

		Mold.Defaults.RouteFilter(_addFilter);
		
		this.publics =  {
			setLocation : function(location){
				_location = location;
			},
			setServerParameter : function(request, response, session, next){
				_request = request;
				_response = response;
				_session = session;
				_next = next;
			},
			markSeedAsLoaded : function(seedName, seed){
				_loadedSeeds[seedName] = seed;
			},
			removeSeed : function(seedName){
				delete _loadedSeeds[seedName];
			},
			setEventObject : function(events){
				_events = events;
			},
			isSeedLoaded : function(seedName){
				if(_loadedSeeds[seedName]){
					return true;
				}else{
					return false;
				}
			},
			getLoadedSeed : function(seedName){
				return _loadedSeeds[seedName] || false;
			},
			isParameter : function(path, indent, params){
				path = path.replace(indent, "");
				for(var param in params){
					if(params[param] === path){
						return true;
					}
				}
				return false;
			},
			
			isUrl : function(route, path){
				
				route = route.replace("#", "");
				var replaced = false;
				var routeRegExp = route.replace(/(\*|\:)(.*?)(\/|$)/gim, function(){
					replaced = true;
					if(arguments[1] == "*"){
						return "(.*?)"+arguments[3];
					}else{
						return "(.*?)[\/|$]";
					}
					
				});
				routeRegExp += (replaced || routeRegExp === "/") ? "" : "/" ;

				var hashRegExp = new RegExp(routeRegExp , "gim");
				
				if(path.substring(path.length -1, path.length) !== "/"){
					path += "/";
				}
				return hashRegExp.test(path);
			},
			
			isHash : function(route, hash){
				route = route.replace("#", "");
				var routeRegExp = route.replace(/(\*|\:)(.*?)(\/|$)/gim, function(){
					if(arguments[1] == "*"){
						return "(.*?)"+arguments[3];
					}else{
						return "(.*?)[\/|$]";
					}
				});
				
				var hashRegExp = new RegExp(routeRegExp, "gim");
				if(hash.substring(hash.length -1, hash.length) !== "/"){
					hash += "/";
				}
				return hashRegExp.test(hash);
			},
			getParameter : function(route, hash, path, type){
				var value = false;
				if(type === "hash" ){
					route = route.split("#")[1];
					value = hash;
				}else if(type === "path"){
					//route = route.split("#")[1];
					value = path;
				}
			
				var parameterNames = {}
				if(route){
					
					var collectedParameter = [];
					var routeRegExp = route.replace(/(\*|\:)(.*?)(\/|$)/gim, function(){
						collectedParameter.push(arguments[2]);
						if(arguments[1] == "*"){
							if(arguments[3] == ""){
								return "(.*?)$";
							}else{
								return "(.*?)"+arguments[3];
							}
						}else{
							return "(.*?)[\/|$]";
						}
					});
					
					var hashRegExp = new RegExp(routeRegExp, "gim");
					if(value.substring(value.length -1, value.length) !== "/"){
						value += "/";
					}
					
					value.replace(hashRegExp, function(){
						var paramCounter = 0;
						
						for(var i = 1; i < arguments.length-2; i++){
							parameterNames[collectedParameter[paramCounter]] = arguments[i];
							paramCounter++;
						}
					});
					return parameterNames;
				}
			},

			removeMethod : function(route){
				if(route.substring(0,3) === "GET"){
					route = route.substring(3, route.length);
				}
				if(route.substring(0,3) === "PUT"){
					route = route.substring(3, route.length);
				}
				if(route.substring(0,4) === "POST"){
					route = route.substring(4, route.length);
				}
				if(route.substring(0,6) === "DELETE"){
					route = route.substring(6, route.length);
				}
				return route;
			},


			getMethod : function(route){
				if(route.substring(0,3) === "GET"){
					return "GET";
				}
				if(route.substring(0,3) === "PUT"){
					return "PUT"
				}
				if(route.substring(0,4) === "POST"){
					return "POST";
				}
				if(route.substring(0,6) === "DELETE"){
					return "DELETE"
				}
				return false;
			},
			
			parseRoutes : function (routes, path, output){
				var output = output || [],
					path = path || "";
				
				for(var route in routes){
					//clean route from method if it is set
					var cleanRoute = this.removeMethod(route);
					var first = cleanRoute.substring(0,1);
					switch(first){
						case "/":

							if(that.isUrl(cleanRoute, _path)){

								path += first;
								output = that.getNextRoute(routes, route, path, output, "path");

							}
							break;
						case "?":
							if(that.isParameter(cleanRoute, first, _params)){
								output = that.getNextRoute(routes, route, path, output, "param");
							}
							break;
						case "#":
						
							if(that.isHash(cleanRoute, _hashes)){
								output = that.getNextRoute(routes, route, path, output, "hash");
							}
							break;
					}
				}
				return output;
			},
			
			getNextRoute : function(routes, route, path, output, type){

				if( typeof routes[route] === "object"){
					that.parseRoutes(routes[route], path, output);
				}else{
					var parameter = that.getParameter(route, _hashes, _path, type),
						method = that.getMethod(route),
						addRoute = true;

					if(Mold.isNodeJS && method){
						if(method !== _request.method){
							addRoute = false;
						}
					}
					if(addRoute){
						output.push({
							method : method,
							route : routes[route],
							parameter : parameter
						});
					}
				}
				return output;
			},
			

			buildData : function(parameter){

				return {
					method : _request.method || false,
					param : parameter,
					request : _request,
					rawResponse : _response,
					response : _response._moldResponse || false,
					session : _session,
					handler : _events,
					next : _next || function(){}
				}
			},


			/**
			 *
			 * {
			 * 	matcher: function(route){ (expression) }
			 * 	filter : function(route, data, next){}
			 * }
			 */

			addFilter : function(filter){
				_addFilter(filter);
			},

			applyRouteFilters : function(route, data, ready){

				if(typeof route === "string"){
					var routes = route.split("|");
				}else{
					var routes = [route];
				}

				var sequenze = new Mold.Lib.Sequence();
			
				Mold.each(routes, function(selected){
					Mold.each(_filter, function(filter){
						if(filter.matcher(selected)){
							sequenze = sequenze.step(function(next){
								filter.filter(selected, data, next)

							});
						}
					})
					
				});

				sequenze = sequenze.step(function(){
					if(_next){
						console.log("step ready step");
						ready();
					}
				})
			},

			initRoutes  : function(){
				_path = _location.pathname,
				_params = _location.search.replace("?", "").split("&"),
				_hashes = _location.hash.replace("#", "");
				var foundRoutes = that.parseRoutes(_routes);

				if(foundRoutes.length > 0){
					for(var i = 0; i < foundRoutes.length; i++){
						var route = foundRoutes[i];
						var parameter = false;
						if(typeof route === "object"){
							parameter = route.parameter;
							route = route.route;
						}

						var data = this.buildData(parameter);
						this.applyRouteFilters(route, data, _next);
					
					}
					return true;
				}else{
					//console.log("no route found")
					if(!Mold.isNodeJS){
						//Mold.log("Error", { code : 10, dnaname: "urlrouter", error : "No route found! " +_seed.name+ " "});
					}
					return false;
				}
			}
		}
	}
);