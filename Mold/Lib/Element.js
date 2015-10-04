/**
 * @module Mold.Lib.Element
 * @description extends a element node with extra methodes, or create an extended node from a string
 * @event element.created global event fires if the element is created
 * @event height.changed element event fires when the height  has changed
 * @event width.changed element event fires when the with has changed 
 * @event size.changed element event fires when the sizes has changed
 * @event attribute.modified document event fires if an element attribute will be modified
 * @event append element event fires if a child element will be appended
 */
Seed (
	{ 
		name : "Mold.Lib.Element",
		dna : "class",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Promise",
			"Mold.Lib.Info",
			"Mold.Lib.Observer",
			"Mold.Lib.Sanitize"
		],
		description : "",
	},
	function(tagname){

		var _createElement = false;
		if(tagname.instanceOf &&  tagname.instanceOf === "Mold.Lib.Element"){
			return tagname;
		}

		if(typeof tagname === "object"){
			var element = tagname;
			var elementName = (tagname.nodeName) ? tagname.nodeName.toLowerCase() : false;
		}else{
			var element = document.createElement(tagname);
			var elementName = tagname;
			_createElement = true;
				
		}

		element.instanceOf = "Mold.Lib.Element";

		/*check if element is customeelement*/
		if(
			elementName
			&& Mold.Lib.Info.isSupported("registerElement") 
			&& tagname !== document
			&& tagname !== window
			&& !Mold.Lib.Info.isValidHTML5Element(elementName)
			&& !Mold.cue.get("customelements", elementName)
		){
			document.registerElement(elementName, { 
				prototype : Object.create(HTMLElement.prototype)
			});
			Mold.cue.add("customelements", elementName, true);
		}


		var event = new Mold.Lib.Event(element);
		
		if(!element.ident){
			element.ident = Mold.getId();
		}

		Mold.mixin(element, event);

		var _prefixes = ["Moz", "O", "Webkit", "ms"];
		
		var _prefixesCSS = {
			"Moz" : "-moz",
			"0" : "-o",
			"Webkit" : "-webkit", 
			"ms" : "-ms"
		};

		var _convertToCamelCase = function(value){
			return value.replace(/\-[a-z]/g, function(found){
			  return found.substr(1,1).toUpperCase()
			});
		}

		var _isPrefixProperty = function(property){
			return !!{
				'transform' : true,
				'animation' : true,
				'transformOrigin' : true,
				'boxShadow' : true,
				'transition' : true,
				'transitionProperty' : true,
				'transitionDelay': true,
				'transitionDuration' : true,
				'transformStyle' : true,
				'perspective' : true,
				'perspectiveOrigin' : true,
				'keyframes' : true,
				'animationName' : true,
				'animationDuration' : true,
				'animationIterationCount' : true,
				'animationDirection' : true,
				'animationTimingFunction' : true,
				'animationFillMode' : true,
				'animationDelay' : true 
			}[property];
		}




		var _getPrefix = function(property){
			var styles = window.getComputedStyle(document.documentElement, '')
			var prefix = Mold.find(_prefixes, function(value){
				if(property === "keyframes"){
					//console.log(value + 'AnimationName', element.style[ value + 'AnimationName' ])
					if(Mold.is(element.style[ value + 'AnimationName' ])){
						return true;
					}
				}else{
					var testProperty = value 
						+ property.substring(0, 1).toUpperCase() 
						+ property.substring(1);

					if(styles[testProperty]){
						return true;
					}
				}
			})
			return prefix || "";
		}

		var _prefixTransition = function(value){
			var parts = value.split(' ');
			var output = [];
			Mold.each(parts, function(part){
				if(_isPrefixProperty(part)){
					output.push(_setCSSPrefix(part));
				}else{
					output.push(part);
				}
			});
			return output.join(' ');
		}



		var _setPrefix = function(property){
			var prefix = false;
			if(
				_isPrefixProperty(property) 
				&& (prefix = _getPrefix(property))
			){
				property = prefix 
							+ (property.substring(0, 1).toUpperCase() 
							+ property.substring(1));
			}
			return property;
		}

		var _setDefaultUnit = function(property, value){
			var _unitPropertys = [
				'height', 'width', 'top', 'left', 'right', 'bottom',
				'fontSize', 'borderWidth', 
				'padding', 'paddingRight', 'paddingLeft', 'paddingTop', 'paddingBottom',
				'margin', 'marginTop', 'marginRight', 'marginLeft', 'marginBottom'
			]

			if(Mold.contains(_unitPropertys, property)  && !/[a-zA-Z]$/g.test(value)){
				value = value + "px";
			}

			return value;
		}

		var _setCSSPrefix = function(property){
			var prefix = false;
			if(
				_isPrefixProperty(property) 
				&& (prefix = _getPrefix(property))
			){
				property = _prefixesCSS[prefix] + "-" +property;
			}
			return property;
		}


		var _setCssProperty = function(property, value){
			
			if(property === "transition"){
				value = _prefixTransition(value);
			}
			
			property = _convertToCamelCase(property);
			
			if(_isPrefixProperty(property)){
				Mold.each(_prefixes, function(prefix){
					element.style[prefix +(property.substring(0, 1).toUpperCase() + property.substring(1))] = value;
				});
			}

			value = _setDefaultUnit(property, value);
		
			element.style[property] = value;

			if(property === 'height'){
				element.trigger('height.changed', { height : value });
				element.trigger('size.changed')
			}
			if(property === 'width'){
				element.trigger('width.changed', { width : value });
				element.trigger('size.changed')
			}
		
		}

		var _getXML = function(content){
			var doc = new DOMParser().parseFromString(content, 'text/html');
			var result = new XMLSerializer().serializeToString(doc);
			return result;
		}
	
		/**
		 * @description handle after/before resize event
		*/
		var _resizeGap = 200,
			_resizeTimer = false,
			_startEventFired = false;

		element.on("resize", function(){
			if(!_startEventFired){
				element.trigger("beforeresize");
				_startEventFired = true;
			}
			if(_resizeTimer){
				clearTimeout(_resizeTimer);
			}
			_resizeTimer = setTimeout(function(){
				element.trigger("afterresize");
				_startEventFired = false;
			}, _resizeGap);
		})

	/**
	 * getTemplate
	 * @returns {object} returns template instance if availabel else return false
	 */
		element.getTemplate = function(){
			var parentElement = element,
				result = false;


			while(parentElement && !parentElement.moldTemplate){
				parentElement = parentElement.parentNode;
			}


			if(parentElement && parentElement.moldTemplate){
				result = parentElement.moldTemplate;
			}

			return result;
		}
	

	/**
	 * clones - clones an element node
	 * @return {node} returns the cloned node
	 */
		element.clone = function(){
			return new Mold.Lib.Element(element.cloneNode(true));
		}
	/**
	 * getImage - creates an svg image from the given element
	 * @param  {function} onready - a callback function fires if the image is created an loaded parameters are image, width, height
	 */
		element.getImage = function(onready){

			var height = element.sizes().height,
				width = element.sizes().width,
				markup = element.outer(false, true);

			
			var data = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">'
						+ '<foreignObject width="100%" height="100%">'
						+ markup
						+ '</foreignObject>'
						+ '</svg>';
			
			var domUrl = window.URL || window.webkitURL || window,
				img = new Mold.Lib.Element("img"),
				svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'}),
				url = domUrl.createObjectURL(svg);

			img.setAttribute("crossOrigin","Anonymous");


			img.onload = function(){
				onready.call(null, img, width, height);
				domUrl.revokeObjectURL(url);
			}

			img.src = url;
		}

	/**
	 * @methode addClass 
	 * @description adds a css class to an element 
	 * @param {string} className - name of the class
	 * @return {node} returns the element 
	 */
		element.addClass = function(className){
			if(element.className.indexOf(className) == -1){
				element.className += " "+className;
			}
			element.className = Mold.trim(element.className);
			return element;			
		}
	
	/**
	 * @methode removeClass 
	 * @description removes a css class from an element
	 * @param  {string} className - name of the class
	 * @return {node}  returns the element
	 */
		element.removeClass = function(className){
			element.className = element.className.replace(" "+className, "");
			element.className = element.className.replace(className, "");
			return element;
		};
		
	/**
	 * @method hasClass
	 * @description check if the element has a given css class
	 * @param  {string}  className - the classname
	 * @return {Boolean}  returns true if the element has the given class else it return false;
	 */
		element.hasClass = function(className){
			if(element.className.indexOf(className) > -1){
				return true;
			}else{
				return false;
			}
		};
		
	/**
	 * @method addText
	 * @deprecated [description]
	 */
		element.addText = function(text){
			element.textContent += text;
			return element;
		}
	
	/**
	 * @method attr
	 * @description get or set an attribute value of an element
	 * @param  {string} attr  - name of the attribute / if attr is an object, the method will be executed for each property
	 * @param  {string} value - if value is given the attribute will set if not the attribute value will returned
	 * @return {mixed}  if mehtod is in set mode the element will returned else the artribute value will returned
	 */
		element.attr = function(attr, value){

			if(Mold.isObject(attr)){
				for(var prop in attr){
					element.attr(prop, attr[prop])
				}
				return element;
			}

			if(Mold.is(value)){
				new Mold.Lib.Event(document).trigger("attribute.modified", {
					attr : attr,
					value : value,
					element : element
				});
				element.setAttribute(attr, value);
				return element;
			}else{
				return element.getAttribute(attr);
			}
			return false;
		}
	/**
	 * @method removeAttrValue description
	 * @description removes a value from an attribute
	 * @param  {string} attribute 
	 * @param  {string} value   
	 * @return {element}  returns the element  
	 */
		element.removeAttrValue = function(attribute, value){
			var attr = element.attr(attribute);
			if(attr){
				attr = Mold.trim(attr.replace(new RegExp(value, "g"), ""));
				element.attr(attribute, attr);
			}
			return element;
		}
	/**
	 * @method  addAttrValue
	 * @description adds a value to an attribute
	 * @param {string} attribute 
	 * @param {string} value
	 * @return {element} return the element
	 */
		element.addAttrValue = function(attribute, value){
			var attr = element.attr(attribute) || "";
			attr = Mold.trim(attr + " " + value);
			element.attr(attribute, attr);
			return element;
		}
	/**
	 * @method containsAttrValue
	 * @description checks if an attributes contains the specified value string
	 * @param  {string} attribute 
	 * @param  {string} value
	 * @return {boolean}
	 */
		element.containsAttrValue = function(attribute, value){
			var attr = element.attr(attribute) || "";
			return new RegExp(value, "g").test(attr);
		}

	/**
	 * @method hasAttrValue
	 * @description check if an attribute has the specified value checks full words
	 * @param  {object}  attribute 
	 * @param  {string}  value
	 * @return {Boolean}
	 */
		element.hasAttrValue = function(attribute, value){
			var attr = element.attr(attribute) || "";
			var parts = attr.split(" ");
			return Mold.contains(parts, value);
		}

		element.data = function(name, value){
			return element.attr("data-" + name, value);
		}

		
	/**
	 * @deprecated [description]
	 */
		element.replaceText = function(text){
			element.textContent = text;
			return element;
		}

		element.parent = function(selector){
			if(!selector){
				return new Mold.Lib.Element(element.parentNode);
			}

			var parentNode = element.parentNode;

			var getPrefixedName = function(){
				return 	(parentNode.matches) ? "matches" :
						(parentNode.msMatchesSelector) ? "msMatchesSelector" :
						(parentNode.mozMatchesSelector) ? "mozMatchesSelector" :
						(parentNode.webkitMatchesSelector) ? "webkitMatchesSelector" :
						(parentNode.oMatchesSelector) ?  "oMatchesSelector" : false;
			}

			while(parentNode){
				if(parentNode[getPrefixedName()] && parentNode[getPrefixedName()](selector)){
					return new Mold.Lib.Element(parentNode);
				}

				parentNode = parentNode.parentNode;
			}

			return false;
		}

		element.next = function(){
			var next = element.nextSibling;
			while(next){
				if(next.nodeType === 1){
					return new Mold.Lib.Element(previous);
				}
				next = next.nextSibling;
			}
			return false;
		}

		element.previous = function(){
			var previous = element.previousSibling;
			while(previous){
				if(previous.nodeType === 1){
					return new Mold.Lib.Element(previous);
				}
				previous = previous.previousSibling;
			}
			return false;
		}

	/**
	 * @method append
	 * @description appends an element as child element
	 * @param  {node} childElement - the element that has to be appened
	 * @param  {string} name - is name is given element gets a pointer to the child, so the child can be accessed per element.pointername
	 * @return {node} returns the element
	 */
		element.append = function(childElement, name){
			element.appendChild(childElement);
			if(name){
				element[name] = childElement;
			}
			element.trigger("append", { child : childElement });
			return element;
		}

	/**
	 * @method prepand
	 * @description prepand an element as child element
	 * @param  {node} childElement - the element that has to be appened
	 * @return {node} returns the element
	 */
		element.prepend = function(childElement){
			if(element.firstChild){
				element.insertBefore(childElement, element.firstChild);
			}else{
				element.appendChild(childElement);
			}
			element.trigger("append", { child : childElement });
			return element;
		}

	/**
	 * @method after
	 * @description inserts a node after the element
	 * @param  {node} sibiling - the node that has to be inserted
	 * @return {element}  returns the element
	 */
		element.after = function(sibiling){
			if(element.nextSibling){
				element.parentNode.insertBefore(sibiling, element.nextSibling);
			}else{
				element.parentNode.appendChild(sibiling);
			}
			return element;
		}

	/**
	 * @method before
	 * @description inserts a node before the element
	 * @param  {node} sibiling - the node that has to be inserted
	 * @return {element}  returns the element
	 */
		element.before = function(sibiling){
			element.parentNode.insertBefore(sibiling, element);
			return element;
		}

	/**
	 * @method  val
	 * @description get / set the value of an element
	 * @param  {string} value - if given the value will be set 
	 * @return {string} returns the element value 
	 */
		element.val = function(value){
			if(Mold.is(value)){
				switch(element.tagName.toLowerCase()){

					case "input":
						switch(element.attr("type")){

							case "radio":
								var selector = 'input[type=radio][name=' + element.attr("name") + ']'
								var radioButtons = document.querySelectorAll(selector);
								for(var y = 0; y < radioButtons.length; y++){
									if(radioButtons[y].value == value){
										radioButtons[y].checked = true;
									}else{
										radioButtons[y].checked = false;
									}
								}
								break;

							case "checkbox":
								if(element.value === value){
									element.checked = true;
								}else{
									element.checked = false;
								}
								break;

							default:
								element.value = value;
						}
						break;

					case "select":
						var options = element.querySelectorAll("option");
						for(var i = 0; i < options.length; i++){
							if(options[i].value === value || options[i].textContent === value){
								options[i].selected = true;
							}else{
								options[i].selected = false;
							}
						}
						break;

					case "textarea":
						element.textContent = value;
						break;

					default:
						console.log("set value", value)
						element.textContent = value;
						break;
				}
			}
			switch(element.tagName.toLowerCase()){

				case "input":
					switch(element.attr("type")){

						case "radio":
							var selector = 'input[type=radio][name=' + element.attr("name") + ']';
							var radioButtons = document.querySelectorAll(selector);
							for(var y = 0; y < radioButtons.length; y++){
								if(radioButtons[y].checked){
									return radioButtons[y].value;
								}
							}
							break;

						case "checkbox":
							if(element.checked){
								return element.value;
							}else{
								if(element.attr("false-value")){
									return element.attr("false-value");
								}
								return false;
							}
							break;

						default:
							return element.value; 
					}
					return element.value;

				case "select":
					var options = element.querySelectorAll("option");
					for(var i = 0; i < options.length; i++){
						if(options[i].selected){
							return (Mold.is(options[i].value)) ? options[i].value : options[i].textContent;
						}
					}
					break;

				default:
					return element.textContent;
			}
		}
		
	/**
	 * @method html 
	 * @description set / get the inner html value of the element
	 * @param  {string} value the html value that has to be set if not given the html will returned
	 * @param  {boolean} xml if true the return value is a valid xml
	 * @return {mixed}  if in get mode the inner html will be returned else the element
	 */
		element.html = function(value, xml, sanitize){
			if(sanitize){
				var sanitizer = new Mold.Lib.Sanitize();
				value = sanitizer.html(disableSanitize);
			}
			
			if(Mold.is(value) && value !== false){
				element.innerHTML = value;
			}else{
				if(xml){
					return _getXML(element.innerHTML);
				}else{
					return element.innerHTML;
				}
			}
			return element;
		}

	/**
	 * @method outer 
	 * @description set / get the outer html value of the element
	 * @param  {string} value the html value that has to be set if not given the html will returned
	 * @param  {boolean} xml if true the return value is a valid xml
	 * @return {mixed}  if in get mode the outer html will be returned else the element
	 */
		element.outer = function(value, xml){
			if(Mold.is(value) && value !== false){
				element.outerHTML = value;
			}else{
				if(xml){
					return _getXML(element.outerHTML);
				}else{
					return element.outerHTML;
				}
			}
			return element;
		}

	/**
	 * @method wrap 
	 * @description wrapps the current element into anoter
	 * @param  {element} wrapper the wrapping element
	 */
		element.wrap = function(wrapped){
			wrapped.wrapIn(element);
			return element;
		};

	/**
	 * @method wrap 
	 * @description wrapps the current element into anoter
	 * @param  {element} wrapper the wrapping element
	 */
		element.wrapIn = function(wrapper){
			var parentNode = element.parentNode;
			parentNode.insertBefore(wrapper, element);
			wrapper.appendChild(element);

			return element;
		};

	/**
	 * @method remove
	 * @description remove the element from dom
	 */
		element.remove = function(){
			element.parentNode.removeChild(element);
			return element;
		}

	/**
	 * @method scrolls
	 * @description get the scoll position of an element
	 * @return {object} returns an object with top and left property 
	 */
		element.scrolls = function(){
			var selected = (element === document) ? document.documentElement : element;
			return {
						top : (window.pageYOffset ||  selected.scrollTop)  - (selected.clientTop || 0),
						left : (window.pageXOffset || selected.scrollLeft) - (selected.clientLeft || 0)
					}
		}

	/**
	 * @method getSelector
	 * @description generates an unique css selector for the element
	 * @return {string} returns a string with the selector
	 */
		element.getSelector = function(){
			var output = [],
				siblings = [],
				lastNode = element,
				siblingCount = 0,
				substep = false;

			
			var previous = element;

			while(previous){
				if(previous.nodeType === 1 && previous.nodeName.toLowerCase() === element.nodeName.toLowerCase()){
					siblingCount++;
				}
				previous = previous.previousSibling;
			}

			output.push(element.nodeName.toLowerCase() + ":nth-of-type(" + siblingCount + ")");
			var parent = element.parentNode;

			var getChildNumber = function(selected){
				var number = 0;
				var previous = selected;

				while(previous){
					if(previous.nodeType === 1 && previous.nodeName.toLowerCase() === selected.nodeName.toLowerCase()){
						number++;
					}
					previous = previous.previousSibling;
				}
				return number;
			}

			while(parent){
				if(parent.nodeType === 1){
					var nodeName = parent.nodeName.toLowerCase();
					if(nodeName !== "html" && nodeName !== "body"){
						output.push(parent.nodeName.toLowerCase() + ":nth-of-type(" + getChildNumber(parent) + ")");
					}
				}

				parent = parent.parentNode;
			}
			output.push("body");
			output.push("html");
			output.reverse();
			return output.join(" ");
		}

	/**
	 * @method css
	 * @description  set / get the style of an element
	 * @param  {mixed} property - can be a string if only one property is effected, or if property has to be returned, if more then one property will be set it has to be an object.
	 * @param  {string} value  - if set and 'property' is not an object the value will be set
	 * @return {mixed} returns the property value in get mode otherwise it returns the element  
	 */
		element.css = function(property, value, pseudo){
			var pseudo = pseudo || false;

			if(value && Mold.startsWith(value, ":")){
				pseudo = value;
				value = false;
			}

			if(pseudo && Mold.isObject(property) || pseudo && value){
				var elementClass = new Mold.Lib.CSS(function(){/*|
					{{selector}}{{pseudo}} {
						{{propertys}}
					}
				|*/});
			}

			if(Mold.isObject(property)){
				var propString = ";"
				Mold.each(property, function(value, prop){
					if(pseudo){
						propString += prop + ":" + value + ";\n";
					}else{
						_setCssProperty(prop, value);
					}
				});
				if(pseudo){
					elementClass.append({
						selector : element.getSelector(),
						propertys : propString,
						pseudo : pseudo
					});

				}
				return element;
			}else if(property && value){
				if(pseudo && value){
					

					elementClass.append({
						selector : element.getSelector(),
						propertys : property + ":" + value + ";\n",
						pseudo : pseudo
					})
					
				}else{
					_setCssProperty(property, value);
				}
				return element;
			}else{
				var output = element.style[property];
				if(!output || pseudo){
					output = window.getComputedStyle(element, pseudo)[property]
				}
				return output;
				
			}
		}

		element.copyStyle = function(fromElement, whitelist, blacklist){
			var elementStyle = window.getComputedStyle(fromElement);
			Mold.each(elementStyle, function(value, property){
				if(whitelist){
					if(elementStyle[value] && Mold.contains(whitelist, value)){
						element.style[value] = elementStyle[value];
					}
				}else{
					if(elementStyle[value] && !Mold.contains(blacklist, value)){
						element.style[value] = elementStyle[value];
					}
				}
			})
		}

		element.getStyleString = function(blacklist){
			var elementStyle = window.getComputedStyle(element);
			var output = "";
			Mold.each(elementStyle, function(value, property){
				if(elementStyle[value] && !Mold.contains(blacklist, value)){
					output += value + ": " + elementStyle[value] + ";\n";
				}
			})
			return output;
		}

	/**
	 * @mehtod addMethod
	 * @description add a method to the element
	 * @param {string} name  - the name of the method
	 * @param {function} methode  - the method code
	 * @return {node} returns the element
	 */
		element.addMethod = function(name, methode){
			if(Mold.isObject(name)){
				Mold.each(name, function(methode, methodName){
					element[methodName] = methode;
				})
			}else{
				element[name] = methode;
			}
			return element;
		}

	/**
	 * @method sizes
	 * @description returns in object with the sizes of the element
	 * @return {object} returns an obejct with the properies height and with
	 */
		element.sizes = function(){
			var height, width;

			if(element === document){
				height = Math.max(
					Math.max(
						element.body.scrollHeight, 
						element.documentElement.scrollHeight
					),
					Math.max(
						element.body.offsetHeight,
						element.documentElement.offsetHeight
					), 
					Math.max(
						element.body.clientHeight,
						element.documentElement.clientHeight
					)
				);
				width = Math.max(
					Math.max(
						element.body.scrollWidth, 
						element.documentElement.scrollWidth
					),
					Math.max(
						element.body.offsetWidth,
						element.documentElement.offsetWidth
					), 
					Math.max(
						element.body.clientWidth,
						element.documentElement.clientWidth
					)
				);
			}else if(element === window){
				width = (element.innerWidth) ? element.innerWidth : element.clientWidth;
				height =(element.innerHeight) ? element.innerHeight : element.clientHeight;
			}else{
				var computed = window.getComputedStyle(element);

				if(computed.height === "auto" ){
					height = element.offsetHeight;
				}else{
					height = +computed.height.replace("px", "")
							+ +computed.paddingTop.replace("px", "")
							+ +computed.paddingBottom.replace("px", "");
				}

				if(computed.width){
					width = element.offsetWidth;
				}else{
					width = +computed.width.replace("px", "")
							+  +computed.paddingLeft.replace("px", "")
							+  +computed.paddingRight.replace("px", "");
				}

				if(computed["box-sizing"] === "border-box"){
					if(element.currentStyle){
						//IE fix
						height += +element.css("marginTop").replace("px", "") + +element.css("marginBottom").replace("px", "");
						width += +element.css("marginLeft").replace("px", "") + +element.css("marginRight").replace("px", "");
					}
				}
			}
			return { height : +height, width : +width};
	
		}

	/**
	 * @method position
	 * @description gets the position of an element
	 * @return {object} returns an object with a top and left property
	 */
		element.position = function(isRelative){
			var position = {
				top : 0,
				left: 0
			};

			var nextElement = element;

			while (nextElement){

				var positionStyle = window.getComputedStyle(nextElement)['position'];
				if(isRelative && (positionStyle === "relative" || positionStyle === "absolute")){
					break;
				}
				position.left += nextElement.offsetLeft;
				position.top += nextElement.offsetTop;
			
				nextElement = nextElement.offsetParent;
				
			}

			return position;
		}

		
		
	/**
	 * @method animate
	 * @description animates an element
	 * @param  {object} properties - an object with properties and the target value
	 * @param  {number} duration   - the animation duration in seconds default is on second
	 * @param  {string} easing     - the animation easing default is ease-in-out
	 * @param  {number} delay      - the delay of the animation default is nothing
	 * @param  {number/string} iteration  - number of iterations not available on transitions
	 * @param  {string} fillmode   - the fillemode not available on transitions
	 * @return {promise}           - returns a promise
	 */
		var _lastPropertyString = false;
		element.animate = function(properties, duration, easing, delay, iteration, fillmode, direction){


			if(Mold.isArray(properties)){
				//! if properties are an array use css animations for animation
				var animationId = "mold-animation-" + Mold.getId();

				var createKeyFrames =  function(){
					var container = new Mold.Lib.Element('style'),
						keyframes = [],
						parts = [];

					var convertSteps = function(prop){
						if(!duration){

						}else{
							return prop.step;
						}
					}
					
					Mold.each(properties, function(prop){
						
						var keyframe = convertSteps(prop) +" {\n";
						Mold.each(prop.style, function(value, name){
							keyframe += _setCSSPrefix(name) + ":" + value + ";\n";
						});
						keyframe +=  "}\n";

						keyframes.push(keyframe);
					});
					var content =  "@"+_setCSSPrefix("keyframes") + " " + animationId + " {\n" + keyframes.join("\n")  + "\n}";
					container.textContent = content;
					document.head.appendChild(container);
				}

				createKeyFrames();

				var promise = new Mold.Lib.Promise(function(resolve, reject){
					var resolveAnimation = function(e){
						element.off("animationend", resolveAnimation);
						resolve();
					}
					element.on("animationend", resolveAnimation);
				})

			
				element.css({
					"animation-name" : animationId,
					"animation-duration" : duration || "1s",
					"animation-iteration-count" : iteration || 1,
					"animation-direction" : direction || "normal",
					"animation-timing-function" : easing || "ease-in-out",
					"animation-fill-mode" : fillmode || "forwards",
					"animation-delay" : delay || "0s"
				});

				return promise;

			}else{
				//! use transition for single animation

				var transistionPropertys = [],
					resolveAfterExecuting = true,
					propertiesToAnimate = [];

				duration = (Mold.is(duration)) ? duration + "s" : " 1s";
				easing = easing || "ease-in-out";
				delay = (Mold.is(delay)) ? delay + "s" : "";


				if(Mold.isObject(properties)){
					Mold.each(properties, function(value, prop){
						var oldValue = element.css(prop);
						if(oldValue !== value){
							resolveAfterExecuting = false;
						}else{
							
						}
						propertiesToAnimate.push(prop);
						transistionPropertys.push(
							_setCSSPrefix(prop)
							+ ((Mold.is(duration)) ? " " + duration : "")
							+ ((easing) ? " "+easing : "")
							+ ((Mold.is(delay)) ? " "+delay : "")
						);
						
					});
				}else{
					throw "animate() - first parameter must be an object!"
				}

				if(duration === 0){
					resolveAfterExecuting = true;
				}

				var allResolved = function(property){
					var rest = propertiesToAnimate.splice( propertiesToAnimate.indexOf(property), 1);
					return !propertiesToAnimate.length;
				}


				var propertyString = transistionPropertys.join(','),
					startDate = new Date().getTime();
			

				var promise = new Mold.Lib.Promise(function(resolve, reject){
					
					var timeout = window.setTimeout(function(){
						element.off('transitionend', resolveTransition)
						reject("TIMEOUT");
					}, 10000);

					var resolveTransition = function(e){
						//! resolve transition
						if(e && allResolved(e.propertyName)){
							element.off('transitionend', resolveTransition);
							element.css({
								"transition-duration" : '0s'
							});
							window.clearTimeout(timeout);
							resolve();
						}
					}
					
					if(resolveAfterExecuting){
						//! resolve transition directly after executing
						resolveTransition.call(this);
					}else{
						element.on('transitionend', resolveTransition);
					}

				});

				_lastPropertyString =  transistionPropertys;
			
				//! add transition to $propertyString $element
				
				element.css({
					"transition-duration" : '1s'
				});

				element.css({
					"animation" : "none",
					"transition" : propertyString,
				});

				/*Woraround for FF*/
				window.setTimeout(function(){
					element.css(properties);
				}, 10);

				
				return promise;
			}
		}
		if(_createElement){
			Mold.Lib.Observer.pub("element.created", { element : element });
		}
		return element;
	}
);