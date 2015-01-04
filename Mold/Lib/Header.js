Seed({
		name : "Mold.Lib.Header",
		dna : "class"
	},
	function(input){

		var _header  = {
			'content-type' : false,
			'mime-type' : false,
			'encoding' : false,
		}

		var _mimeTypes = [
			{ 'html' : 'text/html' },
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



		var _getMimeType = function (type){

			return Mold.find(_mimeTypes, function(mimeType, selectedType){
				if(selectedType === type){
					return mimeType;
				}
			});

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

		var _parseHeader = function(header){
			var lines = header.split(/(\r\n|\n)/);
			
			Mold.each(lines, function(line){
				line = line.replace(/(\r\n|\n)/, '');
				if(line != ""){
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
			});
		}

		if(input){
			_parseHeader(input);
		}

		this.publics = {
			getMimeType : _getMimeType,
			getType :  _getType,
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