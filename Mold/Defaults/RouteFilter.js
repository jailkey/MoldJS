Seed({
		name : "Mold.Defaults.RouteFilter",
		dna : "static",
		include : [
			{ JsonParser : "Mold.Server.Middlewares.JsonParser" },
			{ UrlencodingParser : "Mold.Server.Middlewares.UrlencodingParser" },
			{ Multipart : "Mold.Server.Middlewares.MultipartParser" }
		]
	},
	function(){

		return function(addFilter){
			//Eventfilter
			addFilter({
				matcher : function(route){
					return Mold.startsWith(route, "@");
				},
			  	filter : function(route, data, next){
		 			if(data.handler.trigger){
						data.handler.trigger(route.replace("@", ""), data, { saveTrigger : true });
					}else{
						console.log("no seed trigger found")
					}
				
			 	}
			});

			//Seed Filter
			addFilter({
				matcher : function(route){
					return Mold.startsWith(route, "Mold.");
				},
				filter : function(route, data, next){
					data.session.seeds = data.session.seeds || {};
						
					var triggerMethodEvent = function(handler, data){
						
						if(handler.actions["@"+data.method.toUpperCase()]){
							handler.trigger(data.method.toUpperCase(), data);
						};
					}

					if(data.session.seeds[route]){
						console.log("get instance")
						data.handler = data.session.seeds[route];
						triggerMethodEvent(data.handler, data)
						next();
					}else{

						Mold.load({ name : route}).bind(function(){
							
							
							var selectedSeed = Mold.getSeed(route);
							var dna = Mold.getDNABySeedName(route);

							if(dna.createBy && dna.createBy === "new"){
								data.handler = new selectedSeed();
							}else{
								data.handler = selectedSeed();
							}
				
							data.session.seeds[route] = data.handler;
							triggerMethodEvent(data.handler, data)
							next();
						})
					}
				}
			});

			//function filter
			addFilter({
				matcher : function(route){
					return typeof route === "function"
				},
				filter : function(route, data, next){
					route({ data : data});
					next();
				}
			});

			//redirect filter
			addFilter({
				matcher : function(route){
					return /^[234]0[0-9]/.test(route);
				},
				filter : function(route, data, next){
		
					var parts =  route.split(":"),
						statusCode = Mold.trim(parts[0]),
						url = (parts[1]) ? Mold.trim(parts[1]) : false;
		
					if(data.response){
						data.response.setStatus(statusCode, url);
						next();
					}
				}
			})


			//body parser json
			if(Mold.isNodeJS){
				

				addFilter({
					matcher : function(route){
						return route === "json"
					},
					filter : function(route, data, next){
						var parser = JsonParser();
						parser.action(data.request, false, next);
					}
				});

				addFilter({
					matcher : function(route){
						return route === "urlencode"
					},
					filter : function(route, data, next){
						var parser = UrlencodingParser();
						parser.action(data.request, false, next);
					}
				});

				addFilter({
					matcher : function(route){
						return route === "multipart"
					},
					filter : function(route, data, next){
						var parser = Multipart()
						parser.action(data.request, data.response, next);
					}
				});

			}
		}
	}
)