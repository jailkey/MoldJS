Seed({
		name : "Mold.Lib.Cookie",
		dna : "class",
		test  : "Mold.Test.Lib.Cookie"
	},
	function(cookieString){

		var _cookies = {};

		//thanks to http://stackoverflow.com/questions/4003823/javascript-getcookie-functions/4004010#4004010
		var _parseCookies = function(content){

		 	var version = 0, cookies = {};
			if (content.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
				content = RegExp.$1;
				version = 1;
			}
			if (version === 0) {
				content.split(/[,;]/).map(function(cookie) {
					
					var parts = cookie.split(/=/, 2),
						name = decodeURIComponent(parts[0].trimLeft()),
						value = parts.length > 1 ? decodeURIComponent(parts[1].trimRight()) : null;
		
					if(name && !value){
						cookies[name] = true;
					}else{
						cookies[name] = value;
					}
				});
			} else {
				content.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g).map(function($0, $1) {
					var name = $0,
					value = ($1.charAt(0) === '"') ? $1.substr(1, -1).replace(/\\(.)/g, "$1") : $1;
					cookies[name] = value;
				});
			}
			return cookies;
		}

		if(cookieString){
			_cookies = _parseCookies(cookieString);
		}

		this.publics = {
			getString : function(){
				var output = "";
				Mold.each(_cookies, function(value, name){
					output += name + "=" + decodeURIComponent(value) + ";";
				});
				return output;
			},
			get : function(attribute){
				if(!attribute){
					return _cookies;
				}else{
					return _cookies[attribute];
				}
				return _cookies;
			},
			set : function(attribute, value){
				_cookies[attribute] = value;
			}
		}
	}
)