Seed({
		name : "Mold.MyClass",
		dna : "class",
		test : "Mold.MyTest"
	},
	function(){

		var _myValue = 42;

		this.publics = {
			getValue : function(){
				return _myValue;
			},
			setValue : function(value){
				_myValue = value;
			}

		}
	}
);