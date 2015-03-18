Seed({
		name : "Mold.Server.Response",
		dna : "class",
		platform : "node",
		include : [
			"Mold.Lib.Header"
		],
		npm : {
			"mime" : ">=1.3.4"
		}
	},
	function(result){

		//required the standard node result;

		var _status = 200,
			_result = result,
			_header = new Mold.Lib.Header(),
			_hasContent = false,
			_isRedirect = false,
			_mimeType = false,
			_headerParameter = {},
			_mime = require("mime"),
			_fs = require("fs"),
			_data = false;

		var _setStatus = function(name){
			if(Mold.isNumber(name)){
				_status = name;
			}else{
				_status = _header.getStatusCode(name);
			}
		}

		var _setData = function(data, mimeType){
			_data = data;
			_mimeType = mimeType;
			_hasContent = true;
		}

		var _addHeader = function(property, value){
			_headerParameter[property] = value;
		}

		this.publics = {
			setStatus : function(name){
				_setStatus(name);
			},
			fileNotFound : function(){
				_status = 404;
			},
			redirect : function(type, url){
				_isRedirect = url;
				_addHeader('Location', url);
				if(typeof +type !== "number"){
					_header.getStatusCode(type);
				}else{
					_status = type;
				}
				
			},
			addData : function(data, type){
				console.log("add data", data, type)
				if(!type && Mold.isObject(data)){
					data = JSON.stringify(data);
					_mimeType = _header.getMimeType("json");
					console.log("GET MIME", _mimeType)
				}else{
					_mimeType = _header.getMimeType(type);
				}
				_setData(data, _mimeType);
			},
			addFile : function(filepath){
				if(_fs.existsSync(filepath)){
					console.log("add file", filepath)
					_setData(_fs.readFileSync(filepath), _mime.lookup(filepath));
				}else{
					_status =  404;
				}
			},
			create  : function(){


				if(!_hasContent){
					_result.writeHead(_status);
				}else{
					if(_mimeType){
						_status = _header.getStatusCode("ok");
						_result.writeHead(_status, _mimeType);
						if(_data){
							_result.write(_data);
						}
					}else{
						_result.writeHead(_header.getStatusCode("unsupported-media-type"));
					}
				}
				console.log("CREATE", _status);
				_result.end();
			}
		}
	}
)