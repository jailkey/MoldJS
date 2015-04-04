Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"->Mold.Lib.Model",
			"->Mold.Adapter.LocalStore"
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
			adapter : new Mold.Adapter.LocalStore()
		});

		//define some events
		model.data.list.on("list.item.add", function(e){
			console.log("Item added to list!", "Item value is: " + e.data.value.entry);
		})

		//trigger the event 
		model.data.list.push({ entry : "something" });

			//if you want to use validation turn it on
		model.validation(true);

		//define an event
		model.on("validation.error", function(e){
			console.log("Validation Error at", e.data);
		});

		//triggers an error, cause the property validation is string, not number
		model.data.list.push({ entry : 5 });

		//wrong value will reseted
		console.log("Value is a empty string:", model.data.list[1].entry);

		//use save() to save the data via the given adapter (in our case it sends a POST-request with models data);
		model.save("test.data").then(function(id){
			model.load(id).success(function(data){
				console.log("e", data)
			});
		});
		


		
	}
);