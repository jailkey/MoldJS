/**
 * @module Mold.Lib.Color
 * @description static object, provides methods for creating / converting colors
 */
Seed({
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

			/**
			 * @method isHexColor
			 * @description check if a string is a hex color
			 * @param  {string} color a string to check
			 * @return {boolean} returns true if it is a  hex color else false
			 */
			isHexColor : function(color){
				color = color.replace("#", "");
				return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
			},

			/**
			 * @method isRGBAColor
			 * @description checks if a string is a rgba color
			 * @param  {string} color the string to check
			 * @return {boolean} returns true if the string is a rgba color else false
			 */
			isRGBAColor : function(color){
				//TODO
				throw new Error("NOT IMPLEMENTED");
			},

			/**
			 * @method isRGBColor 
			 * @description checks if a string is a rgb color
			 * @param  {string}  color the string to check
			 * @return {boolean} returns true if the string is a rgb color else it returns false
			 */
			isRGBColor : function(color){
				if(Mold.startsWith(Mold.trim(color), "rgb") || color.split(",").length === 3){
					return true;
				}
				return false;
			},

			/**
			 * @rgbToHex 
			 * @description converts a rgb to hex color
			 * @param  {string} color the rgb color
			 * @param  {boolean} withoutPrefix returns the hex string with out leading #
			 * @return {string} returns a hex string
			 */
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

			/**
			 * @method hexToRGB 
			 * @description converts a hex string into a rgb object
			 * @param  {string} hex a string with the hex color
			 * @return {object} returns an object with th rgb color
			 */
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

			/**
			 * @method randomColor
			 * @description generates a random color
			 * @return {string} returns a random color hex string
			 */
			randomColor : function(){
				return '#'+Math.floor(Math.random()*16777215).toString(16);
			}
		}
	}
);