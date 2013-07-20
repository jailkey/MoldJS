Seed (
	{ 
		name : "Mold.Scope.Jasmin",
		dna : "externallib",
		author : "Jan Kaufmann",
		include : ["Mold.DNA.ExternalLib"],
		path : "http://thirdparty.libs/jasmine.js"
	},
	function(code){

		
		return function(scope){
			code = " " + code + " ("+scope.toString()+")();";
			var jasmine = new Function(code);
			jasmine();
		}
	}
);