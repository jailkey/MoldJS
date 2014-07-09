Seed({
		name : "Mold.Lib.CssParser",
		dna : "singelton",
		include : [
			"Mold.Lib.File",
			"Mold.Lib.Event"
		]
	},
	function(doc){
		
		Mold.mixing(this, new Mold.Lib.Event(this));


		var _files = doc.querySelectorAll('link[rel="stylesheet"]'),
			_that = this,
			_contents = "",
			_fileCounter = 0,
			_parsedContent = false;

		Mold.each(_files, function(file){
			if(Mold.isNode(file)){
				var file = new Mold.Lib.File(file.getAttribute('href'));

				file.content(function(content){
					_fileCounter++;
					_contents += content;

					if(_fileCounter === _files.length){
						_that.trigger("ready");
					}
				});

				file.error(function(){
					_fileCounter++;
					if(_fileCounter === _files.length){
						_that.trigger("error");
					}
				});
			}
		});

		var _parseProperty = function(value){
			
			var values = value.split(";"),
				output = {};
			
			Mold.each(values, function(property){
				propertyValue = property.split(":");
				if(propertyValue[1]){
					output[Mold.trim(propertyValue[0])] = Mold.trim(propertyValue[1]);
				}
			})
			return output;
		}

		var _getClosingPosition = function(value){
			
			var opened = 0,
				closed = 0,
				i = 0,
				len = value.length;

			
			for(; i < len; i++){
				switch(value[i]){
					case "{":
						opened++;
						break;
					case "}":
						closed++;
						break;
				}
				if(closed > opened){
					return i+1;
				}
			}
			
			return 0;
		}
		var counter = 0;

		var _parseContent = function(content){
			var nextBracked = content.indexOf("{"),
				output = {},
				rule,
				ruleContent;



	
			while(nextBracked > -1){
				rule = content.substring(0, nextBracked);
				counter++;
				
				content = content.substring(nextBracked +1, content.length);
				endBracked = content.indexOf("}");
				nextBracked = content.indexOf("{");
				if(endBracked < nextBracked || nextBracked === -1){
					ruleContent = content.substring(0, endBracked);
					output[rule] = {
						properties : _parseProperty(ruleContent)
					};

					content = content.substring(endBracked +1, content.length);
					nextBracked = content.indexOf("{");
				}else{
					endBracked =  _getClosingPosition(content);
					nextBracked = content.indexOf("{", endBracked);
					ruleContent = content.substring(0, endBracked);
					content = content.substring(endBracked, content.length);
					output[rule] = {
						rules : _parseContent(ruleContent)
					};
				}

			}
			
			return output;
		}
		var start = new Date().getTime();


		this.on("ready", function(e){

			_parsedContent = _parseContent(_contents);
			var ende = new Date().getTime();
			console.log("css parse an load time", (ende - start) + "ms", counter)
		});

		var _getElementsByStyleProperty = function(content, property){
			var output = [];
			Mold.each(content, function(selected, selector){
				if(selected.properties){
					Mold.each(selected.properties, function(selectedProperty, name){
						if(name === property){
							var elements = document.querySelectorAll(selector);
							Mold.each(elements, function(element, elementNAme){
								
								output.push({ element : element, properties : selected.properties });
							});
						}
					});
				}
			});
			return output;
		}

		this.publics = {
			getElementsByStyleProperty : function(property){
				//var propertys = _contents.split(/)
				return _getElementsByStyleProperty(_parsedContent, property)
			}
		}
	}
)