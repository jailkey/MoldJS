Seed (
	{ 
		name : "Mold.Lib.CORS",
		dna : "class",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	function(config){
	
		var _url = config.url || false;
		var _methode = config.methode || false;
		var _success = config.success || false;
		var _error = config.error || false;
		
		var _get = function(){
			var element = document.createElement("iframe");
			element.src = _url;
			var bodyElement = document.getElementsByTagName("body")[0];
			element.onload = function(){
				console.log(this)
				var elementDocument = (this.contentWindow || this.contentDocument);
				console.log("document", elementDocument.innerHTML);
			}
			bodyElement.appendChild(element);
			
			
			
		}
		
		
		this.publics = {
			send : function(){
				return _get();
			},
			abort : function(){
			
			}
		}
	}
);