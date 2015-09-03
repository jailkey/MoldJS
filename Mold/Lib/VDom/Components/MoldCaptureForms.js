Seed({
		name : "Mold.Lib.VDom.Components.MoldCaptureForms",
		dna : "component",
		include : [
			"->Mold.DNA.Component",
		],
		directives : [
			{
				at : "element",
				name : "input"
			}
		]
	},
	function(node, element, collection){

		var setValue = function(name, value){
			if(element.moldTemplate){
				element.moldTemplate.forms[name] = value;
			}
		}
		
		switch(element.attr('type')){
			case "text" :
				element.on('keyup', function(e){
					setValue(element.attr("name"), element.val());
				})
				break;
		}
	}
);