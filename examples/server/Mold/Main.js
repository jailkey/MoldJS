Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"->Mold.Server.Server",
			{ Router : "->Mold.Server.Middlewares.Router" },
		]
	},
	function(){



		var router = new Router({
			'/test/:name/:id' : 'Mold.Test',
			'/wasanderes' : 'Mold.Test2',
			'GET/super' :  '@fireevent',
			'/redirect' : '301->/'
		});


		var server = new Mold.Server.Server('127.0.0.1', '1137');
		
		server.use(router);

	}
)