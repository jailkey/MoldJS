Seed({
		name : "Mold.Lib.Component",
		dna : "class",
		include : [
			"Mold.Lib.Directive",
			"Mold.Lib.Loader",
			"Mold.Lib.Event",
			"Mold.Lib.Observer"
		]
	},
	function(seed){

		var _seed = seed,
			_that = this,
			_loader = new Mold.Lib.Loader(),
			_files = [];

		Mold.mixin(this, new Mold.Lib.Event(this));

		_loader.on("ready", function(){
			_that.trigger("files.loaded")
		});

		_loader.on("error", function(){
			_that.trigger("files.error")
		});

		_loader.on("process", function(e){
			_that.trigger("files.loading", e.data);
		});

		var _timer = false;

		this.publics = {
			directive : function(directive){
				directive.seed = _seed;
				Mold.Lib.Directive.add(directive, document);

			},
			files : function(file){
				if(file && file.length > 0){
					_loader.append(file);
					if(!_loader.isLoading()){
						_loader.load();
					}
					if(Mold.isArray(file)){
						_files = _files.concat(file)
					}else{
						_files.push(file)
					}
				}
				return _files;
			}
		}
	}
)