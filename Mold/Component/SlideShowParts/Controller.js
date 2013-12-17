Seed ({
		name : "Mold.Component.SlideShowParts.Controller",
		dna : "controller",
		include : [
			"external->Mold.DNA.Controller",
			"external->Mold.Lib.Model",
			"Mold.Component.SlideShowParts.View"
		]
	},
	function(config){

		var model = new Mold.Lib.Model({
			properties : {
				slidevalues : [
					{ value : "string" }
				]
			}
		});

		var view = this.register(new Mold.Component.SlideShowParts.View());

		view.bind(model);

		console.log("model", model)
		//element.getElementsByTagName()

		console.log("controller instance", this);

		this.actions = {

		}

		this.publics = {
			addItem : function(element){
				model.data.slidevalues.push({ value : element });
			}
		}
	}
)
