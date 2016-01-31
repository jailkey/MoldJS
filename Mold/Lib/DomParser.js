Seed({
		name : "Mold.Lib.DomParser",
		type : "static"
	},
	function(){

		var _isSingleTag = function(name){
			var singleTages = [ "br", "hr", "meta", "link", "input"];
			if(Mold.contains(singleTages, name)){
				return true;
			}else{
				return false;
			}
		}


		var _parse = function(markup){

			var _root = new Mold.Lib.DomNode(9),
				that = this;


			var _createElement = function(name){
				return new Mold.Lib.DomNode(1, name);
			}

			var _createAttribute = function(name){
				return new Mold.Lib.DomNode(2, name);
			}

			var _createTextNode = function(text){
				var textNode = new Mold.Lib.DomNode(3);
				textNode.nodeValue = text;
				return textNode;
			}

			var _createDocumentFragment = function(){
				return new Mold.Lib.DomNode(11);
			}

			var _stateMemory = {
				attributeName : "",
				attributeValue : "",
				elementName : "",
				textValue : "",
				element : _root,
			}

			var _resetMemoryProperties = function(){
				_stateMemory.attributeName = "";
				_stateMemory.attributeValue = "";
				_stateMemory.textValue = "";
			}

			var _states = {
				opentag : function(){
					//_resetMemoryProperties();
				},
				writetag : function(actChar){
					_stateMemory.elementName += actChar;
				},
				closetag : function(){
					//_resetMemoryProperties();
				},
				closeelement : function(){

				},
				openttext : function(){

				},
				writecharset : function(actChar){
					_stateMemory.textValue += actChar;
				},
				openattribute : function(actChar){
					_stateMemory.attributeName = "";
					_stateMemory.attributeName += actChar;
				},
				writeattribute : function(actChar){
					_stateMemory.attributeName += actChar;
				},
				writeattributevalue : function(actChar){
					_stateMemory.attributeValue += actChar;
				},
				closeattributevalue : function(){
					//_resetMemoryProperties();
				}
			}

			var _stateEvents = {
				
				onAddElement : function(){
					var newElement = _createElement(_stateMemory.elementName);
					_stateMemory.element.appendChild(newElement);
					_stateMemory.element = newElement;
					_resetMemoryProperties()
				},
				onElementEnd : function(){
					if(_isSingleTag(_stateMemory.elementName)){
						_stateMemory.element = _stateMemory.element.parentNode;
					}
					_stateMemory.elementName = "";
				},
				onAddAttribute : function(){
					var attributeNode = _createAttribute(_stateMemory.attributeName.substring(0, _stateMemory.attributeName.length - 1));
					attributeNode.nodeValue = _stateMemory.attributeValue;
					_stateMemory.element.setAttributeNode(attributeNode);

					_resetMemoryProperties()
				},
				onAddText : function(){
					var textNode = _createTextNode(_stateMemory.textValue);
					_stateMemory.element.appendChild(textNode);
					_resetMemoryProperties()
				},
				onCloseElement : function(){
					_stateMemory.element = _stateMemory.element.parentNode;
				}
			}



			var _domParser = function(markup){

				if(!markup){
					return _root;
				}
				
				var markupPart = markup,
					actChar = markupPart.charAt(0),
					nextChar = markupPart.charAt(1),
					lastChar = false,
					twoBefore = false,
					state = "writecharset",
					lastState = false,
					lastElement = _root,
					stateEvent = false,
					phrase = markup.substring(0, markup.indexOf(" "));

				markupPart = markup.substring(1, markup.length);

				while(actChar){
					stateEvent = false;
				/*Set States*/
					if(actChar === "<"){
						
						if(nextChar === "/"){
							state = "closelement";
						}else{
							state = "opentag";
						}

					}else if(actChar === ">"){

						if(lastChar === "/"){
							state = "closetag"
						}else{
							state = "closetag";
						}

					}else if(state === "opentag"){

						if(/[\s]/.test(actChar)){
							state = "searchattributes";
						}else{
							state = "writetag";
						}

					}else if(state === "writetag"){

						if(/[\s]/.test(actChar)){
							state = "searchattributes";
						}

					}else if(state === "closetag"){
						
						state = "writecharset";

					}else if(state === "searchattributes"){
						
						if(/[\w]/.test(actChar)){
							state = "openattribute";
						}

					}else if(state === "openattribute"){
						
						if(actChar === "\""){
							state = "openattributevalue";
						}else{
							state = "writeattribute";
						}
					}else if(state === "writeattribute"){
						
						if(actChar === "\""){
							state = "openattributevalue";
						}
					}else if(state === "openattributevalue"){

						if(actChar === "\""){
							state = "closeattributevalue"
						}else{
							state = "writeattributevalue"
						}
					}else if(state === "closelement"){
						state = "writecloselement"
					}else if(state === "writeattributevalue"){
						if(actChar === "\""){
							state = "searchattributes"
						}
					}else if(state === "writecharset"){
						if(actChar === "{" && nextChar === "{"){
							_stateEvents.onAddText();
						}
						if(twoBefore === "}" && lastChar === "}"){
							_stateEvents.onAddText();
						}
					}



					if(_states[state]){
						_states[state](actChar);
					}

					/*execute events*/
					if(lastState !== state || markupPart.length === 0){
						if(lastState === "writetag"){
							_stateEvents.onAddElement();
						}
						if(lastState === "writeattributevalue"){
							_stateEvents.onAddAttribute();
						}
						if(lastState === "writecharset"){
							_stateEvents.onAddText();
						}
					}

					if(state === "closelement"){
						_stateEvents.onCloseElement();
					}

					if(state === "closetag"){
						_stateEvents.onElementEnd();
					}
					

					lastState = state;
					twoBefore = lastChar;
					lastChar = actChar;
					actChar = markupPart.charAt(0);
					nextChar = markupPart.charAt(1);
					markupPart = markupPart.substring(1, markupPart.length);
					phrase = markupPart.substring(0, markupPart.indexOf(" "));
				}

				
				return _root;
			}

			return _domParser(markup);
		}

		return {
			parse : function(markup){
				var parsed = _parse(markup);
				return parsed;
			}
		}
		
	}
)