Seed (
	{ 
		name : "Mold.Lib.Parents",
		dna : "class",
		author : "Jan Kaufmann",
		description : "",
		include : [
		
		],
		version : 0.1
	},
	function(){

		var _registerdParents = [];

		this.publics = {

			addParent : function(parent){
				_registerdParents.push(parent);
				return this;
			},

			removeParent : function(parent){
				for(var i = 0; i < _registerdParents.lenght; i++){
					if(_registerdParents[i] === parent){
						_registerdParents.splice(i, 1);
						break;
					}
				}
				return this;
			},

			getParents : function(){
				return _registerdParents;
			},

			hasParents : function(){
				console.log(this, _registerdParents)
				if (_registerdParents.length > 0){
					return true;
				}else{
					return false;
				}
			},

			eachParent : function(callback){
				for(var i = 0; i < _registerdParents.length; i++){
					callback(_registerdParents[i]);
				}
				return this;
			}

		}
	}
);