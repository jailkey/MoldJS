Seed({
		name : "Mold.Defaults.TemplateDirectives",
		dna : "data",
		include : [
			'Mold.Lib.Element'
		]
	},
	{
		/*Add InlineEventhadling in Templates*/
		moldevent : {
			at : "attribute",
			name : "mold-event",
			action : function(node, element, template, index){

				var handler =  node.nodeValue.split(":")[0],
					moldEvent = node.nodeValue.split(":")[1],
					template = new Mold.Lib.Element(element).getTemplate();
			
				
				new Mold.Lib.Event(element).on(handler, function(e){
					var data ={
						e : e,
						element : this,
						index : index
					}
					if(template){
						template.triggerEvent(moldEvent, data);
					}
				})
			}
		},

		//IE Workaround for setting styles with template vaiablen
		moldstyle : {
			at : "attribute",
			name : "mold-style",
			action : function(node, element, template, index){


				var _appendStyle = function(element, style){
					var styles = style.split(';'),
						len = styles.length,
						i = 0;

					for(; i < len; i++){
						var parts = styles[i].split(':')
						element.style[Mold.trim(parts[0])] = Mold.trim(parts[1]);
					}
				}
	
				Mold.watch(element, 'mold-style', function(property, oldavalue, value){
					_appendStyle(element, value);
				});
	

				
			}
		},
		//Add data hanling for forms in Templates
		moldata : {
			at : "attribute",
			name : "mold-data",
			action : function(node, element, template, index){

				var viewModel = node.nodeValue,
					template = new Mold.Lib.Element(element).getTemplate();

				if(
					element.nodeName.toLowerCase() === "input"
					|| element.nodeName.toLowerCase() === "textarea"
				){
					var oldelement = element;
					element = new Mold.Lib.Element(element);

					var name = element.attr("name"),
						template = element.getTemplate();

					if(element.attr("type") === "checkbox"){

						element.on("change", function(e){
							if(this.checked){
								template.viewModel.set(viewModel, name, element.value)
							}else{
								template.viewModel.set(viewModel, name, false)
							}
						});

					}else{

						var valueNode = element.getAttributeNode("value");

						/*Set default value*/
						if(template.hasVar(element.value)){
							template.viewModel.set(viewModel, name, "");
						}else{
							template.viewModel.set(viewModel, name, element.value);
						}

						/*Watch nodevalue*/
						Mold.watch(valueNode, "nodeValue", function(property, oldavalue, value){
						
							template.viewModel.set(viewModel, name, value);
							return value;
						});

						/*Watch value*/
						/*
						Mold.watch(element, "value", function(property, oldavalue, value){
							console.log("set Value", value, oldavalue);
							template.viewModel.set(viewModel, name, value);
							return value;
						});*/

						/*Watch on change*/
						element.on("change", function(e){
							console.log("change", element.val(), e)
							template.viewModel.set(viewModel, name, element.val());
						});

						/*Warch keyup*/
						element.on("keyup", function(e){
							console.log("keyup", element.val(), e, element)
							template.viewModel.set(viewModel, name, element.val())
						});
					
					}
				}else{
					if(element.dataset){
						template.on("ready", function(){
							Mold.each(element.dataset, function(data, key){
								
								if(template.viewModel){
									console.log("template", template, viewModel, key, data);
									template.viewModel.set(viewModel, key, data);
								}
							});

						});
					}
				}
			}
		}

	}
)