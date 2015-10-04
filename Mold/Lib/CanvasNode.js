Seed({
		name : "Mold.Lib.CanvasNode",
		dna : "class",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Info",
			"Mold.Lib.Color",
			"Mold.Lib.Ease",
			"Mold.Lib.Loader"
		]
	},
	function(data){
		
		var _nodeCanvas = new Mold.Lib.Element("canvas");
		var _nodeContext = _nodeCanvas.getContext('2d');
		var _redraw = true;
		var _images = {};
		var _sequenceCounter = 0;
		var _lastStyle = {
			left : 0,
			top : 0,
			width : 0,
			height : 0
		};
		var _nodeData = Mold.mixin({
			htmlElement : false,
			name : false,
			context : null,
			canvas : null,
			id : Mold.getId(),
			parent : null,
			nodeValue : null,
			children : [],
			animations : {},
			sequence : {},
			text : false,
			style : {
				display : 'block',
				zIndex : 0,
				height : 0,
				width : 0,
				top : 0,
				left : 0,
				opacity : 1,
				offsetTop : 0,
				offsetLeft : 0,
				boxSizing : 'content-box',
				paddingLeft : 0,
				paddingRight : 0,
				paddingTop : 0,
				paddingBottom : 0,
				position : 'absolute',
				backgroundColor : false,
				backgroundImage : 'none',
				backgroundWidth : 0,
				backgroundHeight : 0,
				borderRadiusLeftTop : 0,
				borderRadiusLeftBottom : 0,
				borderRadiusRightTop : 0,
				borderRadiusRightBottom : 0,
				verticalAlign : 'left',
				horizontalAlign : 'top',
				textAlign : 'left',
				fontSize : 12,
				color : "#00000",
				fontWeight : "",
				fontFamily : "Arial",
				lineHeight : 12,
				textBaseline : "middle"
			}
		}, data);

		var _that = this;

		Mold.mixin(this, new Mold.Lib.Event(this));
		_nodeContext.imageSmoothingEnabled = "disabled"; 

		var _loadImage = function(image, onload){
			if(!_images[image]){
				var loader = new Mold.Lib.Loader();
				var img = new Mold.Lib.Element("img");
				img.onload = function(){

					_images[image] = img;
					_redraw = true;
					if(_nodeData.parent){
						_nodeData.parent.draw(true);
					}
					onload.call(this);
					
				}
				img.crossOrigin = "Anonymous";
				img.src = image; 
				return false;
			}
			return _images[image];
		}


		var _sortChildrenByIndex = function(){
			_nodeData.children.sort(function(a, b){
				return a.index() > b.index();
			});
		}

		var _setChildrenOffset = function(){
			Mold.each(_nodeData.children, function(child){
				if(child.style().verticalAlign === "center"){
					var offsetLeft = ((_nodeData.style.width - child.width) / 2) + _nodeData.style.left + _nodeData.style.paddingLeft;

				}else{
					var offsetLeft = _nodeData.style.left + _nodeData.style.paddingLeft;
				}
				if(child.style().horizontalAlign === "center"){
					var offsetTop = ((_nodeData.style.height - child.height) / 2) + _nodeData.style.top + _nodeData.style.paddingTop;
				}else{
					var offsetTop = _nodeData.style.top + _nodeData.style.paddingTop;
				}
				child.css({
					offsetLeft : offsetLeft,
					offsetTop : offsetTop
				});
			});
		}

		var _clear = function(){
			_nodeContext.save();
			_nodeContext.setTransform(1, 0, 0, 1, 0, 0);
			_nodeContext.clearRect(0, 0, _nodeCanvas.width, _nodeCanvas.height);
			_nodeContext.restore();
		}

		var _sizes = function(){
			var style = _nodeData.style;
			return {
				width : (style.boxSizing === "content-box") ? style.width + style.paddingRight + style.paddingLeft : style.width,
				height : (style.boxSizing === "content-box") ? style.height + style.paddingTop + style.paddingBottom : style.height
			}
		}

		var _drawBackgroundImage = function(){
			var style = _nodeData.style;
			if(style.backgroundImage && style.backgroundImage !== 'none'){
				if(Mold.isNode(style.backgroundImage)){

					var img = style.backgroundImage;
				}else{
					var img = _loadImage(style.backgroundImage, function(){});
					if(!img){
						return false;
					}
				}
				_nodeContext.drawImage(img, 
					0,
					0,
					img.width,//(style.boxSizing === "content-box") ? style.width + style.paddingRight + style.paddingLeft : style.width,
					img.height, //(style.boxSizing === "content-box") ? style.height + style.paddingTop + style.paddingBottom : style.height,
					0,
					0,
					(style.boxSizing === "content-box") ? style.width + style.paddingRight + style.paddingLeft : style.width,
					(style.boxSizing === "content-box") ? style.height + style.paddingTop + style.paddingBottom : style.height
				);
 				
				
			}
		}

		var _drawText = function(){
			var style = _nodeData.style;
			if(Mold.is(_nodeData.text) && _nodeData.text !== false){
				//console.log("render text", style.color, style.fontSize+ " " + style.fontFamily)
				_nodeContext.fillStyle = style.color;
				_nodeContext.font = style.fontSize+ " " + style.fontFamily;
				_nodeContext.textAlign = style.textAlign;
				_nodeContext.textBaseline = style.textBaseline;
				var textStart = (style.textAlign === "center") ? style.width / 2 : 0;
			 	_nodeContext.fillText(_nodeData.text, textStart, style.lineHeight);
			 	
			 }
		}


		var _drawWithBorderRadius = function() {
			if (typeof stroke == "undefined" ) {
				stroke = false;
			}
			var width = _sizes().width;
			var height = _sizes().height;
			var x = 0;
			var y = 0; 
			var style = _nodeData.style;

			_nodeContext.beginPath();
			_nodeContext.moveTo(x + style.borderRadiusLeftTop, y);
			_nodeContext.lineTo(x + width - style.borderRadiusRightTop, y);
			_nodeContext.quadraticCurveTo(x + width, y, x + width, y + style.borderRadiusRightTop);
			_nodeContext.lineTo(x + width, y + height - style.borderRadiusRightBottom);
			_nodeContext.quadraticCurveTo(x + width, y + height, x + width - style.borderRadiusRightBottom, y + height);
			_nodeContext.lineTo(x + style.borderRadiusLeftBottom, y + height);
			_nodeContext.quadraticCurveTo(x, y + height, x, y + height - style.borderRadiusLeftBottom);
			_nodeContext.lineTo(x, y + style.borderRadiusLeftTop);
			_nodeContext.quadraticCurveTo(x, y, x + style.borderRadiusLeftTop, y);
			_nodeContext.closePath();
			if (stroke) {
				_nodeContext.stroke();
			}

			_nodeContext.fill()
			       
		}


		var _draw = function(redraw){
			
			var style = _nodeData.style;
			if(_redraw || redraw){

				_clear();
				var childCounter = 0;
				if(style.backgroundColor && style.backgroundColor !== 'none'){
					_nodeContext.fillStyle = "rgb("
						+ style.backgroundColor.r
						+ "," + style.backgroundColor.g
						+ ", " + style.backgroundColor.b 
						+ ")";
				}else{
					_nodeContext.fillStyle = "rgba(0, 0, 0, 0)";
				}

				if(	style.borderRadiusLeftTop 
					|| style.borderRadiusLeftBottom
					|| style.borderRadiusLeftTop
					|| style.borderRadiusRightBottom
					|| style.borderRadiusRightTop
				){
					_drawWithBorderRadius();
					_nodeContext.clip();
				}else{
		 			_nodeContext.fillRect(
		 				0,
		 				0,
		 				(style.boxSizing === "content-box") ? style.width + style.paddingRight + style.paddingLeft : style.width,
		 				(style.boxSizing === "content-box") ? style.height + style.paddingTop + style.paddingBottom : style.height
		 			);
		 		}
	 			
	 			_drawBackgroundImage();

	 			_drawText();

	 			_sortChildrenByIndex();
			
				Mold.each(_nodeData.children, function(child){
					
					var childContext = child.draw();
					var childStyle = child.style();
					_nodeContext.globalAlpha = childStyle.opacity;
					_nodeContext.drawImage(
						childContext,
						style.paddingLeft + childStyle.left,
						style.paddingTop + childStyle.top
					);
					_nodeContext.globalAlpha = 1;
					child.redrawParent = false;
				});
				//console.log("redraw", style.backgroundImage)
				_redraw = false;
				//console.log("redraw", _that.name(), + _that.id());
				if(_nodeData.parent){
				//	console.log("redraw parent", _nodeData.parent.name())
					_nodeData.parent.draw(true);
				}
				
				
	 		}else{
	 			//console.log("do not redraw", _that.name(), + _that.id())
	 		}

 			return _nodeCanvas;
		}

		var _isPixelProperty = function(property){
			switch (property){
				case "padding":
				case "paddingLeft":
				case "paddingRight":
				case "paddingTop":
				case "paddingBottom":
				case "backgroundHeight":
				case "backgroundWidth":
				case "height":
				case "width":
				case "left":
				case "top":
					return true;
				default:
					return false;
			}
		}


		var _cleanValue = function(value){
			if(value && !Mold.isObject(value)){
				return value.replace("px", '');
			}
		}

		var _applyStyle = function(style, value){
			var nodeStyle = _nodeData.style;
			//value = _cleanValue(value);
			switch(style){

				case "borderRadius":
					nodeStyle.borderRadiusLeftTop = value;
					nodeStyle.borderRadiusLeftBottom = value;
					nodeStyle.borderRadiusRightBottom = value;
					nodeStyle.borderRadiusRightTop = value;
					_redraw = true;
					break;
				case "padding":
					nodeStyle.paddingLeft = value;
					nodeStyle.paddingRight = value;
					nodeStyle.paddingTop = value;
					nodeStyle.paddingBottom = value;
					_redraw = true;
					break;
				case "backgroundColor":
					if(Mold.Lib.Info.isHexValue(value)){
						nodeStyle.backgroundColor = Mold.Lib.Color.hexToRGB(value);
					}else{
						nodeStyle.backgroundColor = value;
					}
					_redraw = true;
					break;
				case "width":
					_nodeCanvas.width = value;
					nodeStyle.width = value;
					_lastStyle.width = (style.boxSizing === "content-box") ? style.width + style.paddingRight + style.paddingLeft : style.width;
					_redraw = true;
					break;
				case "height":
					_nodeCanvas.height = value;
					nodeStyle.height = value;
					_lastStyle.height = (style.boxSizing === "content-box") ? style.height + style.paddingTop + style.paddingBottom : style.height;
					_redraw = true;
					break;
				case "left":
				case "top":
				case "paddingLeft":
				case "paddingTop":
				case "paddingBottom":
				case "paddingRight":
				case "backgroundImage":
					_lastStyle.left = nodeStyle.left + nodeStyle.offsetLeft;
					_lastStyle.top = nodeStyle.top + nodeStyle.offsetTop;
					_that.redrawParent = true;
				default:
					if(Mold.is(nodeStyle[style])){
						nodeStyle[style] = value;
					}
					break;
			}

		
		}

		var _addAnimation = function(property, startValue, endValue, duration, ease, delay, target){
			_that.trigger("animation.start");
			_nodeData.animations[property] = {
				duration : duration, 
				ease : ease || "linear",
				delay : delay || 0,
				start : 0,
				endValue : endValue,
				startValue : startValue,
				frame : false,
				lastFactor : 0
			}
			
		}

		var _removeAnimation = function(property){
			_that.trigger("animation.end", { property : property });
			if(_nodeData.animations[property]){
				delete _nodeData.animations[property];
			}
		}

		var _getPixelColor = function(x, y){
			var realX = x - _nodeData.style.offsetLeft - _nodeData.style.left;
			var realY = y - _nodeData.style.offsetTop - _nodeData.style.top;

			var pixelData = _nodeContext.getImageData(realX, realY, 1, 1);
			//console.log(realX, realY, pixelData.data[2], pixelData.data[3])
			return pixelData.data;
		}

		var _testCollision = function(x, y){

			if(
				_nodeData.style.offsetLeft + _nodeData.style.left < x 
				&& _sizes().width + _nodeData.style.offsetLeft + _nodeData.style.left > x
				&& _nodeData.style.offsetTop + _nodeData.style.top < y
				&& _sizes().height + _nodeData.style.offsetTop + _nodeData.style.top > y
			){
				//if(_getPixelColor(x, y)[3] > 0){
					return true;
				//}
			}
			return false;
		}

		var _animate = function(animations, time, onend){
			var isAnimation = false;
			Mold.each(animations, function(value, property){
					
				var originalValue = _that.css(property);
				if(value.start === 0){
					value.start = time
				}
				if(
					value.start + value.duration > time
				){
					var factor = Mold.Lib.Ease[value.ease](time - value.start, value.startValue, (value.endValue - value.startValue), value.duration);
					if(_isPixelProperty(property)){
						factor = Math.round(factor);
					}
					_that.css(property, factor);
					isAnimation = true;
				}else{
					_removeAnimation(property);
					onend.call(this, property)
				}
			});
			return isAnimation;
		}


		var _init = function(){
			if(_nodeData.element){
				_nodeData.element.getImage(function(img, width, height){
					_that.css({
						backgroundImage : img,
						width : width,
						height : height
					})
					_draw()
				});
			}
		}

		_init();

		var _counter = 0;
		this.publics = {
			redrawParent : false,
			name : function(name){
				if(name){
					_nodeData.name = name;
				}
				return _nodeData.name;
			},
			id : function(id){
				if(id){
					_nodeData.id = id;
				}
				return _nodeData.id;
			},
			children : function(){
				return _nodeData.children;
			},
			style : function(){
				return _nodeData.style;
			},
			lastStyle : function(){
				return _lastStyle;
			},
			draw : function(redraw){
				if(_nodeContext){
					return _draw(redraw);
				}else{	
					throw new Error("CanvasNode must be appended to a Canvas for drawing!")
				}
			},
			getContext : function(){
				return _nodeContext;
			},
			getCanvas : function(){
				return _nodeCanvas;
			},
			collision : function(x, y){
				return _testCollision(x, y);
			},
			canvas : function(canvas){
				if(canvas){
					_nodeData.canvas = canvas 
					Mold.each(_nodeData.children, function(child){
						child.canvas(canvas);
					})
				}
				return _nodeData.canvas;
			},
			offset : function(left, top){
				_nodeData.style.offsetLeft = left;
				_nodeData.style.offsetTop = top;
			},
			index : function(index){
				if(index){
					_nodeData.style.zIndex = index 
				}
				return _nodeData.style.zIndex;
			},
			parent : function(parent){
				if(parent){
					_nodeData.parent = parent;
				}
				return _nodeData.parent
			},
			remove : function(){

			},
			removeChild : function(child){

			},
			append : function(node){
				if(node.className !== "Mold.Lib.CanvasNode"){
					if(node.className){
						throw new Error("you try to append "+node.className+", but you can only append Mold.Lib.CanvasNode to a CanvasNode!");
					}else{
						throw new Error("you can only append Mold.Lib.CanvasNode to a CanvasNode!");
					}
				}
				node.parent(this);
				node.canvas(_nodeData.canvas);
				_nodeData.children.push(node);
				_setChildrenOffset();
				if(_nodeData.parent){
					_nodeData.parent.draw(true);
				}
				return this;
			},
			css : function(style, value){
				if(Mold.isObject(style)){
					Mold.each(style, function(value, name){
						_applyStyle(name, value);
					});
				}else if(Mold.is(value)){
					_applyStyle(style, value);
				}else{
				
					return _nodeData.style[style];
				}
				_draw();
				return this;
			},	
			text : function(text){
				_nodeData.text = text;
				_draw(true);
				return this;
			},
			position : function(){
				return {
					top : _nodeData.style.offsetTop + _nodeData.style.top,
					left : _nodeData.style.offsetLeft + _nodeData.style.left,
				}
				return this;
			},
			rotate : function(deg){
				_nodeContext.translate(_nodeData.style.width / 2, _nodeData.style.height / 2);
				_nodeContext.rotate(deg*Math.PI/180);
				_draw(true);
				_nodeContext.translate(_nodeData.style.width / 2 * -1, _nodeData.style.height / 2 * -1);
				return this;
			},

			dataset : {},
			animation : function(property, endValue, duration, ease, delay){

				if(Mold.isObject(property)){
					
					delay = ease;
					ease = duration;
					duration = endValue;

					Mold.each(property, function(value, prop){
						var startValue = _that.css(prop);
						_addAnimation(prop, startValue, value, duration, ease, delay);
					})
				}else{
				
					var startValue = _that.css(property);
					_addAnimation(property, startValue, endValue, duration, ease, delay);
				}
			
				if(_nodeData.canvas){
					
					_nodeData.canvas.animation.start();
				}

			},
			removeSequence : function(){

			},
			addSequence : function(name, sequence){
				_nodeData.sequence[name] = {
					counter : 0,
					sequence : sequence
				};
				var selected = _nodeData.sequence[name].sequence[ _nodeData.sequence[name].counter ];
				this.animation(
					selected.property, selected.duration, selected.ease, selected.delay
				);
				if(_nodeData.sequence[name].counter +1 === _nodeData.sequence[name].sequence.length){
					_nodeData.sequence[name].counter = 0;
				}else{
					_nodeData.sequence[name].counter++;
				}
			},
			animate : function(time){
				var isAnimation = false;
				_that.trigger("animation.process");
				
				if(_nodeData.animations.length){
					isAnimation = true;
				}
				/*check animations*/
				if(_animate (_nodeData.animations, time, function(property){
					_removeAnimation(property);
				})){
					isAnimation = true;
				}else{
					if(_nodeData.sequence){
						Mold.each(_nodeData.sequence, function(seq, name){
							var selected = seq.sequence[seq.counter];
							_that.animation(
								selected.property, selected.duration, selected.ease, selected.delay
							);

							if((seq.counter +1 ) === seq.sequence.length){
								seq.counter = 0;
							}else{
								seq.counter++;
							}
							isAnimation = true;
							_redraw = true;

						});
						
					}
				};


				Mold.each(_nodeData.children, function(child){
					var isChildAnimation = child.animate(time);
					if(isChildAnimation){
						isAnimation = true;
						_redraw = true;
					}
				});
				
				_counter++;
				if(_counter > 1000){
				//	_nodeData.canvas.animation.stop();
				}
				
				return isAnimation;
			}
		}
	}
)