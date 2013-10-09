Seed({
		name : "Mold.Lib.UrlRouter",
		dna : "class",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.GlobalEvents"
		]
	},
	function(seed){
		var _path, _params, _hashes, _seed, _loadedSeeds = {}, _request = false, _response = false;
		var _seed = seed;
		
		var _location =  {
			pathname : "",
			search : "",
			hash : ""
		};
		
		var _location = (Mold.isNodeJS) ? _location : document.location;
		
		var that = this;
		
		this.publics =  {
			setLocation : function(location){
				_location = location;
			},
			setServerParameter : function(request, response){
				_request = request;
				_response = response;
			},
			markSeedAsLoaded : function(seedName){
				_loadedSeeds[seedName] = true;
			},
			isSeedLoaded : function(seedName){
				if(_loadedSeeds[seedName]){
					return true;
				}else{
					return false;
				}
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
				var routeRegExp = route.replace(/(\*|\:)(.*?)(\/|$)/gim, function(){
					if(arguments[1] == "*"){
						return "(.*?)"+arguments[3];
					}else{
						return "(.*?)[\/|$]";
					}
				});
				var hashRegExp = new RegExp(routeRegExp, "gim");
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
			
			parseRoutes : function (routes, path, output){
				var output = output || [],
					path = path || "";
				
				for(var route in routes){
					var first = route.substring(0,1);
					switch(first){
						case "/":
							if(that.isUrl(route, _path)){
								path += first;
								output = that.getNextRoute(routes, route, path, output, "path");
							}
							break;
						case "?":
							if(that.isParameter(route, first, _params)){
								output = that.getNextRoute(routes, route, path, output, "param");
							}
							break;
						case "#":
						
							if(that.isHash(route, _hashes)){
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
					var parameter = that.getParameter(route, _hashes, _path, type);
					output.push({
						route : routes[route],
						parameter : parameter
					});
				}
				return output;
			},
			
			loadSeed : function(route, parameter){
				Mold.load({ name : route }).bind(function(seedName){
					if(!that.isSeedLoaded(seedName)){
						that.markSeedAsLoaded(seedName);
						var selectedSeed = Mold.getSeed(seedName);
						var dna = Mold.getDNABySeedName(seedName)
						if(dna.createBy){
							switch(dna.createBy){
								case "new":
									if(parameter){
										new selectedSeed(parameter);
									}else{
										new selectedSeed();
									}
									break;
								default:
									break;
							}
						}
					}
				});
			},

			initRoutes  : function(){
				_path = _location.pathname,
				_params = _location.search.replace("?", "").split("&"),
				_hashes = _location.hash.replace("#", "");
				var foundRoutes = that.parseRoutes(_seed.func);
				if(foundRoutes.length > 0){
					for(var i = 0; i < foundRoutes.length; i++){
						var route = foundRoutes[i];
						var parameter = false;
						if(typeof route === "object"){
							parameter = route.parameter;
							route = route.route;
						}
						if(typeof route === "function"){
							if(parameter){
								route(parameter);
							}else{
								route();
							}
						}else if(route.substring(0,1) === "@"){
							if(route.indexOf("@ready->") > -1){
								Mold.ready(function(){
									that.loadSeed(route.split("@ready->")[1], parameter);
								});
							}else{
								Mold.ready(function(){
									
									Mold.Lib.GlobalEvents.trigger(route.replace("@", ""), { urlparameter : parameter, request : _request, response : _response }, { saveTrigger : true });
								});
							}
						}else if(route.substring(0,4) === "Mold"){
							that.loadSeed(route, parameter);
						}
					}
				}else{
					if(!Mold.isNodeJS){
						Mold.log("Error", { code : 10, dnaname: "urlrouter", error : "No route found! " +_seed.name+ " "});
					}
				}
			}
		}
	}
);