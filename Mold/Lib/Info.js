Seed({
		name : "Mold.Lib.Info",
		dna : "static"
	},
	function(){

		var _features = {};
		var helperInputElement = false;
		var undefined;
			
		if(!Mold.isNodeJS){
			helperInputElement = document.createElement("input");
		}

		var _detectInputType = function(type){
			if(helperInputElement){
				helperInputElement.setAttribute("type", type);
				if(helperInputElement.type === "text"){
					return false;
				}
				var testValue = "soma??estring-p0ijs9";
				helperInputElement.value = testValue;
				return !(helperInputElement.value === testValue);
			}
			return false;
		}

		var _detectFeatures = function(){
			var checker = false;
			var window = window || false;
			var document = document || false;
			var navigator = navigator || false;

		
			_features = {
				"history" : !!(window && window.history && history.pushState),
				"geolocation" : navigator && 'geolocation' in navigator,
				"indexedDB" : !!(window && window.indexedDB),
				"postMessage" : !!(window && window.postMessage),
				"websql" : !!(window && window.openDatabase),
				"webGL" : !!(window && window.WebGLRenderingContext),
				"webworkers" : !!(window && window.Worker),
				"applicationCache" : !!(window && window.applicationCache),
				"canvas" : !!(document && (checker = document.createElement('canvas')) 
								&& checker.getContext 
								&& checker.getContext('2d')
							),
				"defineProperty" : !!Object.defineProperty,
				"querySelector" : !!(document && document.querySelector),
				"querySelectorAll" : !!(document && document.querySelectorAll),
				"sessionStorage" : !!(window && window.sessionStorage),
				"localStorage" : (function(){
					var output = !!(window && window.localStorage) || (typeof localStorage !== "undefined") ? true : false ;
					return output;
				})(),
				"proxy" : !!(window && window.Proxy),
				"mutationObserver" : !!((window && window.MutationObserver) || (typeof MutationObserver !== "undefined")),
				"registerElement" : !!document.registerElement,
				"blob" : !!((window && window.Blob) || (typeof Blob !== "undefined")),
				"url" : !!((window && window.URL) || (typeof URL !== "undefined")),
				"supports" : !!((window && window.CSS && window.CSS.supports) || window.supportsCSS || false),
				"orientation" : !!((window && window.DeviceOrientationEvent) || (typeof DeviceOrientationEvent !== "undefined")),
				"speechSynthesis" : !!(window && window.speechSynthesis),
				"touch" : !!(window && ('ontouchstart' in window)),
				"range" : !!(window && window.Range),
				"arrayObserve" : !!Array.observe,
				"objectObserve" : !!Object.observe,
				"generator" : function(){
					try {
						eval("(function*(){})()");
						return true;
					} catch(e){
						return false;
					}
				}(),
				"yield" : function(){
					try {
						eval("(function(){ yield test; })()");
						return true;
					} catch(e){

						return false;
					}
				}(),
				"input-date" : _detectInputType("date"),
				"input-date" : _detectInputType("date"),
				"input-datetime" : _detectInputType("datetime"),
				"input-datetime-local" : _detectInputType("datetime-local"),
				"input-month" : _detectInputType("month"),
				"input-week" : _detectInputType("week"),
				"input-time" : _detectInputType("time"),
				"input-color" : _detectInputType("color"),
				"input-number" : _detectInputType("number"),
				"input-range" : _detectInputType("range"),
				"input-email" : _detectInputType("email"),
				"input-search" : _detectInputType("search"),
				"input-url" : _detectInputType("url"),
				"input-tel" : _detectInputType("tel")
			}
		
		}
/*init featuredetection*/
		_detectFeatures();

		return {
/**
* @methode isSupported
* @desc Test if the Browser has native suppport for the given property/methode
* @param (String) name - Expects the method-/propertyname
* @return (Boolen) - if test is successfull it returns true, else if it returns false
**/
			isSupported : function(name){
				if(typeof _features[name] !== "undefined"){
					return _features[name];
				}else{
					throw "There is no feature detection for '"+name+"'' implemented!";
				}
			},
/**
* @methode addFeatureTest
* @desc Test if the Browser has native suppport for the given feature
* @param (String) name - Expects the method-/propertyname
* @return (Boolen) - if test is successfull it returns true, else it returns false
**/
			addFeatureTest : function(name, test){
				_features[name] = test();
			},

/**
* @methode isValidHTML5Element
* @desc Test an element is an valid HTML5 element
* @param (String) name - Expects the element name
* @return (Boolen) - if test is successfull it returns true, else it returns false
**/
			isValidHTML5Element : function(name){
				return Mold.contains([
					"html", "head", "title", "base", "link", "meta", "style",
					"script", "noscript", "template",
					"body", "section", "nav", "article", "aside", "h1", "h2", "h3", "h4", "h5", "h6",
					"header", "footer", "address", "main",
					"p", "hr", "pre", "blockquote", "ol", "ul", "li", "dl", "dt", "dd", "figure", "figcaption", "div",
					"a", "em", "strong", "small", "a", "s", "cite", "q", "dfn", "abbr", "data", "time", "code", "var",
					"samp", "kbd", "sub", "sup", "i", "b", "u", "mark", "ruby", "rt", "rp", "bdi", "bdo", "span",
					"br", "wbr", "ins", "del", "img", "iframe", "embed", "object", "param", "video", "audio",
					"source", "track", "canvas", "map", "area", "svg", "math",
					"table", "caption", "colgroup", "col", "tbody", "thead", "tfoot", "tr", "td", "th",
					"form", "fieldset", "label", "input", "button", "select", "datalist", "optgroup", "option",
					"textarea", "keygen", "output", "progress", "meter", "details", "summary", "menuitem"
				], name.toLowerCase());
			},

			isSupportedPropery : function(name){
				if(this.isSupported("supports")){
					var supports = window.CSS.supports || window.supportsCSS;
					return supports(name);
				}
			},

			isHexValue : function(hex){
				var regExp = new RegExp('^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$', 'i');
				return regExp.test(hex);
			}

		}
	}
)