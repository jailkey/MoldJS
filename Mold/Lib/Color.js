;Seed({
		name : "Mold.Lib.Color",
		dna : "static",
		version : "0.0.1"
	},
	function(){

		return {
			randomColor : function(){
				return '#'+Math.floor(Math.random()*16777215).toString(16);
			}
		}
	}
);