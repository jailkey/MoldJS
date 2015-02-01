Seed({
		name : 'Mold.Lib.EventTrap',
		dna : 'class',
		include : [
			'Mold.Lib.Event'
		]
	},
	function(properties){

		var _exec = false,
			_that = this,
			_note = false;
		
		Mold.mixin(this, new Mold.Lib.Event(this));

		Mold.each(properties, function(value, name){
			value.on(name, function(){
				_that.trigger('change');
			});

		});
	

		this.publics = {
			note : function(callback){
				_note = callback;
				return this;
			},
			execute : function(data){
				return _note.apply(this, arguments);
			}
		}
	}
)