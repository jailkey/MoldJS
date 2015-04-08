Seed({
		name : "Mold.Main",
		dna : "server",
		include : [
			"->Mold.DNA.Server",
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
			'GET/super' :  'Mold.Test|@fireevent',
			'/redirect' : '301:/',
			'/sendform' : 'multipart|Mold.Test2',
		}
	},
	{	
		startup : function(server){
			//use for connection database etc.
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