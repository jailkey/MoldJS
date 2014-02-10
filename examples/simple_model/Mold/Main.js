Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Lib.Model",
			"external->Mold.Adapter.Rest"
		]
	},
	function(){

		//create a model
		var model = new Mold.Lib.Model({
			//define the model stucture
			properties : {
				list : [
					{ entry : "string" }
				],
				myproperty : "string"
			},
			//define how to sync the model
			adapter : new Mold.Adapter.Rest({ path : "my/rest/route/" })
		});

		//define some events
		model.data.on("property.change.myproperty", function(e){
			console.log("Myproperty has change!", "New value is:" + e.data.value);
		})

		//trigger the event 
		model.data.myproperty = "something";

		//use save() to save the data via the given adapter (in our case it sends a POST-request with models data);
		model.save();

		//if you want to use validation turn it on
		model.validation(true);

		//define an event
		model.data.on("validation.error", function(e){
			console.log("Validation Error at", e.data.name);
		});

		//triggers an error, cause the property validation is string, not number
		model.data.myproperty = 5;


	}
);