Seed({
		name : "Mold.Server.Session",
		dna : "static",
		platform : "node",
		include : [
			"Mold.Lib.Cookie",
			"Mold.Lib.Event"
		]
	},
	function(){

		var _sessions = {};
		var _timeout = 100000;
		var _that = this;

		var _remove = function(sessionId){
			delete _sessions[sessionId];
		}

		return  {
			sessionTimout : function(timeout){
				_timeout = timeout;
			},
			refreshSession : function(sessionId){
				var currentSession = _sessions[sessionId];
			
				if(currentSession){

					clearTimeout(currentSession.timeout);
					currentSession.timeout = setTimeout(function(){
						_that.remove(sessionId);
					}, _timeout);
				}
			},
			isSession : function(cookieString){
				if(cookieString){
					var cookie =  new Mold.Lib.Cookie(cookieString);
					
					if(cookie){
						var sessionId = cookie.get("sessionId")
						var currentSession = _sessions[sessionId];
						if(currentSession){
							this.refreshSession(sessionId);
							return sessionId;
						}
						return false;
					}
				}
				return false;
			},
			create : function(request){
				var sessionId;
				if(!(sessionId = this.isSession(request.headers.cookie)) ){

					sessionId = Mold.getId();
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
						},
						timeout : setTimeout(function(){
							console.log("Timeout", sessionId);
							clearTimeout(_sessions[sessionId].timeout);
						
							_remove(sessionId);
						}, _timeout)
					}

					_sessions[sessionId].data.set("userevents", new Mold.Lib.Event({}));
					return _sessions[sessionId];
				}else{
					console.log("session is defined")
					return _sessions[sessionId];
				}
			},
			remove : function(sessionId){
				_remove(sessionId);
			}
		}
	}
)