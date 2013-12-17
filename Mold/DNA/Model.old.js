Seed({
		name : "Mold.DNA.Model",
		dna : "dna",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.ModelItem"
		]
	},
	{
		name :  "model",
		dnaInit : function(){
			Mold.addLoadingProperty("adapter");
		},
		createBy : "new",
		create : function(seed) {
			var target = Mold.createChain(Mold.getSeedChainName(seed));
		
			var modelMainFunctions = function(translation){
				var thisModel = this;
				var _adapterSeed = Mold.getSeed(seed.adapter);
				
				var _modelItem = new Mold.Lib.ModelItem();
				var that = this;
				

				this.isDataSaved = true;
 				this.value = false;
				this.id = Mold.getId();

				Mold.mixing(thisModel, new Mold.Lib.Event(this));
				Mold.mixing(this, new Mold.Lib.Parents());

				this.type = seed.type;				

				this.adapter = new _adapterSeed(seed.path);

				this.hasData = false;

				thisModel.adapter.on("loaded", function(e){
					_modelItem.clearCache();
					var data = e.data.json;
					//thisModel.validate(data);
					that.value = data;

					thisModel.hasData = true;
					thisModel.trigger("data", data);

				});

				thisModel.adapter.on("saved", function(e){
					thisModel.trigger("model.saved", e.data);
					that.isDataSaved = true;
				});

				this.on("change", function(){
					that.isDataSaved = false;
				});
				
				
			
				var _checkType = function(value, type){
					if(type === "string"){
						if(typeof value === "string"){
							console.log("string gefunden", value);
						}else{
							console.log(value, "ist kein String");
						}
					}else if(type.substring(0,"relation".length) === "relation"){
						console.log("relation found", type);
						if(type.indexOf("->*") > -1){
							console.log("1 zu n gefunden");
							var relation = type.split("->*")[1];
							var newModel = new Mold.getSeed(relation)();
							newModel.validate(value);
						}else if(type.indexOf("->") > -1){
							console.log("1 zu 1 gefunden");
						}
					}else{
					
					}
				}
				
				
				var _getRelationModel = function(relation){
					if(relation.indexOf("->*") > -1){
						return  relation.split("->*")[1];
					}
					return false;
				}
				
				var _checkData = function(data, model){
					for(property in data){
						if(model.properties[property]){
							if(typeof model.properties[property] === "object"){
								var subModel = {
									properties : model.properties[property]
								}
								_checkData(data[property], subModel);
							}else{
								_checkType(data[property], model.properties[property]);
							}
						}else{
							console.log("FEHLER die Property existiert nicht", property, model);
							return false;
						}
					}
					return true;
				}
				
				var _checkList = function(data, model){
					for(var i = 0; i < data.length; i++){
						if(!_checkData(data[i], model)){
							return false;
						}
					}
					return true;
				};

				this.order = false;

				
				
				this.destroy = function(){
					thisModel.off();
					thisModel.trigger("destroy");
					delete thisModel;
				}


				
				this.validate = function(data){
					console.log("validate");
					if(data instanceof Array){
						_checkList(data, thisModel);
					}else{
						return _checkData(data, thisModel);
					}
				
				}

				this.getRawData = function(){
					return this.value;
				}
				
				this.create = function(data){
					_modelItem.clearCache();
					//thisModel.validate(data);
					this.value = data;
					thisModel.hasData = true;
					thisModel.trigger("data", data);
				}
				

				this.load = function(parameter){
					thisModel.adapter.load(parameter);
				}
				
				
				this.registerd = [];
				this.register = function(instance){
					thisModel.registerd.push(instance);
					instance.on("all", function(e){
						thisModel.trigger(e.event, e, { exclude : ["data", "destroy"] });
					});
					return instance;
				}
				
				this.save = function(){
					/*
						that.each(function(item){
							console.log("each", item.value);
						});
						
					*/					
					if(!that.isDataSaved){
	
						thisModel.adapter.create(this.value);
					}

					
				}
				
				this.set = function(property, value){
					var item = _modelItem.create(property, value, thisModel);
					item.set(value);
					if(!this.value){
						if(this.type === "object"){
							this.value = {};
						}else if(this.type === "collection"){
							this.value = [];
						}
					}
					this.value[property] = value;
					thisModel.hasData = true;
					thisModel.isDataSaved = false;
					return item;
				}

				
				this.get = function(property){
					if(typeof property === "undefined"){
						var value = this.value;
						var type = thisModel.type;
						return _modelItem.create("", value, thisModel);
					}else{
						var value = this.value[property];
						//console.log(property, value);
						return _modelItem.create(property, value, thisModel);
					}
				}
				
				this.each = function(id, callback) {
					//console.log("each", this.value);
					this.get().each(id, callback);
				}
			
				
				this.getById = function(id){
					id = (id.substring(id.length-1, id.length) === "/") ? id.substring(0, id.length-1) : id;
					var pathItems = id.split("/");
					var element = thisModel.get(pathItems[0]);

					for(var i = 1; i < pathItems.length; i++){
						if(element.get){
							
							element = element.get(pathItems[i]);
						}else{
							return false;
						}
					}
					return element;
				}
				
				return this;
			}
			
			seed.func =	Mold.extend(modelMainFunctions, seed.func,	{ 
					superClassName : "rootclass",
					sourceURL : seed.name
			});
			
			target[Mold.getTargetName(seed)] = function(){
				var model = new seed.func();
				
								
				return model;
			}
			
			return target[Mold.getTargetName(seed)];
		}
	}
);