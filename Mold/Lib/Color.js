;Seed({
		name : "Mold.Lib.Color",
		dna : "static",
		version : "0.0.1"
	},
	function(){

		var _getHex = function(num){
			 num = parseInt(num,10);
			 if (isNaN(num)) {
			 	return "00";
			 }
			 num = Math.max(0,Math.min(num,255));
			 return "0123456789abcdef".charAt((num-num%16)/16) + "0123456789abcdef".charAt(num%16);
		}

		return {
			isHexColor : function(color){
				color = color.replace("#", "");
				return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
			},
			isRGBAColor : function(color){

			},
			isRGBColor : function(color){
				if(Mold.startsWith(Mold.trim(color), "rgb") || color.split(",").length === 3){
					return true;
				}
				return false;
			},
			rgbToHex : function(color, withoutPrefix){
				if(this.isHexColor(color)){
					return color;
				}
				if(this.isRGBColor(color)){

					var colors = color.replace(/rgb/g, "").replace(/\(/g, "").replace(/\)/g, "").split(",");
					var hex = _getHex(colors[0]) + _getHex(colors[1]) + _getHex(colors[1]);

					return (withoutPrefix) ? hex : "#" + hex;
				}
				throw new Error("can not convert to hex, color '" + color + "' is not avalid rgb color!");
			},
			randomColor : function(){
				return '#'+Math.floor(Math.random()*16777215).toString(16);
			}
		}
	}
);