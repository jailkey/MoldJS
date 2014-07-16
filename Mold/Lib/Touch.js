Seed({
		name : "Mold.Lib.Touch",
		dna : "class",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Worker"
		]

	},
	function(element, config){

		var _lastFingerDistance = 0,
			_lastTime = 0,
			_lastTouchStart = 0,
			_startFingerPosition = [],
			_startX = 0,
			_startY = 0,
			_startTime = 0,
			_stopHandlingEvents = false,
			_gestures = {},
			_lastFingerPosition = false,
			_lastTouchEvent = false,
			_lastTimeStamp = false,
			_config = Mold.mixin({
				doubleTabTime : 400,
				holdTime : 800,
				minSwipTime : 50,
				minDragtime : 10,
				pinchMinDifference : 1.5,
				dragTolerance : 3,
				captureDelay : 0,
			}, config),
			_useAngle = ((config.subset && Mold.contains(config.subset, "rotate")) ? true : false),
			that = this;

		Mold.mixin(this, new Mold.Lib.Event(this));

		that.on("all", function(e){
			_lastTouchEvent =  e.event;
		});

/*Timerobject handles timeouts*/
		var _timer = {
			timerList : {},
			set : function(name, duration, callback){
				this.clear(name);
				this.timerList[name] = window.setTimeout(callback, duration);
			},
			get : function(name){
				return this.timerList[name] || false;
			},
			clear : function(name){
				if(name){
					window.clearTimeout(this.timerList[name]);
				}else{
					Mold.each(this.timerList, function(callback, timerName){
						this.clear(timerName);
					});
				}
			}
		}

/*execute an touchevent with given propertys*/
		var _execute = function(parameter){
			Mold.each(_gestures, function(callback){
				callback.call(this, parameter, _config);

			})
		}

		

		var _isInTolerance = function(reference, value, tolerance){
			if(
				reference + tolerance > value 
				&& reference - tolerance < value 
			){
				return true;
			}
			return false;
		}


/* caluclation without worker*/
		var _calculate = function(target, touch){
		
			var output = {};

			var _getAngel = function(from, to){
				var angle = Math.atan((from.y - to.y) * -1 / (from.x - to.x)) * (180 / Math.PI);
				return parseInt((angle < 0) ? angle + 180 : angle);
			}

			var x1 = target[0].clientX,
				y1 = target[0].clientY,
				fingerDistance = false;

			if(target.length === 2){
				
				var x2 = target[1].clientX,
					y2 = target[1].clientY;

				fingerDistance = Math.sqrt(
					Math.pow(x1 - x2, 2) 
					+ Math.pow(y1 - y2, 2)
				);
			}

			var fingerPositions = [];

			for(var i = 0; i < target.length; i++){
				var position = target[i];
				var fingerPositionX = (fingerPositions[0]) ? fingerPositions[0].x : 0;
				var fingerPositionY = (fingerPositions[0]) ? fingerPositions[0].y : 0;
				fingerPositions.push({
					x : position.clientX,
					y : position.clientY,
					difX : Math.abs(_startX - position.clientX),
					difY : Math.abs(_startY - position.clientY),
					startDistance :  Math.sqrt(
						Math.pow(_startX - position.clientX, 2) 
						+ Math.pow(_startY - position.clientY, 2)
					),
					angle : (_useAngle) ? _getAngel(
						{ x : fingerPositionX, y : fingerPositionY},
						{ x : position.clientX, y : position.clientY}
					) : false
				})
			}

			if(!_lastTimeStamp){
				_lastTimeStamp = touch.timeStamp;
			}

			if(!_lastFingerPosition){
				_lastFingerPosition = fingerPositions[0];
			}
			/*
			var distance = parseInt(Math.sqrt(
				Math.pow(_lastFingerPosition.x - fingerPositions[0].x, 2) 
				+ Math.pow(_lastFingerPosition.y - fingerPositions[0].y, 2)
			), 10);*/

			var speed = (touch.timeStamp - _lastTimeStamp);

			_lastTimeStamp = touch.timeStamp;
			
			var touchProperties = {
				on : false,
				fingers : target.length,
				startTime : _startTime,
				time : touch.timeStamp,
				//distance : distance,
				lastStartTime : _lastTouchStart,
				fingerPositions : fingerPositions,
				fingerDistance : fingerDistance,
				lastFingerDistance :  _lastFingerDistance || false,
				startFingerPositions : _startFingerPosition,
				speed : speed,
				timer : _timer,
				stop : function(){
					_stopHandlingEvents = true;
				},
				isStoped : function(){
					return _stopHandlingEvents;
				}
			};

			
			_lastFingerPosition = fingerPositions[0];

			return { properties : touchProperties, globals : output};
		}

/*creates an touchevent from standard javascript event*/
		/*
		var exportWorker = new Mold.Lib.Worker(function(e){
			
			var target = e.data.target;
			var output = {};

			var _getAngel = function(from, to){
				var angle = Math.atan((from.y - to.y) * -1 / (from.x - to.x)) * (180 / Math.PI);
				return parseInt((angle < 0) ? angle + 180 : angle);
			}

			var x1 = target[0].clientX,
				y1 = target[0].clientY,
				fingerDistance = false;

			if(target.length === 2){
				
				var x2 = target[1].clientX,
					y2 = target[1].clientY;

				fingerDistance = Math.sqrt(
					Math.pow(x1 - x2, 2) 
					+ Math.pow(y1 - y2, 2)
				);
			}

			var fingerPositions = [];

			for(var i = 0; i < target.length; i++){
				var position = target[i];
				var fingerPositionX = (fingerPositions[0]) ? fingerPositions[0].x : 0;
				var fingerPositionY = (fingerPositions[0]) ? fingerPositions[0].y : 0;
				fingerPositions.push({
					x : position.clientX,
					y : position.clientY,
					difX : Math.abs(e.data._startX - position.clientX),
					difY : Math.abs(e.data._startY - position.clientY),
					startDistance :  Math.sqrt(
						Math.pow(e.data._startX - position.clientX, 2) 
						+ Math.pow(e.data._startY - position.clientY, 2)
					),
					angle : _getAngel(
						{ x : fingerPositionX, y : fingerPositionY},
						{ x : position.clientX, y : position.clientY}
					)
				})
			}

			if(!e.data._lastTimeStamp){
				output["_lastTimeStamp"] = e.data.timeStamp;
			}

			if(!e.data._lastFingerPosition){
				output["_lastFingerPosition"] = fingerPositions[0];
			}
			var distance = parseInt(Math.sqrt(
				Math.pow(e.data._lastFingerPosition.x - fingerPositions[0].x, 2) 
				+ Math.pow(e.data._lastFingerPosition.y - fingerPositions[0].y, 2)
			), 10);

			var speed = (e.data.timeStamp - e.data._lastTimeStamp);

			output["_lastTimeStamp"] = e.data.timeStamp;
			
			var touchProperties = {
				on : false,
				fingers : target.length,
				startTime : e.data._startTime,
				time : e.data.timeStamp,
				distance : distance,
				lastStartTime : e.data._lastTouchStart,
				fingerPositions : fingerPositions,
				fingerDistance : fingerDistance,
				lastFingerDistance :  e.data._lastFingerDistance || false,
				startFingerPositions : e.data._startFingerPosition,
				speed : speed
			};

			output["_lastFingerPosition"] = fingerPositions[0];

			postMessage({ properties : touchProperties, globals : output, _wid : e.data._wid});
		}, 'calculateTouch')

		
		var _setGlobals = function(globals){
			Mold.each(globals, function(value, name){
				that[name] = value;
			});
		}

		
		var _onMessage = function(e){
			Mold.mixin(e.data.properties, {
				"event" : _registerdWorker[e.data._wid].touch,
				"timer" : _timer,
				"stop" : function(){
					_stopHandlingEvents = true;
				},
				"isStoped" : function(){
					return _stopHandlingEvents;
				}
			})
			_registerdWorker[e.data._wid].callback.call(null, e.data.properties);
			delete _registerdWorker[e.data._wid];
			_lastFingerPosition = e.data.properties.fingerPositions[0];
			_setGlobals(e.data.globals)

		}
	
		exportWorker.on("message", _onMessage);
		
		
		var _wid = 0;
		var _registerdWorker = {};
		var _exportTouchAsync = function(touch, target, callback){
			var newTarget = [];

			Mold.each(target, function(value, name){
				if(name !== "length"){
					newTarget[+name] = {};

					Mold.mixin(newTarget[+name], value, [
						"clientX", "clientY"
					]);
				}
			});

//Wait for Workerst aswer
			 _wid++;

			_registerdWorker["w"+_wid] = {
				callback : callback,
				touch : touch
			}

			exportWorker.post({ 
				//"touch" : touch,
				"_wid" : "w"+_wid,
				"timeStamp" : touch.timeStamp,
				"target" : newTarget,
				"_startX" : _startX,
				"_startY" : _startY,
				"_lastTimeStamp" : _lastTimeStamp,
				"_lastFingerPosition" : _lastFingerPosition, 
				"_startTime" : _startTime, 
				"_lastTouchStart" : _lastTouchStart,
				"_lastFingerDistance" : _lastFingerDistance,
				"_startFingerPosition" : _startFingerPosition
			});
		}
		*/

		var _exportTouchSync = function(touch, target, callback){

			var data = _calculate(target, touch);


			
			
			callback.call(this, data.properties)
		}

		var _exportTouch  = (config.useWorker) ? _exportTouchAsync : _exportTouchSync;

/*handles touch start*/
		var _lastCaputer = 0;
		element.on('touchstart', function(e){
			
			_lastTime = 0;
			_startTime =  e.timeStamp;
			_startX = e.targetTouches[0].clientX;
			_startY = e.targetTouches[0].clientY;


			_exportTouch(e, e.targetTouches, function(touchPropertys){
				_startFingerPosition = touchPropertys.fingerPositions;
				Mold.mixin(touchPropertys, {
					on : "start"
				});

				_execute(touchPropertys);

				_lastTouchStart = e.timeStamp;
				_lastFingerDistance = touchPropertys.fingerDistance;
				that.trigger("touch.start", touchPropertys);
			});
			
		});

/*handles touch move*/
		
		element.on('touchmove', function(e) {
			e.preventDefault();
			//console.log()
			if(_config.captureDelay < e.timeStamp - _lastCaputer){
				_exportTouch(e, e.changedTouches, function(touchPropertys){
					

					Mold.mixin(touchPropertys, {
						on : "move"
					});

					_execute(touchPropertys);

					_lastFingerDistance = touchPropertys.fingerDistance;
					_lastCaputer = touchPropertys.time;
				});
			}
		});

/*handles touch end*/
		element.on('touchend', function(e){
			//var touchPropertys = _exportTouch(e, e.changedTouches);
			_exportTouch(e, e.changedTouches, function(touchPropertys){
				Mold.mixin(touchPropertys, {
					on : "end"
				});
				_execute(touchPropertys);
				_lastFingerDistance = touchPropertys.fingerDistance;

				if(e.targetTouches.length === 0){
					_stopHandlingEvents = false;
				}
				_lastTimeStamp = false;
				that.trigger("touch.end", touchPropertys);
			});
		});

/*add a new touchevent*/
		var _add = function(name, callback){
			if(_config.subset){
				if(Mold.contains(_config.subset, name)){
					_gestures[name] = callback;
				}
			}else{
				_gestures[name] = callback;
			}
			
		}

		_add("tab", function(touch){
			if(touch.on === "end" && touch.fingers === 1 && !touch.isStoped()){

				that.trigger("tab", touch, { context : element } );
			}
		});

		_add("single.tab", function(touch, config){
			if(touch.on === "end" && touch.fingers === 1 && !touch.isStoped()){
				touch.timer.set("single.tab.timer", config.doubleTabTime, function(){
					that.trigger("single.tab", touch);
				});
			}
		});

		_add("double.tab", function(touch, config){
			if(touch.on === "start" && touch.fingers === 1){
				touch.timer.clear("single.tab.timer");
				if(touch.lastStartTime + config.doubleTabTime >= touch.time){
					that.trigger("double.tab", touch);
					touch.stop();
				}
			}
		});

		_add("hold", function(touch, config){
			if(touch.on === "start"){
				touch.timer.clear("hold.timer");
				if(touch.fingers === 1){
					touch.timer.set("hold.timer", config.holdTime, function(){
						that.trigger("hold", touch);
					});
				}
			}
			if(touch.on === "end"){
				touch.timer.clear("hold.timer");
			}
		});

		_add("pinch.out", function(touch, config){
			if(touch.on === "move" && touch.fingers === 2){
				var difference = touch.fingerDistance - touch.lastFingerDistance;
				
				if(touch.lastFingerDistance < touch.fingerDistance && difference > config.pinchMinDifference){
					touch.timer.clear("hold.timer");
					that.trigger("pinch.out", touch);
					touch.stop();
				}
			}
		});

		_add("pinch.in", function(touch, config){
			if(touch.on === "move" && touch.fingers === 2){
				var difference = touch.lastFingerDistance - touch.fingerDistance;
				if(touch.lastFingerDistance > touch.fingerDistance && difference > config.pinchMinDifference){
					touch.timer.clear("hold.timer");
					that.trigger("pinch.in", touch);
					touch.stop();
				}
			}
		});

		var _lastDragPos = false;
		_add("drag", function(touch, config){
			if(
				touch.on === "move" 
				&& touch.fingers === 1
				&& touch.time > (touch.startTime + config.minDragtime)
				//&& !touch.isStoped()
			){
				if(
					!_isInTolerance(_lastDragPos.x, touch.fingerPositions[0].x , _config.dragTolerance)
					&& !_isInTolerance(_lastDragPos.y, touch.fingerPositions[0].y , _config.dragTolerance)
				){
					if(!_lastDragPos){
						_lastDragPos = {
							x : touch.startFingerPositions[0].x,
							y : touch.startFingerPositions[0].y,
						}
					}
					if(touch.fingerPositions[0].difX > touch.fingerPositions[0].difY){

						touch.timer.clear("single.tab.timer");
						that.trigger("drag", touch);
						if(_lastDragPos.x < touch.fingerPositions[0].x){

							that.trigger("drag.right", touch);

						}else{

							that.trigger("drag.left", touch);
						}
					}else if(touch.fingerPositions[0].difX < touch.fingerPositions[0].difY){
						
						touch.timer.clear("single.tab.timer");
						that.trigger("drag", touch);
						if(_lastDragPos.y < touch.fingerPositions[0].y){
							that.trigger("drag.down", touch);
						}else{

							that.trigger("drag.up", touch);
						}
					}
					
					_lastDragPos = {
						x : touch.fingerPositions[0].x,
						y : touch.fingerPositions[0].y
					};
					
				}
			}

			if(touch.on === "end"){
				_lastDragPos = false;
			}

		});

		var _rotation = false;

		_add("rotate", function(touch, config){
			if(touch.on === "move" && touch.fingers === 2 && touch.startFingerPositions.length > 1){
        		var angleDifference = parseInt(touch.startFingerPositions[1].angle - touch.fingerPositions[1].angle, 10);

        		if(Math.abs(angleDifference) > 18 || _rotation){
        			
        			Mold.mixin(touch, {
        				angel : angleDifference
        			})

        			that.trigger("rotate", touch);
        			_rotation = true;

        			if(angleDifference > 0){
        				that.trigger("rotate.right", touch);
        			}else{
        				that.trigger("rotate.left", touch);
        			}
        			touch.stop();
        		}
			}
			if(touch.on === "end"){
				_rotation = false;
			}
		});

		_add("swipe", function(touch, config){
			if(
				touch.on === "end" 
				&& touch.fingers === 1
				&& touch.time > (touch.startTime + config.minSwipTime)
				&& !touch.isStoped()
			){
				
				if(touch.fingerPositions[0].difX > touch.fingerPositions[0].difY){
					touch.timer.clear("single.tab.timer");
					if(touch.startFingerPositions[0].x < touch.fingerPositions[0].x){

						that.trigger("swipe.right", touch);
					}else{

						that.trigger("swipe.left", touch);
					}
					touch.stop();
				}else if(touch.fingerPositions[0].difX < touch.fingerPositions[0].difY){
					touch.timer.clear("single.tab.timer");
					if(touch.startFingerPositions[0].y < touch.fingerPositions[0].y){

						that.trigger("swipe.down", touch);
					}else{

						that.trigger("swipe.up", touch);
					}
					touch.stop();
				}
				
			}

		});



		this.publics = {
			add : function(name, callback){
				_add(name, callback)
			},
			lastEvent : function(){
				return _lastTouchEvent;
			}
		}
	}
)