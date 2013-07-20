Seed (
	{ 
		name : "Mold.DNA.jQuerySandbox",
		dna : "dna",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	{
		name : "jquery",
		init : function(seed){
			//Load jquery
			//Speicher der jQuery Objekte in lokalen Variablen
			Mold.DNA.jQuerySandbox.savejQueryObjects("jQuery", jQuery);
			Mold.DNA.jQuerySandbox.savejQueryObjects("$", $);
			//Löschen der jQuery Objekte aus dem globalen Namespace
			window["$"] = null;
			window["jQuery"] = null;
			delete window.$;
			delete window.jQuery;
		},
		create : function(seed){			
			var target = Mold.createChain(Mold.getSeedChainName(seed));
			var pattern = new RegExp("(function\\s*\([\\s\\S]*?\)\\s*\{)([\\s\\S]*?)\}$", "g");			
			var injectedCode = "var $ = Mold.DNA.jQuerySandbox.getjQueryObjects('$');\n"
								+ "var jQuery = Mold.DNA.jQuerySandbox.getjQueryObjects('jQuery');\n";
			var newFunction = Mold.injectBefore(seed.func, injectedCode);
			target[Mold.getTargetName(seed)] = newFunction;
			return newFunction;
		},
		methodes : function(){
			var _ = [];
			return {
				savejQueryObjects : function (name, value){
					_[name] = value;
				},
				getjQueryObjects : function(name){
					return _[name];
				},
				setjQueryPlugin : function(name, code){
					for(jQueryObject in _){
						console.log(jQueryObject);
						_[jQueryObject].fn[name] = code;
					}
				}
			}
		}
	}
);