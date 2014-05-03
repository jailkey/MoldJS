Seed (	{ 		name : "Mold.Lib.Element",		dna : "class",		author : "Jan Kaufmann",		include : [			"Mold.Lib.Event",			"Mold.Lib.Promise",			"Mold.Lib.Info",			"Mold.Lib.Observer"		],		description : "",	},	function(tagname){		if(typeof tagname === "object"){			var element = tagname;			var elementName = (tagname.nodeName) ? tagname.nodeName.toLowerCase() : false;		}else{			var element = document.createElement(tagname);			var elementName = tagname;			Mold.Lib.Observer.pub("create.element", { element : element });		}		/*check if element is customeelement*/		if(			elementName			&& Mold.Lib.Info.isSupported("registerElement") 			&& !Mold.Lib.Info.isValidHTML5Element(elementName)			&& !Mold.cue.get("customelements", elementName)		){			document.registerElement(elementName, { 				prototype : Object.create(HTMLElement.prototype)			});			Mold.cue.add("customelements", elementName, true);		}		var event = new Mold.Lib.Event(element);				if(!element.ident){			element.ident = Mold.getId();		}		Mold.mixing(element, event);		var _prefixes = ["Moz", "O", "Webkit", "ms"];				var _prefixesCSS = {			"Moz" : "-moz",			"0" : "-o",			"Webkit" : "-webkit", 			"ms" : "-ms"		};		var _convertToCamelCase = function(value){			return value.replace(/\-[a-z]/g, function(found){			  return found.substr(1,1).toUpperCase()			});		}		var _isPrefixProperty = function(property){			return !!{				'transform' : true,				'transformOrigin' : true,				'boxShadow' : true,				'transition' : true,				'transitionProperty' : true,				'transitionDelay': true,				'transitionDuration' : true			}[property];		}		var _getPrefix = function(property){			var styles = window.getComputedStyle(document.documentElement, '')			var prefix = Mold.find(_prefixes, function(value){				var testProperty = value 					+ property.substring(0, 1).toUpperCase() 					+ property.substring(1);				if(styles[testProperty]){					return true;				}			}) 						return prefix || "";		}		var _setPrefix = function(property){			var prefix = false;			if(				_isPrefixProperty(property) 				&& (prefix = _getPrefix(property))			){				property = prefix 							+ (property.substring(0, 1).toUpperCase() 							+ property.substring(1));			}			return property;		}		var _setCSSPrefix = function(property){			var prefix = false;			if(				_isPrefixProperty(property) 				&& (prefix = _getPrefix(property))			){				property = _prefixesCSS[prefix] + "-" +property;			}			return property;		}		var _setCssProperty = function(property, value){			property = _convertToCamelCase(property);			if(_isPrefixProperty(property)){				Mold.each(_prefixes, function(prefix){					element.style[prefix +(property.substring(0, 1).toUpperCase() + property.substring(1))] = value;				});							}			element.style[property] = value;				}		element.addClass = function(className){			if(element.className.indexOf(className) == -1){				element.className += " "+className;			}			element.className = Mold.trim(element.className);			return element;					}				element.removeClass = function(className){			element.className = element.className.replace(" "+className, "");			element.className = element.className.replace(className, "");			return element;		};				element.hasClass = function(className){			if(element.className.indexOf(className) > -1){				return true;			}else{				return false;			}		};				element.addText = function(text){			element.innerHTML += text;			return element;		}				element.attr = function(attr, value){			if(Mold.is(value)){				new Mold.Lib.Event(document).trigger("attribute.modified", {					attr : attr,					value : value,					element : element				});				element.setAttribute(attr, value);				return element;			}else{				return element.getAttribute(attr);			}			return false;		}				element.replaceText = function(text){			element.innerHTML = text;			return element;		}		element.append = function(childElement, name){			element.appendChild(childElement);			if(name){				element[name] = childElement;			}			element.trigger("append", { child : childElement });		}		element.val = function(){			if(element.tagName === "INPUT"){				return element.value;			}else{				return element.innerHTML;			}					}		element.html = function(value){			if(value){				element.innerHTML = value;			}else{				return element.innerHTML;			}			return element;		}		element.remove = function(){			element.parentNode.removeChild(element);		}		element.css = function(property, value){			if(Mold.isObject(property)){				Mold.each(property, function(value, prop){					_setCssProperty(prop, value);				});				return element;			}else if(property && value){				_setCssProperty(property, value);				return element;			}else{				return element.style[property];			}		}		element.addMethod = function(name, methode){			element[name] = methode;		}		element.sizes = function(){						if(element === document){				var height = Math.max(					Math.max(						element.body.scrollHeight, 						element.documentElement.scrollHeight					),					Math.max(						element.body.offsetHeight,						element.documentElement.offsetHeight					), 					Math.max(						element.body.clientHeight,						element.documentElement.clientHeight					)				);				var width = Math.max(					Math.max(						element.body.scrollWidth, 						element.documentElement.scrollWidth					),					Math.max(						element.body.offsetWidth,						element.documentElement.offsetWidth					), 					Math.max(						element.body.clientWidth,						element.documentElement.clientWidth					)				);			}else if(element === window){				var width = (element.innerWidth) ? element.innerWidth : element.clientWidth; 				var height =(element.innerHeight) ? element.innerHeight : element.clientHeight;			}else{				var height = +window.getComputedStyle(element).height.replace("px", "")							+ +window.getComputedStyle(element).paddingTop.replace("px", "")							+ +window.getComputedStyle(element).paddingBottom.replace("px", "");				var width = +window.getComputedStyle(element).width.replace("px", "")							+  +window.getComputedStyle(element).paddingLeft.replace("px", "")							+  +window.getComputedStyle(element).paddingRight.replace("px", "");							}			return { height : +height, width : +width};			//element.currentStyle IE		}		var _lastPropertyString = false;		element.animate = function(properties, duration, easing, delay){						var transistionPropertys = [];						duration = (Mold.is(duration)) ? duration + "s" : " 1s";			easing = easing || "ease-in-out";			delay = (Mold.is(delay)) ? delay + "s" : "";			if(Mold.isObject(properties)){				Mold.each(properties, function(value, prop){					transistionPropertys.push(					 	_setCSSPrefix(prop)						+ ((Mold.is(duration)) ? " " + duration : "")						+ ((easing) ? " "+easing : "")						+ ((Mold.is(delay)) ? " "+delay : "")					);									});			}else{				throw "animate() - first parameter must be an object!"			}			var propertyString = transistionPropertys.join(',');			var promise = new Mold.Lib.Promise(function(resolve, reject){								var timeout = window.setTimeout(function(){					element.off('transitionend', resolveTransition)					reject("TIMEOUT");				}, 10000);				var resolveTransition = function(){					element.off('transitionend', resolveTransition);					element.css({						"transition-duration" : '0s'					});					window.clearTimeout(timeout);					console.log("resolve");					resolve();				}				element.on('transitionend', resolveTransition);				if(_lastPropertyString === propertyString){					//resolveTransition.call(this);				}			});			_lastPropertyString =  propertyString;			element.css({				"transition" : propertyString,			});			/*Woraround for FF*/			window.setTimeout(function(){				element.css(properties);			}, 10);						return promise;		}			return element;	});