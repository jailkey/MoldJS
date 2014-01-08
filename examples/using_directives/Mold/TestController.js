Seed({
		name : "Mold.TestController",
		dna : "controller",
		include : [
			"Mold.TestView",
			"external->Mold.DNA.Controller",
			"external->Mold.Lib.Observer"
		]
	},
	function(config){

		console.log("controller test", config);
		
		//var view = this.register(new Mold.TestView());
		var that = this;
		

		this.actions = {
			"@scope" : function(){
				console.log("scope is set", that.scope);
			}
		}


	}
)