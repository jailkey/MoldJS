Seed({
		name : 'Mold.Parser.Pre.ComLog',
		dna : "action"
	},
	function(){
		Mold.addPreparser("comlog", function(code){
			//console.log(code)
			code = code.replace(/\/\/!(.*?)$/gm, function(match, contents, offset, s){
			//console.log("get", contents)
				return "console.log('INFO:', '"+contents+"')";
			});
			return code;
		});
	}
)