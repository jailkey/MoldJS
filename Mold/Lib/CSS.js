Seed({
		name : "Mold.Lib.CSS",
		dna : "class",
		platform : "browser",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.MultiLineString",
			"Mold.Lib.Template",
			"Mold.Lib.Color",
			{ Element : ".Element" }
		],
		test : "Mold.Test.Lib.CSS"
	},
	function(rules, data){

		var _openinBrackets = "{{",
			_closingBrackets = "}}",
			_cssContent = Mold.Lib.MultiLineString(rules),
			_styles = {},
			_styleElement = new Mold.Lib.Element("style");

		new Element(document.body).append(_styleElement);

		var _sheet = _styleElement.sheet; 

		Mold.mixin(this, new Mold.Lib.Event(this));

		var _hasSubQuery = function(value){
			return /\{/g.test(value);
		}

		var _template = new Mold.Lib.Template(_cssContent, { parseAsString : true});

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
			if(rules){
				for(var y = 0; y < rules.length; y++){
					if(
						(
							rules[y].conditionText 
							&& Mold.trim(rules[y].conditionText.replace(/\s/g, "")) ==  Mold.trim(selector.replace(/@media/g, "").replace(/\s/g, ""))
						)
						|| (rules[y].selectorText === selector)
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


		var _apply = function(){
			var style = _parseStyles(_template.get());
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
					throw new Error("something went wrong until style parsing!");
				}
				_sheet.insertRule(ruleString, ruleCount);
				ruleCount++;
			})
			//
		}



		this.publics = {
			getRule : _getRule,
			bind : function(data){
				_template.bind(data);
				_apply();
			},
			exec : function(){
				_apply();
			},
			append : function(data){
				_template.append(data);
				_apply();
			},
			remove : function(){
				_styleElement.remove();
			}
		}

	}
)