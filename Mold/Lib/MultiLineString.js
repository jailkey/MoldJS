Seed({
		name : "Mold.Lib.MultiLineString",
		dna : "static",
	},
	function(){
		return function(stringFunction, templateVars, format){
			var output = "";
			format = format || "auto";

			templateVars = templateVars || {};

			output = stringFunction.toString().replace(/(^function\s*\(\)\s*\{\s*\/\*\|)([\s\S]*)(\|\*\/\s*\})$/g, function(){
				return arguments[2];
			});

			if(Mold.startsWith(format, "delete-tabs-")){
				var tabLength = +format.replace("delete-tabs-", "");
				format = format.replace(tabLength, "");
			}

			//Safari Bugfix 
			output = output.replace(/^function\s*\(\)\s*\{\s*\/\*\|/g, '');
			output = output.replace(/\|\*\/\s*\}$/g, '');

			if(Mold.startsWith(output, "\n")){
				output = output.substring(1, output.length);
			}
			//Tabformat
			switch (format){
				case "auto":
					var lines = output.split("\n"),
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
					output = "";
					lines.forEach(function(value){
						output += value.replace(regExp, "") + "\n";
					});
					
					break;
				case "without-tabs":
					output = output.replace(/\t/g, '');
					output = output.replace(/    /g, '\t');
					break;
				case "delete-tabs-":
					var regExp = new RegExp("/\t{" + tabLength + "}/","g");
					output.replace(regExp, '');
					output = output.replace(/    /g, '\t');
					break;
				default:
					break;
			}

			//replace template vars
			output = output.replace(/\$\{(.*?)\}/g, function(templateString, prop){
				return templateVars[prop] || "";
			});

			return output;
		}
	}
)