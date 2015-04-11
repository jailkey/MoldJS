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
		console.log("CREATER CONTROLLER")

		var model = new Mold.Lib.Model({
			properties : {
				vorname : "string",
				nachname : "string"
			},
			adapter : new Mold.Adapter.Mongo(shared.database, "firstrest")
		});

		var templateDetail = new Mold.Lib.Template(function(){/*|
			<div>
				vorname : {{vorname}}
			</div>
			<div>
				nachname : {{nachname}}
			</div>
		|*/})

		templateDetail.bind(model);


		var list = new Mold.Lib.Model({
			properties : {
				list : [
					{
						vorname : "string",
						nachname : "string",
						_id : "number"
					}
				]
			},
			adapter : new Mold.Adapter.Mongo(shared.database, "firstrest"),
			list : true
		})


		var listTemplate = new Mold.Lib.Template(function(){/*|
				<html>
					<body>
						<ul>
							{{#list}}
								<li><a href="/data/{{_id}}"> {{+}}. {{_id}} {{vorname}} {{nachname}} </a></li>
							{{/list}}
						</ul>
					</body>
				</html>
		|*/}, { disableSanitizer : true } );


		listTemplate.bind(list);


		this.actions = {

			"@get.data" : function(e){
				console.log("get Data")
				if(e.data.param.id){
				
					model
						.load(e.data.param.id)
						.then(function(result){

							e.data.response.addData(templateDetail.get(), "html");
							e.data.next();
						});
				}else{
					e.data.next();
				}
			},

			"@getall.data" : function(e){
				console.log("get  all Data")
				list
					.load()
					.then(function(result){
						e.data.response.addData(listTemplate.get(), "html");
						e.data.next();
					}).
					fail(function(err){
						console.log("Fehler", err)
					});
			
			},

			"@insert.data" : function(e){

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