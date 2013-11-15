Seed({
		name : "Mold.DNA.View",
		dna : "dna",
		author : "Jan Kaufmann",
		version : "0.0.1",
		include : [
			"Mold.Lib.Event"
		]
	},
	{
		name :  "view",
		dnaInit : function(){
			Mold.addLoadingProperty("extend");
		},
		create : function(seed) {

			try {	
			
				var target = Mold.createChain(Mold.getSeedChainName(seed));
				var viewPrototype = function(){
					var that = this;
					Mold.mixing(this, new Mold.Lib.Event(that));
					Mold.mixing(this, new Mold.Lib.Parents());

					this.elements = [];
					this.filter = false;
					
					this.appendChild = function(element){
						this.trigger("append", { element : element });
						this.elements.push(element);
					}
					
					
					this.registerd = [];
					this.register = function(instance){
						that.registerd.push(instance);
						instance.on("all", function(e){
							that.trigger(e.event, e, { exclude : ["data", "destroy"] });
						});
						if(instance.addParent){
							instance.addParent(this);
						}
						return instance;
					}
					
					this.appendView = function(view, name){

						that.trigger("append.view."+name, { name : name, view : view});
					};
					
					this.appendModel = function(model, filter, translation){
						this.filter = filter;
						that.trigger("append.model", { model : model, translation : translation });
					}

					this.appendModelItem = function(model, item, filter, translation){
						this.filter = filter;
						that.trigger("append.model.item", { model : model, item : item, translation : translation });
					}

					this.removeModelItem = function(model, item, translation){
						that.trigger("remove.model.item", { model : model, item : item, translation : translation });
					}
					
					
					
					this.destroy = function(){
						that.off();
						that.trigger("destroy");
						if(that.element.parentNode){
							that.element.parentNode.removeChild(that.element);
						}else{
							console.log("ERROR View Element has no parentNode");
						}
						delete that;
					}
					//return this;
				}


				if(!seed.extend){

					seed.func =	Mold.extend( viewPrototype, seed.func, {
							superClassName : "rootclass",
							sourceURL : seed.name
					});
			
				}else{
					var superElement = Mold.getRawSeed(seed.extend);		
					seed.func = Mold.extend(superElement.func, seed.func, {
						sourceURL : seed.extend
					});
				}	
	
				
				target[Mold.getTargetName(seed)] = function(){
					var view = new seed.func();
					if(!view.element){
						Mold.log("Error", { code : 11, dnaname: "view", seed : seed});
					}
					
					var getEventFunction = function(callback){
							if(typeof callback=== "function"){
								return function(e){
									callback({ data : {
										elementEvent : e, element : this
									}});
								}
							}else{
								var eventName = callback.replace("@", "");
								return function(e){
									view.trigger(eventName, { elementEvent : e, element : this});
								}
							}

					}

					for(var selector in view.events){
						var selectedElements = view.element.querySelectorAll(selector);
						for(var i = 0; i < selectedElements.length; i++){
							for(selectedEvent in view.events[selector]){
								view.appendChild(selectedElements[i]);
								selectedElements[i].addEventListener(selectedEvent, function(){
									return getEventFunction(view.events[selector][selectedEvent]);
								}());
							}
						}
					}
					for(action in view.actions){
						view.on(action.replace("@", ""), view.actions[action]);
					}

					return view;
				}
				return target[Mold.getTargetName(seed)];
				
			}catch(e){
				Mold.log("Error", { code : 3, dnaname: "view", error : e, seed : seed});
			}
		}
	}
);