Seed({
		name : "Mold.Lib.Ajax",
		dna : "class",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(){
		var events = new Mold.Lib.Event(this);
		Mold.mixing(this, events);
		
		this.publics = {
		
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
						try{
    						var jsonData = JSON.parse(xhr.response);
    					}catch(e){
    						var jsonData = false;
    					}
						
						if(config.method === "GET"){
							events.trigger("ajax.get.success", { xhr : xhr, json : jsonData });
						}else if(config.method === "POST"){
							events.trigger("ajax.post.success", { xhr : xhr, json : jsonData });
						}
					}  
				} 
				
				if(config && config.method === "POST"){
					console.log("POST");
					xhr.open('POST', url, true);
				}else{
					xhr.open('GET', url, true);
				}
					
				if(config && config.isFile){
					console.log("data", data);
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