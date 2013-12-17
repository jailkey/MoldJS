Seed({
		name : "Mold.Lib.Component",
		dna : "class"
	},
	function(elementName, attributes, createController){

		var _registerElement = function(){

		}


		this.publics = {
			getElements : function(){

			},
			append : function(doc){
				var elements = doc.getElementsByTagName(elementName);
				console.log(elements)
				Mold.each(elements, function(element){
					var parameter = {};
					Mold.each(attributes, function(attribute, name){
						var value = element.getAttribute(name);
						if(value){
							parameter[name] = value;
						}else{
							parameter[name] = attribute;
						}
					});
					createController.call(this, element, parameter);
				})
			}
		}
	}
)