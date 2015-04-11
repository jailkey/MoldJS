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

		var _setStatus = function(name, conf){
			//console.log("isNumber")
			if(typeof +name === "number"){
				_status = name;
			}else{

				_status = _header.getStatusCode(name);
			}
		
			if(conf){
				if(Mold.startsWith(_status, "3")){
					_redirect(_status, conf);
				}
			}
		}

		var _redirect = function(type, url){
				console.log("redirect", url)
			_isRedirect = url;
			_addHeader('Location', url);
			_hasContent = false;
			if(typeof +type !== "number"){
				_status(_header.getStatusCode(type));
			}else{
				_status = type;
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
			serverError : function(error){
				console.log("Server Error", error);
				if(status){
					_status = error.status;
				}else{
					_status = 500;
				}
			},
			setStatus : function(name, conf){
				_setStatus(name, conf);
			},
			fileNotFound : function(){
				if(_status == 200){
					_status = 404;
				}
			},
			redirect : function(type, url){
				_redirect(type, url);
			},
			addHeader : function(property, value){
				 _addHeader(property, value)
			},
			addData : function(data, type){
				if(!type && Mold.isObject(data)){
					data = JSON.stringify(data);
					_mimeType = _header.getMimeType("json");
				}else{
					_mimeType = _header.getMimeType(type);
				}
				_setData(data, _mimeType);
			},
			addFile : function(filepath){
				if(_fs.existsSync(filepath)){
					_setData(_fs.readFileSync(filepath), _mime.lookup(filepath));
				}else{
					_status =  404;
				}
			},
			create  : function(){

				if(!_hasContent){
					_result.writeHead(_status, _headerParameter);
				}else{
					if(_mimeType){
						_status = _header.getStatusCode("ok");
						//_addHeader(_status, _mimeType);
						_result.writeHead(_status, _mimeType);
						if(_data){
							_result.write(_data);
						}
					}else{
						_result.writeHead(_header.getStatusCode("unsupported-media-type"));
					}
				}
				_result.end();
			}
		}
	}
)