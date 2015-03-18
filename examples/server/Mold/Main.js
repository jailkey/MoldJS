Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"->Mold.Server.Server",
			"Mold.Router"
		]
	},
	function(){

		var router = new Mold.Router({
			'/test/:name/:id' : 'Mold.Test',
			'/wasanderes' : 'Mold.Test2',
			'GET/super' :  '@fireevent'
		});


		var server = new Mold.Server.Server('127.0.0.1', '1137');
		
		server.use(router);
		
	}
)