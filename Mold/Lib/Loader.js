Seed({
		name : "Mold.Lib.Loader",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(){

		var _files = [],
			_fileLen = 0,
			_isLoading = false,
			_isLoadingError = false;

		Mold.mixing(this, new Mold.Lib.Event(this));

		var _getFileTyp = function(file){
			var typs = {
				image : [ "png", "jpg", "gif", "bmp", "svg" ],
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
				type : _getFileTyp(file)
			};
			
		}

		var _checkLoaded = function(){
			if(_files.length === 0){
				if(!_isLoadingError){
					that.trigger("ready");
				}
				_isLoading = false;
			}else{
				_loadNextFile();
			}
		}

		var _loadNextFile = function(async){
			
			var selectedFile = _files.shift();
			that.trigger("process", { len : _fileLen, _loaded : (_fileLen -_files.length), filename : selectedFile.name});
			_isLoading = true;

			if(selectedFile.type === "script"){

				Mold.loadScript(selectedFile.name, function(){
					_checkLoaded(async);
				})

			}else if(selectedFile.type === "image"){

				var img = new Image(),
					imageEvents = new Mold.Lib.Event(img);

				imageEvents.on("load", function(e){
					console.log("successfully loaded", img);
					_checkLoaded();
				});

				imageEvents.on("error", function(e){
					that.trigger("error", e);
					console.log("Error", e, img)
					_isLoadingError = true;
					_checkLoaded(async);
				});
				
				img.src = selectedFile.name;
			//	console.log("add source", selectedFile.name, img);

			}else if(selectedFile.type === "style"){

				var styleSheet = document.createElement("link"),
					styleEvent = new Mold.Lib.Event(styleSheet);

				styleEvent.on("load", function(){
					_checkLoaded(async);
				});

				styleEvent.on("error", function(e){
					that.trigger("error", e);
					_isLoadingError = true;
					_checkLoaded(async);
				});

				styleSheet.type = "text/css";
				styleSheet.rel = "stylesheet";
				styleSheet.href = selectedFile.name;
				document.getElementsByTagName("head")[0].appendChild(styleSheet);

			}

			if(async){
				//_checkLoaded(async);
			}
			
		}

		

		this.publics = {
			isLoading : function(){
				return _isLoading;
			},
			append : function(file){
				if(Mold.isArray(file)){
					Mold.each(file, function(selected){
						_files.push(_getFileObject(selected));
					});
				}else{
					_files.push(_getFileObject(file));
				}
				return this;
			},
			load : function(async){
				_fileLen = _files.length;
				_loadNextFile(async);
				return this;
			}

		}
	}
)