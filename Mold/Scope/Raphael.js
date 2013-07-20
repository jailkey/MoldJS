Seed (
	{ 
		name : "Mold.Scope.Raphael",
		dna : "externallib",
		author : "Jan Kaufmann",
		include : ["Mold.DNA.ExternalLib"],
		path : "http://thirdparty.libs/raphael.js"
	},
	function(code){
		code = code.replace(/window\.Raphael/g, "Raphael");
		code = code.replace(/window\.eve/g, "eve");
		code = "var Raphael = {}; Raphael.eve = {}; " + code + " return Raphael";
		var raphael = new Function(code);
		return raphael();
	}
);