Seed (
	{ 
		name : "Mold.Lib.Dom",
		dna : "class",
		author : "Jan Kaufmann",
		description : "",
		version : 0.1
	},
	function(){
		
		return {
			each : function(selector, func){
				var i;
				var elements = document.querySelectorAll(selector);
				for( i = 0;  i < elements.length; i++){
					func(elements[i]);
				}
			},
			get : function(selector, element){
				element = element || document;
				return element.querySelectorAll(selector);
			},
			remove : function(selector){
				this.each(selector, function(element){
					element.parentNode.removeChild(element);
				});
			}
		}
	}
);