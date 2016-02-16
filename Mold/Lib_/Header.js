Seed({
		name : "Mold.Lib.Header",
		type : "class"
	},
	function(input){

		var _header  = {
			'content-type' : false,
			'mime-type' : false,
			'encoding' : false,
		}

		var _mimeTypes = [
			{ 'html' : 'text/html' },
			{ 'text' : 'text/html' },
			{ 'js' : 'text/javascript' },
			{ 'json' : 'application/json' },
			{ 'css' : 'text/css' },
			{ 'png' : 'image/png' },
			{ 'gif' : 'image/gif' },
			{ 'jpg' : 'image/jpeg' },
			{ 'ico' : 'image/x-icon' },
			{ 'ogg' : 'audio/ogg' },
			{ 'ebm' : 'video/webm' }
		]


		var _httpStatusCodes = {
			//infformation
			"continue"  : 100, "switching-protocol" : 101, "processing" : 102,
			//successfull operations
			"ok" : 200, "created" : 201, "accepted" : 202, "non-authoritative-information" : 203,
			"no-content" : 204, "reset-content" : 205, "partial-content" : 206, "multi-status" : 207,
			"already-reported" : 208, "im-used" : 226,
			//redirects
			"multiple-choices" : 300, "moved-permanently" : 301, "found" : 302, "see-other" : 303,
			"use-proxy" : 305, "temporary-redirect" : 307, "permanent-redirect" : 308,
			//client error
			"bad-request" : 400, "unauthorized" : 401, "payment-required" : 402, "forbidden" : 403,
			"not-found" : 404, "method-not-allowed" : 405, "not-acceptable" : 406, "proxy-authentication-required" : 407,
			"request-time-out" : 408, "conflict" : 409, "gone" : 410, "length-required" : 411,
			"request-entity-too-large" : 413, "request-url-too-long" : 414, "unsupported-media-type" : 415,
			"requested-range-not-satisfiable" : 416, "expectation-failed" : 417, "i-am-a-teapot" : 418, //use 200
			"policy-not-fulfilled" : 420, "too-many-connections" : 421, "unprocessable-entity" : 422, "locked" : 423,
			"failed-dependency" : 424, "unordered-collection" : 425, "upgrade-required" : 426, 	"precondition-required" : 428,
			"too-many-requests" : 429, "request-header-fields-too-large" : 431, "no-response" : 444,
			//server error
			"internal-server-error" : 500, "not-implemented" : 501, "bad-gateway" : 502, "service-unavailable" : 503,
			"gateway-time-out" : 504, "http-version-not-supported" : 505, "variant-also-negotiates" : 506,
			"insufficient-storage" : 507, "loop-detected" : 508, "bandwidth-limit-exceeded" : 509, "not-extended" : 510
		}



		var _getMimeType = function (type){

			var result = false;
			Mold.some(_mimeTypes, function(mime){
				return Mold.some(mime, function(name, selectedType){
					if(type == selectedType){
						result = name;
						return true;
					}
				});
			});
			return result;

		}

		var _getType = function (mimeType){
			var result = false;
			Mold.some(_mimeTypes, function(mime){
				return Mold.some(mime, function(name, selectedType){
					if(mimeType == name){
						result = selectedType;
						return true;
					}
				});
			});
			return result;
		}

		var _parseValue = function(){

		}

		var _parseHeader = function(header){

			if(Mold.isObject(header)){
				var lines = header;
			}else{
				var lines = header.split(/(\r\n|\n)/);
			}

			Mold.each(lines, function(line, name){
				line = line.replace(/(\r\n|\n)/, '');

				if(line != ""){
					if(Mold.isObject(header)){
						//clean parts
						_header[name] = Mold.trim(line.split(";")[0]);
					}else{
						var parts = line.split(":"),
							name = Mold.trim(parts[0]).toLowerCase(),
							values = parts[1].split(";");

							Mold.each(values, function(value){
							value = Mold.trim(value);
							switch(name){
								case 'content-type':
									if((type = _getType(value) )){
										_header['content-type'] = value;
										_header['mime-type'] = value;
									}
									break;
								default:

								
							}
						});
					}

					
				}
			});
		}

		if(input){
			_parseHeader(input);
		}

		this.publics = {
			getMimeType : _getMimeType,
			getType :  _getType,
			getStatusCode : function(name){
				return _httpStatusCodes[name] || false;
			},
			get : function(type){
				if(type){
					return _header[type.toLowerCase()] || false;
				}
				return _header;
			},
			set : function(type, value){
				_header[type.toLowerCase()] = value;
			}
		}
	}
);