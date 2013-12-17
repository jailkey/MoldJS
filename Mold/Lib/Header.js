Seed({
		name : "Mold.Lib.Header",
		dna : "class"
	},
	function(type, len){

		var _getMimeType = function (type){

			type = type.toLowerCase();
			var head = false;

			switch(type){
				case 'html':
					head = 'text/html';
				case 'js':
					head= 'text/javascript';
					break;
				case 'css':
					head = 'text/css';
					break;
				case 'png':
					head = 'image/png';
					break;
				case 'gif':
					head = 'image/gif';
					break;
				case 'jpg':
					head = 'image/jpeg';
					break;
				case 'ico':
					head = 'image/x-icon';
					break;
				case 'ogg':
					head = 'audio/ogg';
					break;
				case 'ebm':
					head = 'video/webm';
				break;
			}

			return head;

		}

		var header = _getMimeType(type);

		return header;
	}
);