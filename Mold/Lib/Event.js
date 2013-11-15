 "use strict";
Seed (
	{ 
		name : "Mold.Lib.Event",
		dna : "class",
		author : "Jan Kaufmann",
		description : "",
		include : [
			"Mold.Lib.EventStore"
		],
		version : 0.1
	},
	function(element){
		var _element = element;
		var that = this;
		var _isHTMLElement = _element instanceof  Element;
		var _elementEvents = [
			"blur", "change", "contextmenu", "copy", "cut", "dblclick", "error",
			"focus", "focusin", "focusout", "hashchange", "keydown", "keypress", "keyup", 
			"load",  "paste", "reset", "resize", "scroll",
			"select", "submit", "textinput", "transitionend", "unload"
		];
		
		var _mouseEvents = [
			"click", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout",
			"mouseover", "mouseup", "mousewheel", "wheel"
		];
		
		var _translateEvents = {
			"transitionend" : [ "msTransitionEnd", "webkitTransitionEnd", "oTransitionEnd" ]
		}
		
		_elementEvents = _elementEvents.concat(_mouseEvents);
		
		var _isElementEvent = function(event){
			if(_elementEvents.indexOf(event) > -1){
				return true;
			}else{
				return false;
			}
		}
		
		var _initEvent = function(event){
			if(_mouseEvents.indexOf(event) > -1){
				var evt = document.createEvent("MouseEvents");
				evt.initMouseEvent(event, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				return evt;
			}
			
			return false;
		}
		
		var _isEventSupported = function(eventName) {
			eventName = eventName;
			var isSupported = (eventName in _element);
			if (!isSupported) {
				_element.setAttribute(eventName, 'return;');
				isSupported = typeof _element[eventName] == 'function';
				_element.removeAttribute(eventName, 'return;');
			}
			return isSupported;
		}
		
		var _getEventName = function(event){
			if(_translateEvents[event]){
				for(var i = 0; i < _translateEvents[event].length; i++){
					if(_isEventSupported(_translateEvents[event][i])){
						return _translateEvents[event][i];
					}
				}
				return event;
			}else{
				return event;
			}
		}
		
		var _firedActions = {};
		var _eid = Mold.getId();
		this.publics = {
			_eid : _eid,
			when : function(event, callback){
				var executeOn  = function(callback){
					_firedActions[event] = _firedActions[event] || {};
					var trigger = Mold.Lib.EventStore.getElementTrigger(_element, event);

					if(trigger.length > 0){
						
						callback();
					}else{
						var delayedCall = function(){
							callback();
							that.off(event, delayedCall);
						}
						that.on(event, delayedCall);
					}
				}

				if(callback){
					executeOn(callback);
				}
				
				_element.then = function(callback){
					executeOn(callback);
					return _element;
				}
				
				return _element;
			},
			at : function(event, callback, config){
				var trigger = Mold.Lib.EventStore.getElementTrigger(_element, event);
				_firedActions[event] = _firedActions[event] || {};
				if(!_firedActions[event][callback]){
				//	console.log("trigger", trigger)
					for(var i = 0; i < trigger.length; i++){
						if(config && config.triggerElement){
							config.triggerElement.trigger(trigger[i].event, trigger[i].data);
						}else{
						//	console.log("trigger", event);
							this.trigger(trigger[i].event, trigger[i].data);
						}
						
						_firedActions[event][callback] == true;
					}
				}
				this.on(event, callback, config);
				return _element;
								
			},
			delegate : function(event){
				return {
					to : function(triggerElement){
						that.on(event, function(e){
							console.log("delegate", event, triggerElement);
							triggerElement.trigger(event, e.data || false);
						})
					}
				}
			},
			bubble : function(event, data){
				if(_element.hasParents && _element.hasParents()){
					_element.eachParent(function(parent){
						parent.trigger(event, data);
					})
				}
			},
			on : function(event, callback, config){
				var executeOn  = function(callback){
					if(_isHTMLElement && _isElementEvent(event)){
						_element.addEventListener(_getEventName(event), callback);
					}
					Mold.Lib.EventStore.addElementEvent(_element,  event, callback);
					
					_firedActions[event] = true;
				}
				
				if(callback){
					executeOn(callback);
				}
				
				_element.then = function(callback){
					executeOn(callback);
					return _element;
				}
				
				
				return _element;
			},
			off : function(event, callback){
				if(_isHTMLElement && _isElementEvent(event)){
					_element.removeEventListener(_getEventName(event), callback);
				}
				if(event && callback){
					Mold.Lib.EventStore.removeElementEvent(_element, event, callback);
				}else{
					Mold.Lib.EventStore.removeEvents(_element);
				}
				
				return _element;
			},
			trigger : function(event, data, config){
				var output = false;
				if(!data || !data.id || data.id !== "event"){
					var eventData = {
						data : data || false,
						event : event,
						id : "event",
						config : config || false
					}
				}else{
					var eventData = data;
				}
					
				var events = [];
			
				if(config && config.exclude && config.exclude.indexOf(event) > -1){
					//console.log("Exclude Event:", event);
				}else{
					events = Mold.Lib.EventStore.getElementEvent(_element,  event) || [];
					var all = Mold.Lib.EventStore.getElementEvent(_element, "all");
					if(all){
						events = events.concat(all);
					}
				}
				var i = 0, eventsLen =events.length;
				var eventObject = false;
				for(; i < eventsLen;  i++){
					if(_isHTMLElement && _isElementEvent(event)){
						eventObject = _initEvent(event);
						if(eventObject){
							//console.log(_element, event, _element.dispatchEvent);
							_element.dispatchEvent(eventObject);
						}
					}else{
						output = events[i].call(this,eventData) || output;
					}
				}
				Mold.Lib.EventStore.saveTrigger(_element, event, data);
				return output || _element;
			}
		}
		
		
		return this;
	}
);