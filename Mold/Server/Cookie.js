Seed({
		name : "Mold.Server.Cookie",
		dna : "static"
	},
	function(){

		return {
			parse : function (request) {
				var list = {},
				rc = request.headers.cookie;

				rc && rc.split(';').forEach(function( cookie ) {
					var parts = cookie.split('=');
					list[parts.shift().trim()] = unescape(parts.join('='));
				});

				return list;
			}
		}
	}
)