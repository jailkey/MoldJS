Seed({
		name : "Mold.Server.Session",
		dna : "static",
		platform : "node",
		include : [
			"Mold.Server.Cookie",
			"Mold.Lib.Event"
		]
	},
	function(){

		var _sessions = {};

		return  {
			isSession : function(request){
				var cookie =  Mold.Server.Cookie.parse(request).sessioncookie;
				if(request.headers.cookie && cookie){
					var currentSession = _sessions[cookie];
					if(currentSession){
						if(currentSession.ip !== request.connection.remoteAddress){
							delete _sessions[Mold.Server.Cookie.parse(request).sessioncookie];
							return false;
						}
						return true;
					}
					return false;
				}
				return false;
			},
			create : function(request){
				if(!this.isSession(request)){
					var sessionId = Mold.getId();
					console.log("IP", request.connection.remoteAddress)
					_sessions[sessionId] = {
						id : sessionId,
						_data : {},
						ip : request.connection.remoteAddress,
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
			},
			delete : function(sessionId){
				delete _sessions[sessionId];
			}
		}
	}
)