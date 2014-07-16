"use strict";
Seed({
		name : "Mold.Lib.File",
		dna : "class",
		polymorph : true,
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

		}else{
			var ajax = new Mold.Lib.Ajax();
			ajax.on("ajax.get.success", function(e){
				_content = e.data.xhr.responseText;
				_that.trigger("content.loaded", { content : _content})
			});
			ajax.on("ajax.error", function(){
				_that.trigger("content.error");
			});
			ajax.send(filepath);
		}

	


		this.publics = {
			content : function(callback){
				_that.at("content.loaded", function(e){
					callback.call(null, e.data.content);
				});
			},
			error : function(callback){
				_that.at("content.error", callback);
			}
		}
	}
)