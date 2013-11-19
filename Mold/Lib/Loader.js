Seed({
		name : "Mold.Lib.Loader",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(){

		var _files = [],
			_fileLen = 0;

		Mold.mixing(this, new Mold.Lib.Event(this));

		var _getFileTyp = function(file){
			var typs = {
				image : [ "png", "jpg", "gif" ],
				script : [ "js" ],
				style : [ "css", "scss" ]
			}
			for(var typ in typs){
				for(var i =0; i < typs[typ].length; i++){
					var reg = new RegExp("\."+typs[typ][i]+"$");
					if(reg.test(file)){
						return typ;
					}
				}
			}
			return false;
		}

		var that = this;

		var _getFileObject = function(file){
			return {
				name : file,
				typ : _getFileTyp(file)
			};
			
		}

		var _checkLoaded = function(){
			if(_files.length === 0){
				that.trigger("ready");
			}else{
				_loadNextFile();
			}
		}

		var _loadNextFile = function(){
			var selectedFile = _files.shift();
			console.log("load Next File", selectedFile);
			that.trigger("process", { len : _fileLen, _loaded : (_fileLen -_files.length), filename : selectedFile.name})
			if(selectedFile.typ === "script"){
				Mold.loadScript(selectedFile.name, function(){
					_checkLoaded();
				})
			}else if(selectedFile.typ === "image"){
				console.log("LoadImage");
			}else if(selectedFile.typ === "css"){
				console.log("LoadStyle");
			}
			
		}

		

		this.publics = {
			append : function(file){
				console.log("file", file);
				if(typeof file === "object"){
					for(var entry in file){
						_files.push(_getFileObject(file[entry]));
					}
				}else{
					_files.push(_getFileObject(file));
				}
				return this;
			},
			load : function(){
				_fileLen = _files.length;
				_loadNextFile();
				return this;
			}

		}
	}
)