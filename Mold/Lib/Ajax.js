Seed({
		name : "Mold.Lib.Ajax",
		dna : "class",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Promise"
		]
	},
	function(){
		
		var events = new Mold.Lib.Event(this),
			that = this,
			undefined;

		Mold.mixing(this, events);

		this.publics = {

			get : function(url, data){
				
				var promise = new Mold.Lib.Promise(function(fulfilled, rejected){

					events.on("ajax.get.success", function(value){
						fulfilled(value);
					}).on("ajax.error", function(value){
						rejected(value);
					});
					
					that.send(url, data, { method : "GET" });

				});

				return promise;
			},
		
			send : function(url, data, config){
				var xhr; 

				config = config || {};
				config.method = config.method || "GET";
				
				if(typeof XMLHttpRequest !== 'undefined'){
					var xhr = new XMLHttpRequest();  
				}else {  
					var versions = [
						"MSXML2.XmlHttp.5.0",  
						"MSXML2.XmlHttp.4.0",  
						"MSXML2.XmlHttp.3.0",  
						"MSXML2.XmlHttp.2.0",  
						"Microsoft.XmlHttp"
					];  
					for(var i = 0, len = versions.length; i < len; i++) {  
						try {  
							var xhr = new ActiveXObject(versions[i]);  
							break;  
						} catch(e){
						
						}  
					}
				}  
				
				xhr.onreadystatechange =  function () {  
					var jsonData = false,
						contentType = false;

					if(xhr.readyState < 4) {
						switch(xhr.readyState){
							case "0":
								events.trigger("ajax.not.initialized", { xhr : xhr });
								break;
							case "1":
								events.trigger("ajax.connection.established", { xhr : xhr });
								break;
							case "2":
								events.trigger("ajax.request.received", { xhr : xhr });
								break
							case "3":
								events.trigger("ajax.request.processing", { xhr : xhr });
								break
						}
						return;  
					}  
					if(xhr.status !== 200) {
						events.trigger("ajax.error", { xhr : xhr });
						return;  
					}  
					
					
					if(xhr.readyState === 4) {

						if(typeof xhr.getResponseHeader === "function"){
							contentType = xhr.getResponseHeader('Content-Type');
						}

						switch(contentType){
							case "application/json":
								jsonData = JSON.parse(xhr.response);
								break;
							default:
								break;
						}
    						
						
						if(config.method === "GET"){
							events.trigger("ajax.get.success", { xhr : xhr, json : jsonData });
						}else if(config.method === "POST"){
							events.trigger("ajax.post.success", { xhr : xhr, json : jsonData });
						}else if(config.method === "DELETE"){
							events.trigger("ajax.delete.success", { xhr : xhr, json : jsonData });
						}else if(config.method === "PUT"){
							events.trigger("ajax.put.success", { xhr : xhr, json : jsonData });
						}
					}  
				} 
				
				xhr.open(config.method, url, true);
					
				if(config && config.isFile){
					
					xhr.upload.addEventListener("progress", function (e){
						events.trigger("ajax.progress", { xhr : xhr, status : e });
					});
					xhr.send(data);  
					
				}else{

					xhr.setRequestHeader ('Content-Type', 'application/x-www-form-urlencoded');
					xhr.send("data="+data);  
				
				}
			} 
		}
	}
	
);