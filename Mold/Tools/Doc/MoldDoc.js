Seed({
		name : "Mold.Tools.Doc.MoldDoc",
		dna : "class",
		include : [
			{ File : "Mold.Lib.File" },
			{ Promise : "Mold.Lib.Promise" }	
		],
		test : "Mold.Test.Tools.Doc.MoldDoc"
	},
	function(url){
		
		if(!url){
			throw new Error("Url is not defined!");
		}

		var _data = [];

		var _parse = function(data){
			//data = data.replace(/\n/g, "");
			var output = false;
			var dataParts = data.split(/\@([\s\S]*?)/g);
			
		}

		var file = new File(url);

		this.publics = {
			get : function(callback){
				return new Promise(function(resolve, reject){
					file
						.content(function(data){
							resolve(_parse(data));
						})
						.error(function(error){
							reject(error);
						});
				});
			}
		}
	}
)