Seed({
		name : "Mold.Tools.SeedParser",
		dna : "class",
		platform : "node"
	},
	function(seedString){

		if(!seedString){
			return false;
		}
		
		var vm = require("vm");
		
		var code = "seedInfo = (function(){"
				+ "	var result = [];"
				+ "	var Seed = function(head, code) { result.push({ header : head, code : code })}; "
				+ " " + seedString + " ;"
				+ "	return result;"
				+ "})()";
		
		var result = vm.runInThisContext(code);

		if(result.length > 1){
			throw new Error("handling more then one seed must be implemented!");
		}

		try {
			result = result[0];
		}catch(e){
			result = {
				header : false
			}
		}


		this.publics = {
			includes : result.header.includes,
			name : result.header.name,
			dna : result.header.dna,
			version : result.header.version,
			npm : result.header.npm,
			header : result.header
		}
	}
)