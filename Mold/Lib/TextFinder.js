Seed({
		name : "Mold.Lib.TextFinder",
		dna : "class",
		include : [
			"->Mold.Lib.Element"
		]
	},
	function(element){


		var MapNode = function(id, text, element, position){
			this.id = id;
			this.text = text;
			this.element = element;
			this.position = position;
		}



		var TextMap = function(startElement){
			this.textNodes = [];
			this.startElement = startElement;
			this.selectedElement = startElement;
			this.id = 0;
			this.index(startElement);
		}

		TextMap.prototype = {
			trim : function(phrase){
				phrase = phrase.replace(/\n*/gm, "");
				phrase = phrase.replace(/^\s+|\s+$/g, "");
				return phrase;
			},
			addTextNode : function(element){

				if(element.nodeValue){
					///\s+/g
					var words = element.nodeValue.split(''),
						len = words.length,
						i = 0,
						charPos = 0;

					for(; i < len; i++){
						var that = this,
							text = words[i].replace(/\s+/g,' ');

						this.textNodes.push(new MapNode(
							that.id,
							text,
							element,
							charPos
						));
						charPos++;
						this.id++;
					}
				}
			},
			skipNode : function(element){
				switch(element.nodeName.toLowerCase()){
					case 'style':
					case 'script':
						return true;
				}
				return false;
			},
			index : function(selected){

				if(selected.nodeType === 3){
					this.addTextNode(selected);

				}else if(selected.nodeType === 1){
					var nextSibling = false;
					if(!this.skipNode(selected)){
						if(selected.hasChildNodes()){
							
							var i = 0,
								len = selected.childNodes.length;

							for(; i < len; i++){

								this.index(selected.childNodes[i]);
							}

						}
					}
				}
			},
			mapToString : function(){

				var output = "";

				for(var i = 0; i < this.textNodes.length; i++){
					output += this.textNodes[i].text + " ";
				}

				return output;

			},
			findWord : function(word){

				var result = [],
					i = 0,
					len = this.textNodes.length,
					lastElement = false;

				for(; i < len; i++){
					if(this.textNodes[i].text === word){
						//console.log("FIND", word, )
						//if(lastElement !== this.textNodes[i].element){
							result.push(this.textNodes[i]);
						//}
						lastElement = this.textNodes[i].element;
					}
				}

				return result;
			},
			findText : function(text, startPos, endPos){

				var words = text.split(''),
					i = 0,
					len = words.length,
					textLen = endPos || this.textNodes.length,
					lastFound = false,
					lastCount = startPos || 0,
					firstCount = startPos || 0,
					parentPos = 0,
					parent = false,
					lastParent = false,
					charCount = 0,
					countFound = 0,
					founded = "",
					tested = "",
					errors = 0,
					result = {
						start : {},
						end : {},
						errors : 0
					};

					var test  = 0;

				for(; i < len; i++){
					var y = firstCount;
					tested += words[i];

					//ingnore whitespaces
					if(words[i] != " "){
						for(; y < textLen; y++){
							parent = this.textNodes[y].element.parentNode;
							if(parent !== lastParent){
								parentPos = 0;
							}
							
							if(words[i] === this.textNodes[y].text){
								
								founded +=words[i];
							
								if(!lastFound){
									result.start = {
										node : this.textNodes[y],
										pos : parentPos
									}
								}else{
									if(lastCount + 1 < y){
										errors++;
									}
								}
								countFound++;
								parentPos++;
								lastCount = y;
								lastFound = this.textNodes[y];
								break;
							}
							lastParent = parent;
						}
					}else{
						countFound++;
					}

					firstCount = lastCount + 1; 
					if(countFound === words.length){
						break;
					}
				}
				
				var endFound = Mold.mixin({}, lastFound);
				endFound.position = lastFound.position + 2;
			
				result.end = {
					node : endFound,
					pos : parentPos
				}

				result.errors = errors;
				result.found = countFound;
				result.rate = words.length - countFound + errors

				return result;
			},
			getStartPositions : function(text){
				
				var words = text.split(''),
					positions = [];

				for(var i = 0; i < words.length; i++){
					positions = this.findWord(words[i]);
					if(positions.length){
						return positions;
					}
				}

				return false;
			},
			rejectResult : function(collection){
				
				var i = 0,
					wordsFound = 0,
					diffCount = false,
					rate = 0,
					len = collection.length,
					result = [];

				for(; i < len; i++){
					if(wordsFound < collection[i].found){
						wordsFound =  collection[i].found;
					}
					
				}

				result = collection.filter(function(element){
					if(element.found >= wordsFound){
						return true;
					}
				});

				i = 0, len = result.length;
				
				for(; i < len; i++){
					var diff = result[i].end.node.id - result[i].start.node.id;
					if(!diffCount || diffCount > diff){
						diffCount = diff;
					}
				}

				result = result.filter(function(element){
					var diff = element.end.node.id - element.start.node.id;
					if(diff <= diffCount){
						return true;
					}
				});
				
				result = Mold.reject(result, function(firstValue, secondValue, firstIndex, secondeIndex, newList){
					if(

						firstValue.start.node.position === secondValue.start.node.position
						&& firstValue.start.node.element  === secondValue.start.node.element
						&& firstValue.end.node.position === secondValue.end.node.position 
						&& firstValue.end.node.element  === secondValue.end.node.element 
					){
						//console.log("AUSSORTIEREN", secondValue)
						return false;
					}else{
						return true;
					}

				});

				return result;
			},
			find : function(text){
				var text = text.replace(/[\s|\t]{2,30}/g, ' ');
				var startPositions = this.getStartPositions(text);

				var result = [];
				for(var i = 0; i < startPositions.length; i++){
					var collection = this.findText(text, startPositions[i].id);
					result.push(collection);
				}
				result = this.rejectResult(result);
				
				return result;
			}
		}


		var _find = function(text){
			var text = text.replace(/[\s|\t]{2,30}/g, ' ');
		

			console.log("map", map.mapToString())
			//console.log("starPositions", map.getStartPositions(text))

			//console.log("map.findText(text)", map.findText(text));
			console.log("find", text)
			return map.find(text);
		}


		this.publics = {
			find : function(text){
				var map = new TextMap(document.documentElement);
				return map.find(text);
			}
		}
	}
)