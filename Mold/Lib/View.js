Seed({
		name : "Mold.Lib.View",
		dna : "class"
	},
	function(preview, name, extend){
		var viewPrototype = function(){
			var that = this;
			var _modelRoutes = false;
			Mold.mixin(this, new Mold.Lib.Event(that));
			Mold.mixin(this, new Mold.Lib.Parents());

			this.template = false;

			this.filter = false;					
			
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

			this.addModelRoute = function(modelRoute){

			}
			
			this.bind = function(model){
				if(!_modelRoutes){
					that.template.bind(model);
				}
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


		if(!extend){
			preview = Mold.extend( viewPrototype, preview, {
				superClassName : "rootclass",
				sourceURL : name
			});
	
		}else{
			var superElement = Mold.getRawSeed(extend);		
			preview = Mold.extend(superElement.func, preview, {
				sourceURL : extend
			});
		}	

			
		return function(){

			var config = (arguments) ? arguments[0] : {};
			var view = new preview(config);
			if(!view.scope){
				throw "a view needs the property 'scope' to work correct!"
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
	}
)