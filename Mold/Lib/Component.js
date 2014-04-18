Seed({
		name : "Mold.Lib.Component",
		dna : "class",
		include : [
			"Mold.Lib.Directive",
			"Mold.Lib.Loader",
			"Mold.Lib.Event"
		]
	},
	function(seed){

		var _seed = seed,
			_that = this,
			_loader = new Mold.Lib.Loader();

		Mold.mixing(this, new Mold.Lib.Event(this));

		_loader.on("ready", function(){
			_that.trigger("files.loaded")
		});

		_loader.on("error", function(){
			_that.trigger("files.error")
		});

		_loader.on("process", function(e){
			_that.trigger("files.loading", e.data);
		});

		this.publics = {
			directive : function(directive){
				directive.seed = _seed;
				Mold.Lib.Directive.add(directive, document);
				
				new Mold.Lib.Event(document).on("DOMNodeInserted", function(){
					Mold.Lib.Directive.add(directive, document);
				});


				if(directive.at === "attribute"){
					new Mold.Lib.Event(document).on("attribute.modified", function(e){
						if(e.data.attr === directive.name){
							Mold.Lib.Directive.add(directive, document);
						}
					});
				}

			},
			files : function(file){
				if(file && file.length > 0){
					_loader.append(file);
					if(!_loader.isLoading()){
						_loader.load();
					}
				}
			}
		}
	}
)