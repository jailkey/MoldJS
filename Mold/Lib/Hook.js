Seed({
		name : "Mold.Lib.Hook",
		dna : "class",
		author : "Jan Kaufmann"
	},
	function(){
		var _hooks = {};
		this.publics = {
			addHook : function(name, parameter){
				var output = false;
				if(_hooks[name]){
					for(var i = 0; i < _hooks[name].length; i++){
						output = _hooks[name][i](parameter);
					}
				}
				return output;
			},
			onHook : function(name, callback){
				if(!_hooks[name]){
					_hooks[name] = [];
				}
				_hooks[name].push(callback);
			}
		}
	}
);