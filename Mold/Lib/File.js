"use strict";
Seed({
		name : "Mold.Lib.File",
		dna : "class",
		platform : "isomorph",
		include : [
			"Mold.Lib.Ajax",
			"Mold.Lib.Event"
		]
	},
	function(filepath){

		var _content = false;
		var _that = this;

		Mold.mixin(this, new Mold.Lib.Event(this));

		if(Mold.isNodeJS){
			var fs = require("fs");
			var path = Mold.LOCAL_REPOSITORY + filepath;
			if(fs.existsSync(path)){
				fs.readFile(path, 'utf8', function (error, data) {
		
					if(error){
						_that.trigger("content.error", { error : error });
					}else{
						_that.trigger("content.loaded", { content : data})
					}
				});
			}else{
				_that.trigger("content.error", { error : "File not found: " + path });
			}
		}else{
			var ajax = new Mold.Lib.Ajax();
			ajax.on("ajax.get.success", function(e){
				_content = e.data.xhr.responseText;
				_that.trigger("content.loaded", { content : _content})
			});
			ajax.on("ajax.error", function(e){
				_that.trigger("content.error", e.error);
			});
			ajax.send(filepath);
		}


		this.publics = {
			content : function(callback){
				_that.at("content.loaded", function(e){
					callback.call(null, e.data.content);
				});
				return this;
			},
			error : function(callback){
				_that.at("content.error", function(e) { callback.call(null, e.error) });
				return this;
			}
		}
	}
)