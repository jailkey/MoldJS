Seed({
		name : "Mold.Lib.Info",
		dna : "static"
	},
	function(){

		var _features = {};

		var _detectFeatures = function(){
			var checker = false;
			if(!Mold.isNodeJS){
				_features = {
					"history" : !!(window.history && history.pushState),
					"geolocation" : 'geolocation' in navigator,
					"indexedDB" : !!window.indexedDB,
					"postMessage" : !!window.postMessage,
					"websql" : !!window.openDatabase,
					"webGL" : !!window.WebGLRenderingContext,
					"webworkers" : !!window.Worker,
					"applicationCache" : !!window.applicationCache,
					"canvas" : !!((checker = document.createElement('canvas')) 
									&& checker.getContext 
									&& checker.getContext('2d')
								),
					"defineProperty" : !!Object.defineProperty,
					"querySelector" : !!document.querySelectorAll,
					"querySelectorAll" : !!document.querySelectorAll,
					"sessionStorage" : !!window.sessionStorage,
					"localStorage" : !!window.localStorage,
					"proxy" : !!window.Proxy,
					"mutationObserver" : !!window.MutationObserver,
					"registerElement" : !!document.registerElement,
					"blob" : !!window.Blob,
					"url" : !!window.URL,
					"supports" : !!((window.CSS && window.CSS.supports) || window.supportsCSS || false),
					"orientation" : !!window.DeviceOrientationEvent,
					"speechSynthesis" : window.speechSynthesis,
					"touch" : !!('ontouchstart' in window)

				}
			}else{
				_features = {}
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