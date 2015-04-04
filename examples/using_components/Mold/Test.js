Seed({
		name : "Mold.Test",
		dna : "component",
		include : [
			"->Mold.DNA.Component",
			{ Element : "->Mold.Lib.Element" }
		],
		files : [
			"1.jpg",
			"2.jpg"
		],
		register : 'all',
		directives : [
			{
				at : "element",
				name : "x-imagelist",
				watchable : true,
				collect : {
					attribute : [
						"show"
					]
				} 
			}
		]
	},
	function(node, element, collection, component){

		//show loading if images will load
		element.val("loading");

		//create image element
		var image = new Element("img");

		//define component method
		element.addMethod('setImage', function(path){
			image.src = path;
			element.append(image);
		})

		this.actions = {
			//if all images loaded set default
			"@files.loaded" : function(){
				element.val('');
				element.setImage(component.files()[collection.show || 0]);
			},

			//change immage if attribute change
			"@show.changed" : function(){
				element.setImage(component.files()[collection.show])
			}
		}
	}
)