Seed({
		name : "Mold.Tools.Doc.HTML",
		dna : "class",
		include : [
			{ File : "Mold.Lib.File" },
			{ Promise : "Mold.Lib.Promise" }	
		],
		test : "Mold.Test.Tools.Doc.HTML"
	},
	function(url){
		
		if(!url){
			throw new Error("Url is not defined!");
		}

		var _data = [];

		var Modul = function(conf){
			this.name = conf.name || false;
			this.description = conf.description || false;
			this.extend = conf.extend || false;
			this.snippets = [];
		}

		var Snippet = function(conf){
			this.description = conf.description || false;
			this.content = conf.content || '';
		}

		var _firstWord = function(value){
			value = value.toLowerCase();
			return value.substring(0, (~value.indexOf(' ')) ? value.indexOf(' ') : value.length );
		}

		var _extractText = function(value){
			return Mold.trim(value.substring((~value.indexOf(' ')) ? value.indexOf(' ') : value.length, value.length));
		}

		var _parseDoc = function(data){
			
			data = data.replace(/\n/g, "");
			var output = false;
			var dataParts = data.split(/\@([\s\S]*?)/g);

			for(var i = 0; i < dataParts.length; i++){
				var value = Mold.trim(dataParts[i]);

				switch(_firstWord(value)){
					case "modul":
						output = { type : "modul" };
						break;
					case "modul-end":
						output = { type : "modul-end" };
						break;
					case "snippet":
						output = { type : "snippet" };
						break;
					case "snippet-end":
						output = { type : "snippet-end" };
						break;
					case "name":
						console.log("name foudn",  _extractText(value))
						output.name = _extractText(value);
						break;
					case "description":
						output.description = _extractText(value);
						break;
					case "extends":
						output.extend = _extractText(value);
						break;
				}
			}
			return output;
		}

		var _parse = function(data){
			//console.log("data", result.data.data)
			var parts = data.split(/\<\!\-\-\/\/([\s\S]*?)\/\/\-\-\>/g);
			var parsed = false;
			var modul = false;
			var snippet = false;
			var output = [];

			for(var i = 0; i < parts.length; i++){

				if((parsed = _parseDoc(parts[i]) )){
					//console.log("parsed", parsed.type)
					console.log(i, parts[i])
					switch(parsed.type){
						case "modul":
							modul = new Modul(parsed);
							output.push(modul);
							break;
						case "snippet":
							if(!modul){
								throw new Error("A snippet has to be declared inside a modul!")
							}
							snippet = new Snippet(parsed);
							modul.snippets.push(snippet);
							break;
						case "modul-end":
							modul = false;
							break;
						case "snippet-end":
							snippet = false;
							break;
					}
				}else{
					if(snippet){
						snippet.content += parts[i];
					}
				}
			}
			return output;
		}

		var file = new File(url);

		this.publics = {
			get : function(callback){
				return new Promise(function(resolve, reject){
					file
						.content(function(data){
							resolve(_parse(data));
						})
						.error(function(error){
							reject(error);
						});
				});
			}
		}
	}
)