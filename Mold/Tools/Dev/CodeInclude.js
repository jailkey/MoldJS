Seed({
		name : "Mold.Tools.Dev.CodeInclude",
		dna : "action"
	},
	function(){
	
		Mold.addPreProcessor("codeinclude", function(code){
			code = code.replace(/\/\/°include(.*?)$/gm, function(match, contents){
				var before = "";
				var as = false;
				if(contents && contents.indexOf(" as ")){
					var parts = contents.split(" as ");
					contents = parts[0];
					as = Mold.trim(parts[1]);
					if(as && ~as.indexOf(".")){
						var asParts = as.split(".");
						var collected = "";
						before = "var "
						for(var i = 0; i < asParts.length - 1; i++){
							before += collected + asParts[i] + " = " + collected + asParts[i] + " || {};\n";
							collected += collected + asParts[i] + ".";
						}
					}
					
				}
				var seed = Mold.getRawSeed(Mold.trim(contents)).func;
	
				if(typeof seed === "function"){
					if(as){
						if(before){
							var output =  before + as + " = " + seed.toString() + ";\n";
						}else{
							var output =  "var " + as + " = " + seed.toString() + ";\n";
						}
					}else{
						var output = seed.toString();
						output = output.substring(output.indexOf("{") + 1, output.lastIndexOf("}"));
					}
					return output;
				}else{
					return 'console.log("' + contents+ ' is not a function!");'
				}
				
			
			});
			
			return code;
		});
		

	}
)