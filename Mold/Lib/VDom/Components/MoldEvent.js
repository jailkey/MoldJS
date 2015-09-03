Seed({
		name : "Mold.Lib.VDom.Components.MoldEvent",
		dna : "component",
		include : [
			"->Mold.DNA.Component"
		],
		directives : [
			{
				at : "attribute",
				name : "mold-event",
				watchable : true,
				collect : {
					attribute : [
						 "mold-event"
					]
				}
			}
		]
	},
	function(node, element, collection){

		var setEvent = function(){
			var eventList = collection['mold-event'].split(";");

			for(var i = 0; i < eventList.length; i++){

				var eventParts = eventList[i].split(":");
				var eventData = {
					element : element,
					data : (eventParts[2]) ? JSON.parse(eventParts[2]) : null,
					forms : element.moldTemplate.forms
				}

				if(element.moldTemplate){
					element.on(eventParts[0], function(){
						element.moldTemplate.trigger(eventParts[1].replace("@", ""), eventData);
					})
				}else{
					console.log("no template found", element, element.moldTemplate)
				}

			}
		}
		collection.on("mold-event.changed", function(){
			console.log("attribute changed")
		})

		setEvent();
	}
);