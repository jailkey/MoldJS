Seed ({ 
		name : "Mold.DNA.AMD",
		dna : "dna",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	{
		name : "amd",
		create : function(seed) {
			console.log("seed");

			Mold.DNA.AMD.attachList[seed.amdID] = seed.name;

			if(seed.config){
				Mold.DNA.AMD.addConfig(seed.config);
			}

			Mold.loadScript(seed.path, function(){	Mold.DNA.AMD.loadedModules[seed.path] = { amdID : seed.amdID }	});

			var target = Mold.createChain(Mold.getSeedChainName(seed));
		},
		init : function(){
			Mold.GLOBAL.define = function(id, dependencies, factory){
				if(typeof id === "string"){
					console.log("module with id");
				}else if(typeof id === "object"){
					console.log("anonymous modul width dependencies");
					Mold.DNA.AMD.loadDependecies(id, function(){

					});
				}else if(typeof id === "function"){
					console.log("anonymous modul");
				}

				if(typeof id === "object" && typeof dependencies === "function"){			
					var moldName = Mold.DNA.AMD.attachList[id[0]];
					//var target = Mold.createChain(Mold.getSeedChainName({ name : moldName}));
					//target = dependencies(id[0]);
				}
				console.log(id, dependencies, factory);
			},
			Mold.GLOBAL.define.amd = {};
			console.log("inti");
		},
		methodes : function(){
			return {
				config : {
					pathes : {}
				},
				attachList : {},
				loadedModules : {},
				addConfig : function(config){
					for(var prop in config){
						if(typeof config[prop] === "object"){
							for(var entry in config[prop]){
								Mold.DNA.AMD.config[prop][entry] = config[prop][entry];
							}
						}else{
							Mold.DNA.AMD.config[prop] = config[prop];
						}
					}
				},
				isModuleLoaded : function(path){
					if(loadedModules[path]){
						return true;
					}
					return false;
				},
				loadDependecies : function(dependencies, success){
					for(var dependency in dependencies){
						if(dependencies[dependency].indexOf("/") > -1){
							
						}else{
							
						}
					}
				}
			}
		}
	}
);