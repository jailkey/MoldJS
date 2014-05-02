Seed({
		name : "Mold.Lib.Coder",
		dna : "static"
	},
	function(){
		return {
			encodeUTF8 : function(raw){
				console.log("encode", raw)
				return unescape(encodeURIComponent(raw));
			},
			decodeUTF8 : function(utf8){
				console.log("decode", utf8);
				return decodeURIComponent(escape(utf8));
			}
		}
	}
)