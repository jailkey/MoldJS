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

				}else{

					request.get(path , function (error, response, body) {
						if(response.statusCode == 404){
							onerror.call(null, response.statusCode)
						}
						if (!error && response.statusCode == 200) {
							onsuccess.call(null, body);
							
						}else{
							if(onerror){
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

			return new Promise(function(onsuccess, onerror){
				_that.load(path + file)
					.success(function(code){

						_that.info(code, true).then(function(infos){
							
							if(infos.header){
								var includes = Mold.getDependencies(infos.header);
								var includedSeeds = []
								Mold.each(includes, function(value){
									var rule =  Mold.getLoadingRule({ name : value});
									if(rule.isScript){
										//handle external scripts here
									}else{
										path = ((rule.isExternal) ? Mold.EXTERNAL_REPOSITORY : path) + rule.file;
										//repoHandler.seedExist(rule.seedName)

										includedSeeds.push(_loadSeeds(path, collection));
									}
								
								});
								if(includes.length){
									console.log(includedSeeds)
									/*
									new Promise().all(includedSeeds).then(function(){
										console.log("Promis all")
									})*/
								}else{
									collection.push({
										name : infos.name,
										file : file,
										exists : fileSystem.existsSync(file),
										code : code
									})
									onsuccess(collection)
								}
							}else{
								onerror("Seed header not found! " + file)
							}
							
							console.log("Seed " + file + " loaded!");
							
						})
					})
					.fail(function(err){
						onerror(err);
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
			copy : function(path, seed, to, options){
				options = options || {};
				var withoutDependencies = options.withoutDependencies;
				seed = seed.replace(".", "/") + ".js";

				_loadSeeds(path, seed)
					.then(function(message){
						console.log("message", message)
					})
					.fail(function(){
						console.log("fail", fail)
					});
				
				return new Promise(function(onsuccess, onerror){
					
				});

				//var infos = this.info(from)

			}
		}
	}
)