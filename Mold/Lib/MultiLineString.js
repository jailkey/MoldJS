Seed({
		name : "Mold.Lib.MultiLineString",
		dna : "static",
	},
	function(){
		return function(stringFunction, templateVars){
			var output = "";

			templateVars = templateVars || {};

			output = stringFunction.toString().replace(/(^function\s*\(\)\s*\{\s*\/\*\|)([\s\S]*)(\|\*\/\s*\})$/g, function(){
				return arguments[2];
			});

			//Safari Bugfix 
			output = output.replace(/^function\s*\(\)\s*\{\s*\/\*\|/g, '');
			output = output.replace(/\|\*\/\s*\}$/g, '');
			output = output.replace(/\t/g, '');
			output = output.replace(/    /g, '\t');

			output = output.replace(/\$\{(.*?)\}/g, function(templateString, prop){
				console.log("DOUND", prop, templateVars[prop], templateVars)
				return templateVars[prop] || "";
			});

			return output;
		}
	}
)