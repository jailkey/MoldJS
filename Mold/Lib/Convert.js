Seed({
		name : "Mold.Lib.Convert",
		dna : "static"
	},
	function(){


		return {

			Color : {
				hexToRGB : function(hex){
					var regExp = new RegExp('^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$', 'i');

					if(regExp.test(hex)){
						var result = regExp.exec(hex);
						return {
				        	r : parseInt(result[1], 16),
				        	g : parseInt(result[2], 16),
				        	b : parseInt(result[3], 16)
				    	}
					}else{
						throw new Error(hex +  " is not a valid hexvalue");
					}
				   
				},
				rgbToHex : function(r, g, b) {
					if(Mold.isObject(r)){
						return "#" + ((1 << 24) + (r.r << 16) + (r.g << 8) + r.b).toString(16).slice(1);
					}else{
						return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
					}
				}
			}
		}
	}
)