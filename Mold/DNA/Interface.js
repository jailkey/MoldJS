Seed (
	{ 
		name : "Mold.DNA.Interface",
		dna : "dna",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	{
		name : "interface",
		init : function(seed){
			// Bei der Initialiserung der Interface DNA, wird das class DNA um das Gen implements erweitert
			var classDNA = Mold.getDNA("class");
			
			var oldCreate = classDNA.create;
			classDNA.create = function(seed){
				var createValue = oldCreate(seed);
				var wrapperClass = Mold.wrap(createValue, function(instance){
					if(seed.implements){
						var classInterface = Mold.getSeed(seed.implements);
						Mold.DNA.Interface.insureImplements(instance, classInterface)
					}
				});
				
				var target = Mold.createChain(Mold.getSeedChainName(seed));
				target[Mold.getTargetName(seed)] = wrapperClass;
				return target[Mold.getTargetName(seed)];
			}
			//Class DNA überschreiben
			Mold.addDNA(classDNA);
		},
		create : function(seed){
			var target = Mold.createChain(Mold.getSeedChainName(seed));
			target[Mold.getTargetName(seed)] = seed.func;
			return seed.func;
		},
		methodes : function(){
			var _interfaces = {};
			var _getInterfaceInfos = function(classInterface){
				if(!_interfaces[classInterface]){
					_interfaces[classInterface] = { info : {} };
					for(property in classInterface){
						var reg = new RegExp("function\\s*\(([\\s\\S]*?)\)\\s*\{", "g");
						if(reg.test(classInterface[property])){
							var params = RegExp.$1;
							if(params){
								_interfaces[classInterface].info[property] = { 
									parameter : params.split("(")[1].split(")")[0].replace(" ","").split(",")
								}
							}
						}
					}
				}
				return _interfaces[classInterface].info;
			};
			
			var _checkArguments = function(interfaceInfo, methode, instance, arguments){
					if(interfaceInfo[methode]){
						if(arguments.length < interfaceInfo[methode].parameter.length){
							Mold.log("Error", "Interface Fehler: Die Methode " +methode + " der Klasse " + instance.instanceof + " erwartet mindestens " + interfaceInfo[methode].parameter.length + " Argumente");
						}
					}
			};
			
			var _checkReturnValue = function(interfaceValue, returnValue, instance, property){

				var error = false;
				var valueTypes = {
					"string" : { type : String },
					"number" : { type : Number},
					"function" : { type : Function}
				}
				
				switch (typeof interfaceValue){
					case "object":
						for(var valueType in valueTypes){
							if(interfaceValue instanceof valueTypes[valueType].type){
								if(typeof returnValue !== valueType){
									error = (returnValue instanceof valueTypes[valueType].type) ? false : valueType;
								}
							}
						}
						if(interfaceValue.instanceof){
							error = (returnValue.instanceof && returnValue.instanceof === interfaceValue.instanceof) ? false : interfaceValue.instanceof;
						}
						break;
					default:
						break;
				}

				if(error && error !== "undefined"){
					Mold.log("Error", { code : 7, property : property, instance : instance, valuetype : error});
				}
			};

			return {
				insureImplements : function(instance, classInterface){
					var interfaceInfo = _getInterfaceInfos(classInterface);
					for(var property in classInterface){
						
						if(instance[property]){
							if(typeof classInterface[property] !== typeof instance[property]){
								Mold.log("Error", { code : 5, property : propery, instance : instance, interface : classInterface});
							}else{
								
								if(typeof classInterface[property] === "function"){ 
									
									
									//Clousour um property zu kopieren
									(function(){
										var  localProperty = property;
										var oldMethode = instance[property] ;
										instance[localProperty] = function(){ 				
											//Argumente uebrpruefen
											_checkArguments(interfaceInfo, localProperty, instance, arguments);
											//Funktion ausfuehren
											var output = oldMethode.apply(instance, arguments)
											_checkReturnValue(classInterface[localProperty](), output, instance, localProperty);
											return output;
										}
									})()
								
								}
							}
						}else{
							Mold.log("Error", { code : 6, property : property, instance : instance, interface : classInterface});
						}
					}
				}
			}
		}
	}
);