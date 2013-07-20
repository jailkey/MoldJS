Seed({
		name : "Mold.Lib.Encode",
		dna : "static"
	},
	function(){
		
		
		return {
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
		}
	}
);