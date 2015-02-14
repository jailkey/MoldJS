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
			"request" : ">=2.5.0",
		}

	},
	function(){

		var request = require('request'),
			fileSystem = require('fs'),
			_that = this,
			repoHandler = new Mold.Tools.RepoHandler();

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
								onerror.call(null, "HTTP Error: " + response.statusCode + " - on: " + path);
							}
						}
					});
				}
			});
		}

		var _addToCollection = function(value, collection){
			
			if(Mold.isArray(value)){
				Mold.each(value, function(element){
					collection = _addToCollection(element, collection);
				})
				return collection;
			}

			var test = Mold.find(collection, function(check){
				if(check.name === value.name){
					return true;
				}
			});

			if(!test){
				collection.push(value)
			}

			return collection;
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
										if(rule.isVendor){

										}
									}else{
									
										var newPath = ((rule.isExternal) ? Mold.EXTERNAL_REPOSITORY : path);
										var loader = _loadSeeds(newPath, rule.file, collection);
										includedSeeds.push(loader);
										loader.then(function(data){
											_addToCollection(data, collection)
										})
									}
								
								});
								if(includes.length){
									new Promise().all(includedSeeds).then(function(){
										collection = _addToCollection({
											name : infos.name,
											header : infos.header,
											file : file,
											exists : fileSystem.existsSync(file),
											code : code
										}, collection)
										onsuccess(collection)
									}).fail(function(err){
										onloaderror(err)
									})
								}else{
									collection = _addToCollection({
										name : infos.name,
										header : infos.header,
										file : path + file,
										exists : fileSystem.existsSync(file),
										code : code
									}, collection)
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

		/**
		 * @method  info
		 * @description  returns infos about the given seed
		 * @param  {string} path     path to the seed / seed code
		 * @param  {boolean} fromCode if true, path will parsed as code string
		 * @return {promise} returns a promise
		 */
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
		/**
		 * @method infos
		 * @description returns infos about a seed and it dependencies
		 * @param  {string} path the path to the seed.
		 * @param  {string} seed name of the seed
		 * @return {promise} returns a promise
		 */
			infos : function(path, seed){
				seed = Mold.getSeedPath(seed);
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