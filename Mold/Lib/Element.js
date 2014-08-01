Seed (	{ 		name : "Mold.Lib.Element",		dna : "class",		author : "Jan Kaufmann",		include : [			"Mold.Lib.Event",			"Mold.Lib.Promise",			"Mold.Lib.Info",			"Mold.Lib.Observer"		],		description : "",	},	function(tagname){		var _createElement = false;		if(tagname.instanceOf &&  tagname.instanceOf === "Mold.Lib.Element"){			return tagname;		}		if(typeof tagname === "object"){			var element = tagname;			var elementName = (tagname.nodeName) ? tagname.nodeName.toLowerCase() : false;		}else{			var element = document.createElement(tagname);			var elementName = tagname;			element.instanceOf = "Mold.Lib.Element";			_createElement = true;						}			/*check if element is customeelement*/		if(			elementName			&& Mold.Lib.Info.isSupported("registerElement") 			&& !Mold.Lib.Info.isValidHTML5Element(elementName)			&& !Mold.cue.get("customelements", elementName)		){			document.registerElement(elementName, { 				prototype : Object.create(HTMLElement.prototype)			});			Mold.cue.add("customelements", elementName, true);		}		var event = new Mold.Lib.Event(element);				if(!element.ident){			element.ident = Mold.getId();		}		Mold.mixin(element, event);		var _prefixes = ["Moz", "O", "Webkit", "ms"];				var _prefixesCSS = {			"Moz" : "-moz",			"0" : "-o",			"Webkit" : "-webkit", 			"ms" : "-ms"		};		var _convertToCamelCase = function(value){			return value.replace(/\-[a-z]/g, function(found){			  return found.substr(1,1).toUpperCase()			});		}		var _isPrefixProperty = function(property){			return !!{				'transform' : true,				'animation' : true,				'transformOrigin' : true,				'boxShadow' : true,				'transition' : true,				'transitionProperty' : true,				'transitionDelay': true,				'transitionDuration' : true,				'transformStyle' : true,				'perspective' : true,				'perspectiveOrigin' : true				}[property];		}		var _getPrefix = function(property){			var styles = window.getComputedStyle(document.documentElement, '')			var prefix = Mold.find(_prefixes, function(value){				var testProperty = value 					+ property.substring(0, 1).toUpperCase() 					+ property.substring(1);				if(styles[testProperty]){					return true;				}			}) 						return prefix || "";		}		var _prefixTransition = function(value){			var parts = value.split(' ');			var output = [];			Mold.each(parts, function(part){				if(_isPrefixProperty(part)){					output.push(_setCSSPrefix(part));				}else{					output.push(part);				}			});			return output.join(' ');		}		var _setPrefix = function(property){			var prefix = false;			if(				_isPrefixProperty(property) 				&& (prefix = _getPrefix(property))			){				property = prefix 							+ (property.substring(0, 1).toUpperCase() 							+ property.substring(1));			}			return property;		}		var _setCSSPrefix = function(property){			var prefix = false;			if(				_isPrefixProperty(property) 				&& (prefix = _getPrefix(property))			){				property = _prefixesCSS[prefix] + "-" +property;			}			return property;		}		var _setCssProperty = function(property, value){			if(property === "transition"){				value = _prefixTransition(value);			}			property = _convertToCamelCase(property);			if(_isPrefixProperty(property)){				Mold.each(_prefixes, function(prefix){					element.style[prefix +(property.substring(0, 1).toUpperCase() + property.substring(1))] = value;				});			}			element.style[property] = value;			if(property === 'height'){				element.trigger('height.changed', { height : value });				element.trigger('size.changed')			}			if(property === 'width'){				element.trigger('width.changed', { width : value });				element.trigger('size.changed')			}				}		var _getXML = function(content){			var doc = new DOMParser().parseFromString(content, 'text/html');			var result = new XMLSerializer().serializeToString(doc);			return result;		}		var _getComputetStyle = function(){			//document.defaultView.getComputedStyle(element, "").getPropertyValue(strCssRule);		}		element.clone = function(){			return new Mold.Lib.Element(element.cloneNode(true));		}		element.getImage = function(onready){			var height = element.sizes().height,				width = element.sizes().width,				markup = element.outer(false, true);				console.log(document.defaultView.getComputedStyle(element, ""));						var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">'               			+ '<foreignObject width="100%" height="100%">'           		   		+ markup           		   		+ '</foreignObject>'        				+ '</svg>';        	        	var domUrl = window.URL || window.webkitURL || window,				img = new Mold.Lib.Element("img"),				svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'}),				url = domUrl.createObjectURL(svg);			img.setAttribute("crossOrigin","Anonymous");			img.onload = function(){				onready.call(null, img, width, height);				domUrl.revokeObjectURL(url);			}			img.src = url;		}		element.addClass = function(className){			if(element.className.indexOf(className) == -1){				element.className += " "+className;			}			element.className = Mold.trim(element.className);			return element;					}				element.removeClass = function(className){			element.className = element.className.replace(" "+className, "");			element.className = element.className.replace(className, "");			return element;		};				element.hasClass = function(className){			if(element.className.indexOf(className) > -1){				return true;			}else{				return false;			}		};				element.addText = function(text){			element.innerHTML += text;			return element;		}				element.attr = function(attr, value){			if(Mold.is(value)){				new Mold.Lib.Event(document).trigger("attribute.modified", {					attr : attr,					value : value,					element : element				});				element.setAttribute(attr, value);				return element;			}else{				return element.getAttribute(attr);			}			return false;		}				element.replaceText = function(text){			element.innerHTML = text;			return element;		}		element.append = function(childElement, name){			element.appendChild(childElement);			if(name){				element[name] = childElement;			}			element.trigger("append", { child : childElement });			return element;		}		element.after = function(sibiling){			if(element.nextSibling){				element.parentNode.insertBefore(sibiling, element.nextSibling);			}else{				element.parentNode.appendChild(sibiling);			}		}		element.val = function(){			if(element.tagName === "INPUT"){				return element.value;			}else{				return element.innerHTML;			}					}		element.text = function(text){			if(Mold.is(text)){				element.textContent = text;			}			return element.textContent;		}		element.html = function(value, xml){			if(Mold.is(value) && value !== false){				element.innerHTML = value;			}else{				if(xml){					return _getXML(element.innerHTML);				}else{					return element.innerHTML;				}			}			return element;		}		element.outer = function(value, xml){			if(Mold.is(value) && value !== false){			}else{				if(xml){					return _getXML(element.outerHTML);				}else{					return element.outerHTML;				}			}			return element;		}		element.remove = function(){			element.parentNode.removeChild(element);		}		element.css = function(property, value){			if(Mold.isObject(property)){				Mold.each(property, function(value, prop){					_setCssProperty(prop, value);				});				return element;			}else if(property && value){				_setCssProperty(property, value);				return element;			}else{				var output = element.style[property];				if(!output){					output = window.getComputedStyle(element)[property]				}				return output;							}		}		element.addMethod = function(name, methode){			if(Mold.isObject(name)){				Mold.each(name, function(methode, methodName){					element[methodName] = methode;				})			}else{				element[name] = methode;			}			return element;		}		element.sizes = function(){						if(element === document){				var height = Math.max(					Math.max(						element.body.scrollHeight, 						element.documentElement.scrollHeight					),					Math.max(						element.body.offsetHeight,						element.documentElement.offsetHeight					), 					Math.max(						element.body.clientHeight,						element.documentElement.clientHeight					)				);				var width = Math.max(					Math.max(						element.body.scrollWidth, 						element.documentElement.scrollWidth					),					Math.max(						element.body.offsetWidth,						element.documentElement.offsetWidth					), 					Math.max(						element.body.clientWidth,						element.documentElement.clientWidth					)				);			}else if(element === window){				var width = (element.innerWidth) ? element.innerWidth : element.clientWidth; 				var height =(element.innerHeight) ? element.innerHeight : element.clientHeight;			}else{				var height = +window.getComputedStyle(element).height.replace("px", "")							+ +window.getComputedStyle(element).paddingTop.replace("px", "")							+ +window.getComputedStyle(element).paddingBottom.replace("px", "");				var width = +window.getComputedStyle(element).width.replace("px", "")							+  +window.getComputedStyle(element).paddingLeft.replace("px", "")							+  +window.getComputedStyle(element).paddingRight.replace("px", "");				if(height === 0 && width === 0){					document.getElementsByTagName('body')[0].appendChild(element);					var output = element.sizes();					document.getElementsByTagName('body')[0].removeChild(element);					return output;				}											}			return { height : +height, width : +width};			//element.currentStyle IE		}		element.position = function(){			var position = {				top : 0,				left: 0			};			var nextElement = element;			while (nextElement){				position.left += nextElement.offsetLeft;				position.top += nextElement.offsetTop;				nextElement = nextElement.offsetParent;			}			return position;		}		var _lastPropertyString = false;		element.animate = function(properties, duration, easing, delay){						var transistionPropertys = [];			duration = (Mold.is(duration)) ? duration + "s" : " 1s";			easing = easing || "ease-in-out";			delay = (Mold.is(delay)) ? delay + "s" : "";			var resolveAfterExecuting = true;			if(Mold.isObject(properties)){				Mold.each(properties, function(value, prop){					var oldValue = element.css(prop);					if(oldValue !== value){						resolveAfterExecuting = false;					}else{						console.log("prop", prop, oldValue, "=", value)					}					//console.log(prop, "OLDVALUE", element.css(prop), "SET VALUE", value);					transistionPropertys.push(					 	_setCSSPrefix(prop)						+ ((Mold.is(duration)) ? " " + duration : "")						+ ((easing) ? " "+easing : "")						+ ((Mold.is(delay)) ? " "+delay : "")					);									});			}else{				throw "animate() - first parameter must be an object!"			}			if(duration === 0){				resolveAfterExecuting = true;			}			var propertyString = transistionPropertys.join(',');			var startDate = new Date().getTime();			var promise = new Mold.Lib.Promise(function(resolve, reject){								var timeout = window.setTimeout(function(){					element.off('transitionend', resolveTransition)					reject("TIMEOUT");				}, 10000);				var resolveTransition = function(){					//! resolve transition					element.off('transitionend', resolveTransition);					element.css({						"transition-duration" : '0s'					});					window.clearTimeout(timeout);					resolve();				}											if(resolveAfterExecuting){					//! resolve transition directly after executing					resolveTransition.call(this);				}else{					element.on('transitionend', resolveTransition);				}			});			_lastPropertyString =  transistionPropertys;			element.css({				"transition-duration" : '1s'			})			element.css({				"animation" : "none",				"transition" : propertyString,			});			//! add transition to $propertyString $element			/*Woraround for FF*/			window.setTimeout(function(){				element.css(properties);			}, 10);						return promise;		}		Mold.Lib.Observer.pub("create.element", { element : element });		return element;	});