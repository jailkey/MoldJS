Seed({
		name : "Mold.Tools.Doc.MoldDoc",
		dna : "class",
		include : [
			{ File : "Mold.Lib.File" },
			{ Promise : "Mold.Lib.Promise" }	
		],
		test : "Mold.Test.Tools.Doc.MoldDoc"
	},
	function(url){
		
		if(!url){
			throw new Error("Url is not defined!");
		}

		var STATE_IN_COMMENT = "incomment";
		var STATE_IN_FUNCTION = "infunction";
		var STATE_IN_CODE = "incode";

		var _getSeedInfo = function(data){
			var exec = "var header = {}; var Seed = function(head, code){ header = head }; " + data + ";";
			eval(exec);
			return header;
		}

		var _parse = function(data){
			
			var output = {
				name : false,
				url : url,
				parts : []
			};

			if(!~url.indexOf("Mold.js")){
				var header = _getSeedInfo(data);
				Mold.mixin(output, header);
			}else{
				output.name = "Mold";
			}


			var dataParts = data.split("\n");

			var line = dataParts.shift();
			var state = STATE_IN_CODE;
			var comment = "";
			var oldState = false;
			var lineCounter = 1;

			while(line){
				oldState = state;

				if(~line.indexOf("/**")){
					state = STATE_IN_COMMENT;
				}
				if(state === STATE_IN_COMMENT && ~line.indexOf("*/")){
					state = STATE_IN_CODE;
				}

				/*
				if(state === STATE_IN_CODE && ~line.indexOf("function")){
					state = STATE_IN_CODE;
				}*/

				switch(state){
					case STATE_IN_COMMENT:
						comment += line + "\n";
						break;
				}

				//if state switch from comment to code add to comment collection:
				if(oldState === STATE_IN_COMMENT && state !== STATE_IN_COMMENT){

					var commentObject = _parseComment(comment.replace("/**", ""));
					commentObject.line = lineCounter;
					if(commentObject.modul){
						Mold.mixin(output, commentObject);
					}else{
						output.parts.push(commentObject)
					}
					comment = "";
				}

				lineCounter++;
				line = dataParts.shift();
			}

			return output;
		}

		var _getAction = function(comment){
			return comment.substring(0, comment.indexOf(" "));
		}

		var _getParameter = function(comment, number){
			var parts = comment.split(" ");
			return parts[number];
		}

		var _getFrom = function(comment, number){
			var parts = comment.split(" ");
			var output = "";
			for(; number < parts.length; number++){
				output += parts[number] + " ";
			}

			output = Mold.trim(output);
			if(Mold.startsWith(output, "-")){
				output = Mold.trim(output.substring(1, output.length));
			}
			return Mold.trim(output);
		}

		var _convertType = function(type){
			type = type
					.replace("(", "")
					.replace(")", "")
					.replace("{", "")
					.replace("}", "");

			type = type.toLowerCase();
			return type;
		}

		var _parseComment = function(comment){
			var output = {
				parameter : [],
				private : false,
				public : false,
				property : false,
				object : false,
				method : false,
				module : false
			}
			
			var commentParts = comment.split(/[\W|*]@/g);

			for(var i = 0; i < commentParts.length; i++){
				var selected = commentParts[i];
				
				//remove *
				selected = selected.replace("*", "");

				//change line endings
				selected = selected.replace("\r\n", "\n");

				//change white spaces
				selected = selected.replace("  ", " ");
				selected = selected.replace("\t", " ");

				var action = Mold.trim(_getAction(selected));
				//console.log(action)
				if(action){
					switch(action.toLowerCase()){
						case "method":
						case "methode":
							output['method'] = true;
							output['name'] = _getParameter(selected, 1).replace("\n", "");
							break;
						case "object":
							output['object'] = true;
							output['name'] = _getParameter(selected, 1).replace("\n", "");
							break;
						case "property":
							output['property'] = true;
							output['name'] = _getParameter(selected, 1).replace("\n", "");
							break;
						case "modul":
						case "module":
							output['module'] = true;
							output['name'] = _getParameter(selected, 1).replace("\n", "");
							break;
						case "param":
						case "parameter":
							output['parameter'].push({
								name : _getParameter(selected, 2).replace("\n", ""),
								type : _convertType(_getParameter(selected, 1).replace("\n", "")),
								description : _getFrom(selected, 3)
							});
							break;
						case "return":
						case "returns":
							output['return'] = {
								type : _convertType(_getParameter(selected, 1).replace("\n", "")),
								description : _getFrom(selected, 2)
							};
							break
						case "type":
						case "typ":
							output['type'] = _getParameter(selected, 1).replace("\n", "");
							break;
						case "desc":
						case "description":
							output['description'] = Mold.trim(_getFrom(selected, 1));
							break;
						case "namespace":
							output['description'] = Mold.trim(_getParameter(selected, 1));
							break;
						case "public":
							output['public'] = true;
							break;
						case "private":
							output['private'] = true;
							break;
						case "example":
							output['example'] = Mold.trim(_getFrom(selected, 1));
							break;
						case "test":
							output['test'] = Mold.trim(_getFrom(selected, 1));
							break;
						case "fires":
						case "trigger":
						case "event":
							output['trigger'] = Mold.trim(_getFrom(selected, 1));
							break;
						case "callback":
							output['callback'] = Mold.trim(_getFrom(selected, 1));
							break;
						case "author":
							output['author'] = Mold.trim(_getFrom(selected, 1));
							break;
						case "version":
							output['version'] = Mold.trim(_getFrom(selected, 1));
							break;
						case "name":
							output['name'] = Mold.trim(_getFrom(selected, 1));
							break;
						case "values":
							output['values'] = Mold.trim(_getFrom(selected, 1));
							break;
						default:
							console.log("not found", action, selected)


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
							var parsed = _parse(data);
							resolve(parsed);
						})
						.error(function(error){
							reject(error);
						});
				});
			}
		}
	}
)