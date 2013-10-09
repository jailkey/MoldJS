Seed({
		name : "Mold.Lib.Header",
		dna : "class"
	},
	function(type){

		var _getFileHeader = function (type){

			type = type.toLowerCase();

			var head = { 'Content-Type':'text/html' }

			switch(type){
				case 'js':
					head={'Content-Type':'text/javascript'};
					break;
				case 'css':
					head = {'Content-Type':'text/css'};
					break;
				case 'png':
					head = {'Content-Type':'image/png'};
					break;
				case 'gif':
					head = {'Content-Type':'image/gif'};
					break;
				case 'jpg':
					head = {'Content-Type':'image/jpeg'};
					break;
				case 'ico':
					head = {'Content-Type':'image/x-icon'};
					break;
				case 'ogg':
					head = {'Content-Type':'audio/ogg'};
					break;
				case 'ebm':
					head = {'Content-Type':'video/webm'};
				break;
			}

			return head;

		}

		var header = _getFileHeader(type);

		return header;
	}
);