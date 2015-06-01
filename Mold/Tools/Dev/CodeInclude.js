Seed({
		name : "Mold.Tools.Dev.CodeInclude",
		dna : "action"
	},
	function(){
	
		Mold.addPreProcessor("codeinclude", function(code){
			code = code.replace(/\/\/°include(.*?)$/gm, function(match, contents){
				var seed = Mold.getSeed(Mold.trim(contents));
				if(typeof seed === "function"){
					var output = seed.toString();
					output = output.substring(output.indexOf("{") + 1, output.lastIndexOf("}"));
			
					return output;
				}else{
					return 'console.log("' + contents+ ' is not a function!");'
				}
				
			
			});
			
			return code;
		});
		

	}
)