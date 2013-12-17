Seed({
		name : "Mold.Lib.CSS",
		dna : "class",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(rules, data){

		var _openinBrackets = "{{";
		var _closingBrackets = "}}";
		var _cssContent = rules.toString().replace(/(^function\s*\(\)\s*\{\s*\/\*\|)([\s\S]*)(\|\*\/\s*\})/g, function(){
			return arguments[2];
		});

		var _styles = {};

		Mold.mixing(this, new Mold.Lib.Event(this));



		var _parseStyles = function(content){
			var block;
			while((block = /(([\s\S]*?)\{([\s\S]*?)\})/gm.exec(content))){
				
				content = content.replace(block[1], "");
				console.log("Block", Mold.trim(block[2]));
			
				var blockName = Mold.trim(block[2]);
				_styles[blockName] = {};
				
				var styleParts = block[3].split(";"),
					i = 0,
					len = styleParts.length;
				
				for(; i < len; i++){
					console.log("Style", styleParts[i]);
					
					var styleFragments = styleParts[i].split(":"),
						y = 0,
						fragmentLen = styleFragments.length;

					//for(; y < fragmentLen; y++){
						console.log(styleFragments)
						if(styleFragments[1]){
							_styles[blockName][Mold.trim(styleFragments[0])] = Mold.trim(styleFragments[1]);
						}
				}
			}
		}

		_parseStyles(_cssContent);
		console.log(_styles);

		


		var _getRule = function(styleSheetName, selector){
			var styleSheetList = document.styleSheets;
			if(this._cache[styleSheetName] && this._cache[styleSheetName][selector]){
				return  this._cache[styleSheetName][selector];
			}
			for(var i = 0; i < styleSheetList.length; i++){
				if(styleSheetList[i].href && styleSheetList[i].href.indexOf(styleSheetName) > -1){
					this._cache[styleSheetList[i]] = {}
					var rules = styleSheetList[i].cssRules || styleSheetList[i].rules;
					
					if(rules){
						//alert("rouls found")
						for(var y = 0; y < rules.length; y++){

							if(rules[y].selectorText === selector){
								this._cache[styleSheetList[i]][selector] = rules[y];
								return rules[y];
							}
						}
					}
				}
			}
			return false;
		}

		var _set = function(styleSheetName, selector, property, value){
			var rule = this.getRule(styleSheetName, selector);
			if(rule){
				if(typeof property === "object"){
					for(var prop in property){
						rule.style[prop] = property[prop];
					}
				}else{
					rule.style[property] = value;
				}
			}else{
				//alert("rule not found")
			}
		}

		this.publics = function(){

		}

	}
)