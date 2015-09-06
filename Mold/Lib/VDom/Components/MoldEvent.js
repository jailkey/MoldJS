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
				//watchable : true,
				collect : {
					attribute : [
						 "mold-event"
					]
				}
			}
		]
	},
	function(node, element, collection){

		var getEventData = function(eventName){
			var eventList = element.getAttribute('mold-event').split(";");
			for(var i = 0; i < eventList.length; i++){
				var eventParts = eventList[i].split(":");
				if(eventParts[0]){
					return eventParts[2];
				}
			}
		}
		
		var setEvent = function(){
			var eventList = collection['mold-event'].split(";");
			
			for(var i = 0; i < eventList.length; i++){

				var eventParts = eventList[i].split(":");
				var eventData = {
					element : element,
					forms : element.moldTemplate.forms
				}

				if(element.moldTemplate){
					
					element.on(eventParts[0], function(e){
						eventData.elementEvent = e;
						eventData.data = (getEventData(eventParts[0])) ? JSON.parse(getEventData(eventParts[0])) : null,
						element.moldTemplate.trigger(eventParts[1].replace("@", ""), eventData);
					})
				}else{
					console.log("no template found", element, element.moldTemplate)
				}

			}
			
		}

		setEvent();
		
	}
);