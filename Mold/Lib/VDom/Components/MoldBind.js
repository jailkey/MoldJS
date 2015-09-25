Seed({
		name : "Mold.Lib.VDom.Components.MoldBind",
		dna : "component",
		include : [
			"->Mold.DNA.Component"
		],
		directives : [
			{
				at : "attribute",
				name : "mold-bind",
				//watchable : true,
				collect : {
					attribute : [
						"mold-bind"
					]
				}
			}
		]
	},
	function(node, element, collection){
		var path = element.moldModel.path;
		var model = element.moldModel.model;


		var initBinding = function(){
			
			if(path && model){
				switch(element.attr('type')){
					case "text":
						element.on("keyup", function(){
							console.log("path", path)
							model.set(path + "." + collection["mold-bind"], element.val());
						})
						break;
				}
			}
		}

		Mold.watch(element.moldModel, "model", function(name, value, newValue){
			console.log("init model", model)
			model = newValue;
			initBinding();
		})

		Mold.watch(element.moldModel, "path", function(name, value, newValue){
			console.log("init path", path)
			path = newValue;
			initBinding();
		})

		initBinding();
	}
);