Seed({
		name : "Mold.Component.SlideShow",
		dna : "component",
		include : [
			"Mold.DNA.Component",
			"Mold.Component.SlideShowParts.Controller",
		],
		controller : "Mold.Component.SlideShowParts.Controller"
		element : "slide-show",
		attributes : {
			"speed" : 50,
			"autoplay" : false
		}
	},
	function(element, parameter){
		

		var controller = new Mold.Component.SlideShowParts.Controller(parameter);
		if(controller.registerd.length){
			var newElement = controller.registerd[0].template.get();
		}

		Mold.each(element.getElementsByTagName("slide-show-value"), function(subitem){
			controller.addItem(subitem.innerHTML);
		});

		element.parentNode.insertBefore(newElement, element); 

		element.remove(element);

		return this;
	}
)