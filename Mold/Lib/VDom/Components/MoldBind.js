/**
 * @description binds model data to an element
 * @example Mold/Test/Lib/Template#binding
 */
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


		var setData = function(data){
			if(element.val() !== data){
				element.val(data);
			}
		}

		var bindingName = collection["mold-bind"];
	
		var initBinding = function(){
			
			if(path && model){

				if(~bindingName.indexOf('.')){
					var subPath = bindingName.substring(0, bindingName.indexOf('.'))
					var modelName = bindingName.substring(bindingName.indexOf('.') + 1, bindingName.length);
				}else{
					var modelName = bindingName;
				}
				switch(element.attr('type')){

					case "range":
					case "radio":
					case "checkbox":
						element.on("change", function(){
							console.log("value", element.val())
							model.set(path + "." + collection["mold-bind"], element.val());
						})
						break;

					default :
						element.on("keyup", function(){
							model.set(path + "." + collection["mold-bind"], element.val());
						})
						break;
				}

				if(element.tagName.toLowerCase() === "select"){
					element.on("change", function(){
						console.log("value", element.val())
						model.set(path + "." + collection["mold-bind"], element.val());
					})
				}

				model.on(path + ".changed", function(e){

					setData(e.data[modelName]);
				})

			
				if(subPath){
					var data = model.get(path + "." + subPath);
				}else{
					var data = model.get(path);
				}

				setData(data[modelName]);
			}
		}

		

		Mold.watch(element.moldModel, "model", function(name, value, newValue){
			model = newValue;
			initBinding();
		})

		Mold.watch(element.moldModel, "path", function(name, value, newValue){
			path = newValue;
			initBinding();
		})

		initBinding();
	}
);