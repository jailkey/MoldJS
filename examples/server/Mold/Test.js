Seed({
		name : "Mold.Test",
		dna : "controller",
		include : [
			"->Mold.DNA.Controller",
			"->Mold.Lib.Model",
			"->Mold.Adapter.Mongo",
			"->Mold.Lib.Template"
		]

	},
	function(shared){

		var model = new Mold.Lib.Model({
			properties : {
				vorname : "string",
				nachname : "string"
			},
			adapter : new Mold.Adapter.Mongo(shared.database, "firstrest", "_id")
		});

		var template = new Mold.Lib.Template(function(){/*|
			<div>
				vorname : {{vorname}}
			</div>
			<div>
				nachname : {{nachname}}
			</div>
		|*/})

		template.bind(model);


		this.actions = {

			"@get.data" : function(e){
		
				if(e.data.param.id){
					console.log("id", e.data.param.id)
					model
						.load(e.data.param.id)
						.then(function(result){

							e.data.response.addData(template.get(), "html");
							
							e.data.next();
						});
				}else{
					e.data.next();
				}
			},

			"@insert.data" : function(e){
				
				console.log(e.data.request.body)

				model.data.vorname = e.data.request.body.vorname;
				model.data.nachname = e.data.request.body.nachname;
				model
					.save()
					.then(function(id){
						e.data.response.addData("Inserted with id:" + id, "text");
						e.data.next();
					})
					.fail(function(fail){
						e.data.response.addData(fail, "text");
						e.data.next();
					});
			},

			"@update.data" : function(e){
				e.data.next();
			},

			"@update.data" : function(e){
				e.data.next();
			}
		
		}
	}
)