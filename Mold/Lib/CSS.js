Seed({
		name : "Mold.Lib.CSS",
		dna : "class",
		platform : "browser",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.MultiLineString",
			"Mold.Lib.Template",
			"Mold.Lib.Color",
			{ Element : ".Element" },
			{ Promise : ".Promise" }
		],
		test : "Mold.Test.Lib.CSS"
	},
	function(rules, data){

		var _openinBrackets = "{{",
			_closingBrackets = "}}",
			_cssContent = false,
			_styles = {},
			_styleElement = new Mold.Lib.Element("style");

		new Element(document.body).append(_styleElement);

		var _sheet = _styleElement.sheet; 

		Mold.mixin(this, new Mold.Lib.Event(this));

		var _hasSubQuery = function(value){
			return /\{/g.test(value);
		}

		if(rules){
			var _template = new Mold.Lib.Template(rules, { parseAsString : true});
		}


		var _parseStyles = function(content){
			var block, styles = {};
			while((block = /(([\s\S]*?)\{([\s\S]*?)\})/gm.exec(content))){
				
				content = content.replace(block[1], "");
			
				var blockName = Mold.trim(Mold.trim(block[2]).replace(/\:$/g, ""));

				styles[blockName] = {};

				if(_hasSubQuery(block[3])){
					var subStyle = _parseStyles(block[3] + "}");
					styles[blockName] = subStyle;
				}else{
				
					var styleParts = block[3].split(";"),
						i = 0,
						len = styleParts.length;
					
					for(; i < len; i++){
						var styleFragments = styleParts[i].split(":"),
							y = 0,
							fragmentLen = styleFragments.length;
							
						if(styleFragments[1]){
							styles[blockName][Mold.trim(styleFragments[0])] = Mold.trim(styleFragments[1]);
						}
					}
				}
			}
			return styles;
		}

		var _handleRules = function(sheet, selector, mode){
			var rules = sheet.cssRules || sheet.rules;
			var singelQuoteSelector = selector.replace(/\"/g, "'");
			if(rules){
				for(var y = 0; y < rules.length; y++){
					
					if(rules[y].styleSheet){
						var subRuleResult;
						if((subRuleResult = _handleRules(rules[y].styleSheet, selector, mode))){
							return subRuleResult;
						}
					}else{
					
						var selectors = [];

						if(rules[y].selectorText){
							selectors = rules[y].selectorText.split(",");
						}else if(rules[y].conditionText){
							selectors = [ Mold.trim(rules[y].conditionText.replace(/\s/g, "")) ];
							selector = Mold.trim(selector.replace(/@media/g, "").replace(/\s/g, ""));
						}

						for(var z = 0; z < selectors.length; z++){
							var trimedSelector = Mold.trim(selectors[z]);
							if(
								trimedSelector == selector 
								|| trimedSelector === singelQuoteSelector
							){
								if(mode === "delete"){
									if(sheet.deleteRule){
										sheet.deleteRule(y);
									}else if(sheet.removeRule){
										sheet.removeRule(y);
									}else{
										throw new Error("no deleteRule method found!")
									}
									return true;
								}
								return rules[y];
							}
						}
					}
				}
			}
			return false;
		}

		var _handleSheets = function(selector, styleSheet, mode){
			var styleSheetList = document.styleSheets;
			for(var i = 0; i < styleSheetList.length; i++){
				if(
					!styleSheet 
					|| styleSheetList[i] === styleSheet 
					|| styleSheetList[i].href && styleSheetList[i].href.indexOf(styleSheet) > -1
				){
					var result = _handleRules(styleSheetList[i], selector, mode);
					if(result){
						return result;
					}
				}
			}
			return false;
		}
		

		var _deleteRule = function(selector, sheed){
			return _handleSheets(selector, sheed, "delete");
		}

		var _getRule = function(selector, sheed){
			return _handleSheets(selector, sheed, "get");
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
			}
		}


		var _apply = function(data){
			return new Promise(function(resolve, reject){
				_template.getString(data).then(function(content){
					var style = _parseStyles(content);
					var ruleCount = 0;

					Mold.each(style, function(value, rule){
						 _deleteRule(rule, _sheet);

						if(Mold.isObject(value)){
							var ruleString = rule + "{";
							Mold.each(value, function(propValue, prop){
								if(Mold.isObject(propValue)){
									ruleString += prop + "{";
									Mold.each(propValue, function(subPropValue, subProp){
										ruleString += subProp + ":" + subPropValue + ";";
									});
									ruleString += "}";
								}else{
									ruleString += prop + " : " + propValue + ";";
								}
							});
							 ruleString += "}";
						}else{
							throw new Error("something went wrong during style parsing!");
						}
						
						if(_sheet.insertRule){
							_sheet.insertRule(ruleString, ruleCount);
						}
				
						ruleCount++;
					})
					resolve();
				})
			});
		}



		this.publics = {
			getRule : _getRule,
			getTemplate : function(){
				return _template;
			},
			connect : function(data){
				_template.connect(data);
				//return _apply();
			},
			exec : function(){
				return _apply();
			},
			append : function(data){
				//_template.setData(data);
				return _apply(data);
			},
			remove : function(){
				_styleElement.remove();
			}
		}

	}
)