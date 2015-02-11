Seed({
		name  : "Mold.Tools.SeedHandler",
		dna : "class",
		platform : "node",
		include : [
			"Mold.Tools.SeedParser",
			{ Promise : "Mold.Lib.Promise"},
			"Mold.Lib.Event",
			"Mold.Tools.RepoHandler"
		],
		npm : {
			"request" : ">=2.50.0"
		}

	},
	function(){

		var request = require('request');
		var fileSystem = require('fs');
		var _that = this;
		var repoHandler = new Mold.Tools.RepoHandler();

		Mold.mixin(this, new Mold.Lib.Event(this));


		var _isLocalPath = function(path){
			if(Mold.startsWith(path, "http:") || Mold.startsWith(path, "https:")){
				return false;
			}
			return true
		}
		//Load Seed
		var _loadSeed = function(path){
		
			return new Mold.Lib.Promise(function(onsuccess, onerror){
				if(_isLocalPath(path)){
					if(!fileSystem.existsSync(path)){
						onerror("File " + path + " does not exist!");
						return;
					}
					fileSystem.readFile(path, function (err, data) {
						
						if(!data){
							onerror("The File: " + path + " is Empty!")
						}else {
							var buf = new Buffer(data);
							if(err){
								onerror(err);
								return;
							}else{
								onsuccess.call(null,  buf.toString());
							}
						}
					});
				}else{

					request.get(path , function (error, response, body) {
						if(response.statusCode == 404){
							onerror.call(null, "File not found: " + path + "!" );
							return;
						}
						if (!error && response.statusCode == 200) {
							onsuccess.call(null, body);
							
						}else{
							if(onerror){
								console.log("on error")
								onerror.call(null, response.statusCode)
							}
						}
					});
				}
			});
		}

		var _loadSeeds = function(path, file, collection){

			if(!collection){
				collection = [];
			}

			return new Promise(function(onsuccess, onloaderror){

				_that.load(path + file)
					.success(function(code){

						_that.info(code, true).then(function(infos){
							
							if(infos.header){
								var includes = Mold.getDependencies(infos.header);
								var includedSeeds = [];
								Mold.each(includes, function(value){
									var rule =  Mold.getLoadingRule({ name : value});
									if(rule.isScript){
										//handle external scripts here
									}else{
									
										var newPath = ((rule.isExternal) ? Mold.EXTERNAL_REPOSITORY : path);
										var loader = _loadSeeds(newPath, rule.file, collection);
										includedSeeds.push(loader);
										loader.then(function(data){
											collection = collection.concat(data)
										})
									}
								
								});
								if(includes.length){
									
									new Promise().all(includedSeeds).then(function(){
										collection.push({
											name : infos.name,
											file : file,
											exists : fileSystem.existsSync(file),
											code : code
										})
										onsuccess(collection)
									}).fail(function(err){
										onloaderror(err)
									})
								}else{

									collection.push({
										name : infos.name,
										file : path + file,
										exists : fileSystem.existsSync(path + file),
										code : code
									})
									onsuccess(collection)
								}
							}else{
								onloaderror("Seed header not found! " + file)
							}
							
						})
					})
					.fail(function(err){
						onloaderror(err);
					});
			});
		}

		this.publics = {
			load : _loadSeed,
			info : function(path, fromCode){
				return new Mold.Lib.Promise(function(success, error){
					if(fromCode){
						success.call(null, new Mold.Tools.SeedParser(path))
					}else{
						_loadSeed(path).then(function(data){
							success.call(null,  new Mold.Tools.SeedParser(data))
						})
					}
				});
			},
			copyInfo : function(path, seed){
				seed = seed.replace(".", "/") + ".js";
				return _loadSeeds(path, seed);
			},
			copy : function(path, seed, to, options){
				options = options || {};
				var withoutDependencies = options.withoutDependencies;
				

				//var infos = this.info(from)

			}
		}
	}
)