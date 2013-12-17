Seed({
		name : "Mold.DNA.Controller",
		dna : "dna",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.GlobalEvents",
			"Mold.Lib.Parents"
		]
	},
	{
		name :  "controller",
		dnaInit : function(){
			Mold.addLoadingProperty("extend");
		},
		createBy : "new",
		create : function(seed) {			
				var target = Mold.createChain(Mold.getSeedChainName(seed));
				//var events = false;
				var controllerMainFunctions= function(){
					this.ident = Mold.getId();
					Mold.mixing(this, new Mold.Lib.Event(this));
					Mold.mixing(this, new Mold.Lib.Parents());
					this.registerd = [];
					this.registerdParents = [];
					var that = this;

				
					this.instanceOf = seed.name;

					this.register = function(instance){
						this.registerd.push(instance);
						instance.on("all", function(e){
							that.trigger(e.event, e, { exclude : ["data", "destroy"] });
						});
						if(instance.addParent){
							instance.addParent(that);
						}
						return instance;
					}
					
					this.destroy = function(){
						that.off();
						that.trigger("destroy");
						for(var i = 0; i < this.registerd.length; i++){
							if(this.registerd[i].destroy){
								this.registerd[i].destroy();
							}
						}
						delete that;
					}
					
					
					return this;
				}
				
				seed.func =	Mold.extend(controllerMainFunctions, seed.func,	{
					superClassName : "rootclass",
					sourceURL : seed.name
				});
		
				target[Mold.getTargetName(seed)] = function(){
					

					var wrapper = Mold.wrap(seed.func, function(that){
						if(that.publics){
							for(var property in that.publics){
								that[property] = that.publics[property];
							}
						}
						delete that.publics;
						return constructor;
					})

					var controller = new wrapper(arguments);
				
					for(action in controller.actions){
						controller.on(action.replace("@", ""), controller.actions[action]);
					}
					
					if(arguments[0] && arguments[0].eventHandler){
						arguments[0].eventHandler.at("all", function(e){
								controller.trigger(e.event, e.data );
							},
							{
								triggerElement : controller
							}
						);
					}else{
						Mold.Lib.GlobalEvents.at("all", function(e){
								controller.trigger(e.event, e.data );
							},
							{
								triggerElement : controller
							}
						);
					}
					
					return controller;
				}
				
				return target[Mold.getTargetName(seed)];
				
		}
	}
);