Seed (	{ 		name : "Mold.Lib.Element",		dna : "class",		author : "Jan Kaufmann",		include : [			"Mold.Lib.Event"		],		description : "",	},	function(tagname){		if(typeof tagname === "object"){			var element = tagname;		}else{			var element = document.createElement(tagname);		}		var event = new Mold.Lib.Event(element);				element.ident = Mold.getId();				Mold.mixing(element, event);		element.addClass = function(className){			if(this.className.indexOf(className) == -1){				this.className += " "+className;			}			return this;					}				element.removeClass = function(className){			this.className = this.className.replace(" "+className, "");			this.className = this.className.replace(className, "");			return this;		};				element.hasClass = function(className){			if(this.className.indexOf(className) > -1){				return true;			}else{				return false;			}		};				element.addText = function(text){			element.innerHTML += text;			return this.element;		}				element.attr = function(attr){			for(attribute in attr){				element.setAttribute(attribute, attr[attribute]);			}			return element;		}				element.replaceText = function(text){			element.innerHTML = text;			return element;		}		element.append = function(childElement, name){			element.appendChild(childElement);			if(name){				element[name] = childElement;			}			element.trigger("append", { child : childElement });		}		element.val = function(){			if(element.tagName === "INPUT"){				return element.value;			}else{				return element.innerHTML;			}					}			return element;	});