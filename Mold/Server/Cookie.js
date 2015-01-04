Seed({
		name : "Mold.Server.Cookie",
		dna : "static"
	},
	function(){

		return {
			parse : function (request) {
				
				var list = {},
					requestCookie = request.headers.cookie;

				requestCookie && requestCookie.split(';').forEach(function( cookie ) {
					var parts = cookie.split('=');
					list[parts.shift().trim()] = unescape(parts.join('='));
				});

				return list;
			}
		}
	}
)