﻿Seed({
		name : "Mold.Lib.Ajax",
		dna : "class",
		author : "Jan Kaufmann",
		include : [
			"Mold.Lib.Event",
			"Mold.Lib.Promise",
			"Mold.Lib.Header"
		]
	},
	function(ajaxConf){
		
		var events = new Mold.Lib.Event(this),
			that = this,
			ajaxConf = ajaxConf || {},
			undefined;

		Mold.mixin(this, events);

		this.publics = {


			get : function(url, data){
				
				return new Mold.Lib.Promise(function(fulfilled, rejected){

					events.on("ajax.get.success", function(value){
						fulfilled(value);
					}).on("ajax.error", function(value){
						rejected(value);
					});
				
					that.send(url, data, { method : "GET"});

				});
			},

			post : function(url, data, type){
				return  new Mold.Lib.Promise(function(fulfilled, rejected){

					events.on("ajax.post.success", function(value){
						fulfilled(value);
					}).on("ajax.error", function(value){
						rejected(value);
					});
					
					type = type || 'text';
					that.send(url, data, { method : "POST", type : type});

				});
			},

			put : function(){

			},

			del : function(){

			},
		
			send : function(url, data, config){
				var xhr; 

				url = (ajaxConf.serverPath) ? ajaxConf.serverPath + url : url;
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
						events.trigger("ajax.error."+xhr.status, { xhr : xhr });
						return;  
					}  
					
					
					if(xhr.readyState === 4) {

						var header = new Mold.Lib.Header(xhr.getAllResponseHeaders());
						var data = xhr.response;
						switch(header.get('content-type')){
							case "application/json":
								jsonData = JSON.parse(xhr.response);
							default:
								break;
						}
						
						if(config.method === "GET"){
							events.trigger("ajax.get.success", { xhr : xhr, json : jsonData, data : data});
						}else if(config.method === "POST"){
							events.trigger("ajax.post.success", { xhr : xhr, json : jsonData, data : data});
						}else if(config.method === "DELETE"){
							events.trigger("ajax.delete.success", { xhr : xhr, json : jsonData, data : data});
						}else if(config.method === "PUT"){
							events.trigger("ajax.put.success", { xhr : xhr, json : jsonData, data : data});
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

					var sendFormat = 'plain';

					switch(config.type){
						case 'json':
							data = JSON.stringify(data);
							xhr.setRequestHeader ('Content-Type', 'application/json');
						
							break;
						case 'urlencoded':
							xhr.setRequestHeader ('Content-Type', 'application/x-www-form-urlencoded');	
							sendFormat = 'urlencoded';		
							break;
						default:
							xhr.setRequestHeader ('Content-Type', 'plain/text');
					}
					
				
					if(sendFormat === 'urlencoded'){
						xhr.send('data='+encodeURIComponent(data));
					}else{
						xhr.send(data);
					}
			
				}
			} 
		}
	}
	
);