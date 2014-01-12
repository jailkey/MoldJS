"use strict;"
Seed({
		name : "Mold.Lib.Controller",
		dna : "class",
		include :[
			"Mold.Lib.Event",
			"Mold.Lib.GlobalEvents",
			"Mold.Lib.Parents"
		]
	},
	function(controller, name){

		var controllerPrototype = function(){

			var that = this;
			this.ident = Mold.getId();
			Mold.mixing(this, new Mold.Lib.Event(this));
			Mold.mixing(this, new Mold.Lib.Parents());
			this.registerd = [];
			this.registerdParents = [];

			this.instanceOf = name;

			this.scope = false;

			this.registerScope = function(scope){
				if(!this.scope){
					this.scope = document.createDocumentFragment();
				}
				this.scope.appendChild(scope);
			}

			this.register = function(instance){
				this.registerd.push(instance);
				if(instance.scope){
					this.registerScope(instance.scope);
				}
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
				
		controller = Mold.extend(controllerPrototype, controller,{
			superClassName : "rootclass",
			sourceURL : name
		});
		
		return function(){
			var wrapper = Mold.wrap(controller, function(that){
				if(that.publics){
					for(var property in that.publics){
						that[property] = that.publics[property];
					}
				}
				delete that.publics;
				return constructor;
			})

			if(arguments){
				var a = arguments;
				var controllerWrapped = new wrapper(a[0], a[1], a[2], a[3], a[4], a[5]);
			}else{
				var controllerWrapped = new wrapper();
			}		
			for(action in controllerWrapped.actions){
				controllerWrapped.on(action.replace("@", ""), controllerWrapped.actions[action]);
			}
			
			if(arguments[0] && arguments[0].eventHandler){
				arguments[0].eventHandler.at("all", function(e){
						controllerWrapped.trigger(e.event, e.data);
					},
					{
						triggerElement : controllerWrapped
					}
				);
			}else{
				Mold.Lib.GlobalEvents.at("all", function(e){
						controllerWrapped.trigger(e.event, e.data );
					},
					{
						triggerElement : controllerWrapped
					}
				);
			}
			
			return controllerWrapped;
		}
	}
)