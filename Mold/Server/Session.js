Seed({
		name : "Mold.Server.Session",
		dna : "static",
		include : [
			"Mold.Server.Cookie",
			"Mold.Lib.Event"
		]
	},
	function(){

		var _sessions = {};

		return  {
			isSession : function(request){
				if(request.headers.cookie && Mold.Server.Cookie.parse(request).sessioncookie){
					if(_sessions[Mold.Server.Cookie.parse(request).sessioncookie]){
						return true;
					}
					return false;
				}
				console.log("cookie ist nicht gesetezt")
				return false;
			},
			create : function(request){
				if(!this.isSession(request)){
					var sessionId = Mold.getId();
					console.log("create Session")
					_sessions[sessionId] = {
						id : sessionId,
						_data : {},
						data : {
							set : function(name, data){
								_sessions[sessionId]._data[name] = data;
							},
							get : function(name){
								return _sessions[sessionId]._data[name];
							}
						}
					}

					_sessions[sessionId].data.set("userevents", new Mold.Lib.Event({}));
					

					return _sessions[sessionId];
				}else{
					return _sessions[Mold.Server.Cookie.parse(request).sessioncookie];
				}
			}
		}
	}
)