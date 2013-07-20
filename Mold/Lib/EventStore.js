Seed (
	{ 
		name : "Mold.Lib.EventStore",
		dna : "static",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	function(){
		var _elementList = [];
		var _savedTrigger = [];
		return {
			addElementEvent : function(element, event, value){
			//	Mold.cue.add("registerdEventObjects", "event-"+Mold.getId(), element);
				var item = this.getElement(element);
				if(!item){
					_elementList.push({
						element : element,
						events : []
					});
					item = _elementList[_elementList.length -1];
					
				}
				item.events[event] = item.events[event] || [];
				item.events[event].push(value);
			
			},
			removeElementEvent : function(element, event, value){
				var item = this.getElement(element);
				if(item && item[event]){
					if(value){
						for(var i = 0; i < item[event].length; i++){
							if(item[event][i] === value){
								item[event].splice(i, 1);
								break;
							}
						}
					}else{
						delete item[event];
					}
				}
			},
			removeEvents : function(element){
				for(var selected in _elementList){
					if(_elementList[selected].element === element){
						delete _elementList.splice(selected, 1);
					}
				}
			},
			getElementEvent : function(element, event) {
				var selectedElement = this.getElement(element);
				if(selectedElement && selectedElement.events[event]){
					return selectedElement.events[event];
				}
				return false;
			},
			getElement : function(element){
				for(var selected in _elementList){
					if(_elementList[selected].element === element){
						return _elementList[selected];
					}
				}
				return false;
			},
			getEventStore : function(){
				return _elementList;
			},
			removeTrigger : function(element, event){
				for(var i = 0; i < _savedTrigger.length; i++){
					if(_savedTrigger[i].element === element && _savedTrigger[i].event === event){
						_savedTrigger.splice(i, 1);
					}
				}
			},
			saveTrigger : function(element, event, data){
				this.removeTrigger(element, event);
				_savedTrigger.push({
					element : element,
					event : event,
					data : data
				})
			},

			getElementTrigger : function(element, event){
				var trigger = [];
				for(var i = 0; i < _savedTrigger.length; i++){
					if(event === "all"){
						if(_savedTrigger[i].element === element){
							trigger.push(_savedTrigger[i]);
						}
					}else{
						if(_savedTrigger[i].element === element && _savedTrigger[i].event === event){
							trigger.push(_savedTrigger[i]);
						}
					}
				}
				return trigger;
			}
		}
	}
);