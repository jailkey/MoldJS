Seed({
		name : "Mold.Server.Middleware",
		dna : "class"
	},
	function(name, action, conf){

		var _config = conf;

		this.publics = {
			name : name,
			action : action
		}
	}
)