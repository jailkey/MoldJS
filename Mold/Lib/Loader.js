Seed({
		name : "Mold.Lib.Loader",
		dna : "class",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Promise"
		]
	},
	function(){

		var _files = [],
			_fileLen = 0,
			_isLoading = false,
			_isLoadingError = false;

		Mold.mixin(this, new Mold.Lib.Event(this));

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

		var _checkLoaded = function(async){
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
			
			_isLoading = true;

			var promise = new Mold.Lib.Promise(function(resolve, reject){

				if(selectedFile.type === "script"){

					Mold.loadScript(selectedFile.name, function(){
						that.trigger("process", { len : _fileLen, _loaded : (_fileLen -_files.length), filename : selectedFile.name});
						resolve();
					})

				}else if(selectedFile.type === "image"){

					var img = new Image(),
						imageEvents = new Mold.Lib.Event(img);

					imageEvents.on("load", function(e){
						that.trigger("process", { len : _fileLen, _loaded : (_fileLen -_files.length), filename : selectedFile.name});
						resolve();
					});

					imageEvents.on("error", function(e){
						that.trigger("error", e);
						_isLoadingError = true;
						reject(e);
					});
					
					img.src = selectedFile.name;


				}else if(selectedFile.type === "style"){

					var styleSheet = document.createElement("link"),
						styleEvent = new Mold.Lib.Event(styleSheet);

					styleEvent.on("load", function(){
						that.trigger("process", { len : _fileLen, _loaded : (_fileLen -_files.length), filename : selectedFile.name});
						resolve();
					});

					styleEvent.on("error", function(e){
						that.trigger("error", e);
						reject(e);
						_isLoadingError = true;
					});

					styleSheet.type = "text/css";
					styleSheet.rel = "stylesheet";
					styleSheet.href = selectedFile.name;
					document.getElementsByTagName("head")[0].appendChild(styleSheet);

				}
			});

			
			return promise;
			
		}


		var _loadAsync = function(){
			var loadPromises = [];
			for(var i = 0; i < _fileLen; i++){
				loadPromises.push(_loadNextFile());
			}
			var promise = new Mold.Lib.Promise().all(loadPromises);
			
			promise.then(function(){
				that.trigger("ready");
			});
			
			promise.fail(function(e){
				that.trigger("error", e);
			});
			
			return promise;
		}

		
		var _check = function(success, fail){
			var filePromise = _loadNextFile();

			filePromise.then(function(){
				if(_files.length === 0){
					if(!_isLoadingError){
						that.trigger("ready");
						success();
					}
					_isLoading = false;
				}else{
					_check(success, fail);
				}
			});

			filePromise.fail(function(e){
				that.trigger("error", e);
				fail();
			});
		}

		var _loadSync = function(){
			var promise = new Mold.Lib.Promise(_check);
			return promise;
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
				if(async){
					return _loadAsync();
				}
				return _loadSync();
			
			}

		}
	}
)