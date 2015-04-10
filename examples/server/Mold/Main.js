Seed({
		name : "Mold.Main",
		dna : "server",
		include : [
			"->Mold.DNA.Server",
			"->Mold.Lib.Mongo"
		],
		config : {
			ip : '127.0.0.1',
			port : '1137',
			indexFile : 'index.html',
			maxRequestSize : '',
			maxUploadSize : "5MB",
			uploadDir : ''
		},
		routes : {
			'/test/:name/:id' : 'Mold.Test',
			'/wasanderes' : 'json|Mold.Test2',
			'GET/data/:id' :  'Mold.Test|@get.data',
			'GET/data' :  'Mold.Test|@getall.data',
			'POST/data' :  'urlencode|Mold.Test|@insert.data',
			'PUT/data/:id' :  'Mold.Test|@update.data',
			'DELETE/data/:id' :  'Mold.Test|@delete.data',
			'/redirect' : '301:/',
			'/sendform' : 'multipart|Mold.Test2',
		}
	},
	{	
		startup : function(shared){

			//use shared object for connection database etc.
			shared.database = new Mold.Lib.Mongo();
			shared.database.connect('mongodb://localhost/test');
	
			console.log("startup")
		},
		process : function(server){
			//you can inject middlewars. etc at the process
			console.log("run")
		},
		end : function(){
			//call if server ends
			console.log("end")
		}
	}
)