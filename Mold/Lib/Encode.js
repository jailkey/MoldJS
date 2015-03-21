Seed({
		name : "Mold.Lib.Encode",
		dna : "static"
	},
	function(){
		
		
		return {
			encodeUTF8 : function(raw){
				return unescape(encodeURIComponent(raw));
			},
			decodeUTF8 : function(utf8){
				return decodeURIComponent(escape(utf8));
			},
			encodeHTML : function(markup){
				return markup.replace(/&/g, '&amp;')
							.replace(/"/g, '&quot;')
							.replace(/'/g, '&#39;')
							.replace(/</g, '\<')
							.replace(/>/g, '\>');
			},
			convertSpecialChars : function(input){
				input = input.replace(/<br>/g, "\n");
				return input;
			},
			decodeUnicode : function(input){
				return unescape(JSON.parse('"' + input.replace('"', '\\"')) + '"');
			},
			encodeURl : function(input){
				return encodeURIComponent(input);
			},
			decodeURL : function(input){
				return decodeURIComponent(input);
			},
			encodeBase64 : function(input){
				if(Mold.isNodeJs){
					return new Buffer(input).toString('base64')
				}
				if(!window.btoa){
					return input;
				}
				return  window.btoa(unescape(encodeURIComponent( input )));
			},
			decodeBase64 : function(input){
				if(Mold.isNodeJs){
					return new Buffer(input, 'base64').toString('utf8');
				}
				if(!window.atob){
					return input;
				}
				return  decodeURIComponent(escape(window.atob( input )));
			}
		}
	}
);