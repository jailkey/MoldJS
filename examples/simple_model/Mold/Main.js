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
			}
			
			//adapter : new Mold.Adapter.LocalStore()
		});

		//define a adapter to save the model
		model.connect(new Mold.Adapter.LocalStore());


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

		//wrong value will reset
		//console.log("Value is a empty string:", model.data.list[1].entry);

		//use save() to save the data via the given adapter (in our case it saved to localStorage);
		model.save().then(function(id){
			console.log("saved", id);
			model
				.load(id)
				.then(function(data){
					console.log("ready", data)
				});

		});
		


		
	}
);