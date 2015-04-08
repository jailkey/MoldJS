Seed({
		name : "Mold.Server.Middlewares.MultipartParser",
		dna : "middleware",
		platform : "node",
		include : [
			"Mold.DNA.Middleware",
			"Mold.Lib.Header"
		],
		npm : {
			"multiparty" : "latest"
		}
	},
	function(){

		return function(req, res, next){
			if(req.body){
				throw new Error("Request body is already defined!")
			}
			var header = new Mold.Lib.Header(req.headers);


			if(header.get("content-type") !== "multipart/form-data"){
				throw new Error("Can only parse content-type multipart/form-data as multipart!")
			}
	
			var multiparty = require('multiparty');
			req.body =  {};

			var options = {}

			if(req.config.maxUploadSize){
				options.maxFilesSize = req.config.maxUploadSize;
			}

			if(req.config.uploadDir){
				options.uploadDir = req.config.uploadDir;
			}

			var form = new multiparty.Form(options);

			form.parse(req, function(err, fields, files){
				
				Mold.each(fields, function(value, name){
					req.body[name] = value[0];
				});

				Mold.each(files, function(value, name){
					Mold.each(value, function(file){
						req.body[file.fieldName] = file;
					});
					
				});

				if(err){
					res.serverError(err);
				}

				next();
			})
	
			
		}
	}
);