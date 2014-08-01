Seed({
		name : "Mold.Lib.Canvas",
		dna : "class",
		include : [
			"Mold.Lib.Element",
			"Mold.Lib.CanvasNode",
			"Mold.Lib.Event",
			"Mold.Lib.Loader",
			"Mold.Lib.Color"
		]
	},
	function(config){
		var _canvas = new Mold.Lib.Element("canvas");
		var _context = _canvas.getContext('2d');
		var _elements = [];
		var _images = {};
		var _that = this;
		var _isAnimation = false;

		Mold.mixin(_canvas, new Mold.Lib.Event(_canvas));

		config = Mold.mixin({
			height : 600,
			width : 1200
		}, config)

		_canvas.height = config.height;
		_canvas.width = config.width;


		var _sortElementsByIndex = function(){
			_elements.sort(function(a, b){
				return a.index() > b.index();
			});
		}

		var _createElement = function(){

		}


		var requestAnimation = window.requestAnimationFrame       
				|| window.webkitRequestAnimationFrame 
				|| window.mozRequestAnimationFrame
				|| function( callback ){ window.setTimeout(callback, 1000 / 60) };
	



		var _clear = function(){
			_context.save();
			_context.setTransform(1, 0, 0, 1, 0, 0);
			_context.clearRect(0, 0, _canvas.width, _canvas.height);
			_context.restore();
		}

		var drawCounter = 0;

		var _draw = function(t){
			_sortElementsByIndex();
			_clear();
			//console.log("draw counter", drawCounter);
			drawCounter++
			var elementCounter  = 0;

			var drawElement = function(){
				
				if(_elements.length && _elements.length > elementCounter){
			

					var elementCanvas = _elements[elementCounter].draw();
					var elementStyle =  _elements[elementCounter].style();
	
					_context.globalAlpha = elementStyle.opacity;

					if(elementStyle.verticalAlign === "center"){
						var offsetLeft = ((_canvas.width - elementStyle.width) / 2);
					}else{
						var offsetLeft = 0;
					}

					if(elementStyle.horizontalAlign === "center"){
						var offsetTop = ((_canvasstyle.height - elementStyle.height) / 2);
					}else{
						var offsetTop = 0;
					}

					_context.drawImage(elementCanvas, offsetLeft + elementStyle.left, offsetTop + elementStyle.top);
					_elements[elementCounter].redrawParent = false;
					_elements[elementCounter].offset(offsetLeft, offsetTop)
					elementCounter++;
					drawElement.call(this);
				}
			}

			drawElement.call(this);
		}



		var _loop = function(t){
			if(_isAnimation){
				var checkAnimation = false;	
				requestAnimation(_loop);
				Mold.each(_elements, function(element){
					var elementAnimation = element.animate(t);
					if(elementAnimation){
						checkAnimation = true;
					}
				});
					
				_draw(t);
				if(!checkAnimation){
					_canvas.animation.stop();
				}
			
			}
		}

		var _convertDomElementToCanvas = function(element, onready){
			
			if(element.instanceOf === "Mold.Lib.Element"){
				element.getImage(onready)
            }else{
            	throw "You can only convert Mold.Lib.Element to Mold.Lib.CanvasNode"
            }
		}

		//recursiv
		var _eachElement = function(collection, action){
			Mold.each(collection, function(element){
				action.call(element, element);
				var children = element.children();
				if(children){
					 _eachElement(children, action);
				}
			});
		}


		var _standard = function(e, eventName){
			var x = e.pageX - _canvas.offsetLeft,
       			y = e.pageY - _canvas.offsetTop;

			_eachElement(_elements, function(element){
				if(element.collision(x, y)){
					element.trigger(eventName);
				}
			});
		}

		var _mouseover = function(e){
			var x = e.pageX - _canvas.offsetLeft,
       			y = e.pageY - _canvas.offsetTop;

			_eachElement(_elements, function(element){
				if(element.collision(x, y) && !element.isMouseover){
					element.trigger("mouseover");
					element.isMouseover = true;
				}
			});
		}

		var _mouseout = function(e){
			var x = e.pageX - _canvas.offsetLeft,
       			y = e.pageY - _canvas.offsetTop;

			_eachElement(_elements, function(element){
				if(!element.collision(x, y) && element.isMouseover){
					element.trigger("mouseout");
					element.isMouseover = false;
				}
			});
		}



		_canvas
			.on("click", function(e){
				_standard(e, 'click');
			})
			.on("mouseup", function(e){
				_standard(e, 'mouseup');
			})
			.on("mousedown", function(e){
				_standard(e, 'mousedown');
			})
			.on("mousemove", function(e){
				_standard(e, 'mousemove');
			})
			.on("mousemove", _mouseover)
			.on("mousemove", _mouseout)


		_canvas.addMethod({

			animation : {
				start : function(){
					if(!_isAnimation){
						_isAnimation = true;
						_canvas.animation.isAnimation = true;
						requestAnimation(_loop);
					}
				},
				time : 0,
				isAnimation : false,
				stop : function(){
					_isAnimation = false;
					_canvas.animation.isAnimation = true;
				}
			},
			createElement : function(element){
				var node = new Mold.Lib.CanvasNode({
					element : element

				})
				return node;
			},
			append : function(element){
				if(element.className !== "Mold.Lib.CanvasNode"){
					if(element.className){
						throw new Error("you try to append "+element.className+", but you can only append Mold.Lib.CanvasNode to a CanvasNode!");
					}else{
						throw new Error("you can only append Mold.Lib.CanvasNode to a CanvasNode!");
					}
				}
				element.canvas(_canvas);
				element.parent(_canvas);
				_elements.push(element);
				_draw();
			},
			draw : function(){
				_draw();
			},
			name : function(){
				return "root"
			},
			redraw : function(){
				_draw();
			},
			loadImage : function(image, onload){
				if(!_images[image]){
					var loader = new Mold.Lib.Loader();
					loader.on('ready', function(){
						_images[image] = true;
						_draw();
						onload.call(this);
					});
					loader.append(image);
					loader.load();
				}
			}
		})
		
		return _canvas;
	}
)