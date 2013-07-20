Seed (
	{ 
		name : "Mold.Scope.jQuery",
		dna : "externallib",
		author : "Jan Kaufmann",
		include : ["Mold.DNA.ExternalLib"],
		path : "http://thirdparty.libs/jquery.js"
	},
	function(code){
		return function(scope){
			code = "(function(){console.log('this:', this); var that = {}; " + code;
			code = code.replace(/window\./, "that.");
			code = code.replace(/window/g, "that");
			code = code.replace(/that\.navigator/, "window.navigator");
			code = code.replace(/that\.document/, "window.document") 
			code = " " + code + " \n var $ = that.$, jQuery = that.jQuery; \n ("+scope.toString()+")()}())";
			var jquery = new Function(code);
			jquery();
		}
	}
);