Seed({
		name : "Mold.Lib.Stack",
		dna : "class",
		version : "0.0.1",
		include : [
			"Mold.Lib.Event"
		]
	},
	function(config){

		config = config || {}

		var _stack = [];
		var _parallel = config.parallel || 1;
		var _nextCalled = 0;

		Mold.mixin(this, new Mold.Lib.Event(this))

		this.publics = {
			next : function(){
				_nextCalled++;
				if(_nextCalled === _parallel && _stack.length){
					for(var i = 0; i < _parallel; i++){
						var exec = _stack.shift();
						if(exec){
							exec.call(exec);
						}else{
							this.trigger("ready");
							break;
						}
					}
					_nextCalled = 0;
				}
			},
			add : function(callback){
				_stack.push(callback);
			}

		}
	}
);