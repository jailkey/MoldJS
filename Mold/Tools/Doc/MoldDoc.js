Seed({
		name : "Mold.Tools.Doc.MoldDoc",
		dna : "class",
		include : [
			{ File : "Mold.Lib.File" },
			{ Promise : "Mold.Lib.Promise" },
			{ PathLib : "Mold.Lib.Path" }
		],
		test : "Mold.Test.Tools.Doc.MoldDoc"
	},
	function(url){

		var fs = require("fs");
		
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
				parts : [],
				properties : [],
				methods : [],
				objects : []
			};

			if(!~url.indexOf("Mold.js")){
				var header = _getSeedInfo(data);
				header.include = _dissolveIncludes(header.include, header.name);
				header.test = _addTestPath(header.test, header.name)
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
			var undefined;

			
			while(line !== undefined){

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
				if(
					(oldState === STATE_IN_COMMENT && state !== STATE_IN_COMMENT)
					|| (state !== STATE_IN_COMMENT && dataParts.length === 1)
				){

					var commentObject = _parseComment(comment.replace("/**", ""));
					commentObject.line = lineCounter;
					if(commentObject.module){
						Mold.mixin(output, commentObject);
					}else{
						if(commentObject.method){
							output.methods.push(commentObject);
						}
						if(commentObject.property){
							output.properties.push(commentObject);
						}
						if(commentObject.object){
							output.objects.push(commentObject);
						}
						//output.parts.push(commentObject)
					}
					comment = "";
				}

				lineCounter++;
				line = dataParts.shift();
			}
			//console.log("output", output)
			return output;
		}

		var _removeTabs = function(input){
			var lines = input.split("\n"),
				shortest = 100;

			lines.forEach(function(value){
				var result = value.match(/^(.*?)[\S]/g);
				if(result){
					if((result[0].split("\t").length - 1) < shortest){
						shortest = (result[0].split("\t").length - 1)
					}
				}
			})
			var regExp = new RegExp("^\t{" + shortest + "}(.*?)", "g");
			input = "";
			lines.forEach(function(value){
				input += value.replace(regExp, "") + "\n";
			});

			return input;
		}

		var _getExample = function(example){
			var parts = example.split("#");
			var filename = Mold.trim(parts[0]);
			var ancor = "#" + Mold.trim(parts[1]);

			if (PathLib.is(filename)) {
				var file = fs.readFileSync(filename).toString();
				var out = file.substring(file.indexOf("//"+ancor) + ancor.length + 2, file.indexOf("///"+ancor))
				out = out.replace(/\r\n/g, "\n");
				return {
					path : filename,
					code : _removeTabs(out)
				};
			}else{
				return {
					path : false,
					code : _removeTabs(example)
				};
			}
				
			//var file = fs.readFileSync(filename);
			
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

		var _dissolveIncludes = function(includes, targetName){
			var output = [];
			Mold.each(includes, function(part){
				if(Mold.isObject(part) || Mold.isArray(part)){
					output = output.concat(_dissolveIncludes(part, targetName))
				}else{
					var path = "";
					var len = targetName.split(".").length -1;
					for(var i = 0; i < len; i++){
						path += "../";
					}
					if(Mold.startsWith(part, ".")){
						part = targetName.split(".").splice(0, targetName.split(".").length - 1).join(".") + part
					}
					output.push({
						name : part,
						path : path + part.replace(/\./g, "/")
					});
				}
			});
			return output;
		}

		var _addTestPath = function(test, targetName){
			if(!test){
				return false;
			}
			var len = targetName.split(".").length -1;
			var path = "";

			for(var i = 0; i < len; i++){
				path += "../";
			}
			return {
				name : test,
				path : path + test.replace(/\./g, "/")
			}
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
							output['partType'] = "method";
							output['name'] = _getParameter(selected, 1).replace("\n", "");
							break;
						case "object":
							output['object'] = true;
							output['partType'] = "object";
							output['name'] = _getParameter(selected, 1).replace("\n", "");
							break;
						case "property":
							output['property'] = true;
							output['partType'] = "property";
							output['name'] = _getParameter(selected, 1).replace("\n", "");
							break;
						case "modul":
						case "module":
							output['module'] = true;
							output['partType'] = "module";
							output['name'] = _getParameter(selected, 1).replace("\n", "");
							break;
						case "param":
						case "parameter":
							output['parameter'].push({
								paraname : _getParameter(selected, 2).replace("\n", ""),
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
							output['example'] =_getExample( Mold.trim(_getFrom(selected, 1)));
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
						case "public":
							output['public'] = true;
							break;
						case "private":
							output['private'] = true;
							break;
						case "async":
							output['async'] = true;
							break;
						case "deprecated":
							output['deprecated'] = true;
							break;
						default:
							console.log("not found", action, selected)


					}
				}

			}
			if(!output.partType){
				output.partType = "module";
				output.module = true;
			}
			return output;
		}

		var file = new File(url);

		this.publics = {
			get : function(){
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