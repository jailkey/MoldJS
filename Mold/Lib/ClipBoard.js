/**
 * @module Mold.Lib.ClipBoard
 * @description provides methods to add text to the clipboard
 * @param  {Object} cookieString a cookie string
 */
Seed({
		name : "Mold.Lib.ClipBoard",
		dna : "static",
		platform : 'browser',
		include : [
			{ Element : "Mold.Lib.Element" }
		]
	},
	function(){



		var _addToClipBoard = function(text){
			var textArea = new Element("textarea");
			console.log("text", text)
			textArea.val(text);
			textArea.css({
				position : "fixed",
				top : 0,
				left : 0,
				width : '1em',
				height: '1em',
				color : 'transparent',
				background : 'transparent',
				border : 'none'
			});
			
			document.body.appendChild(textArea);
			textArea.select();
			var result = document.execCommand('copy');
			textArea.remove();

			return result;
		}
	
		return {
			copy : function(text){
				return _addToClipBoard(text);
			}
		}
	}
)