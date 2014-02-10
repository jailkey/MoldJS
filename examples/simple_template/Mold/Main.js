Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Lib.Template"
		]
	},
	function(){

		//Create a Template with special function syntax
		var template = new Mold.Lib.Template(function(){
			/*|

				<div class="irgendwas">
					{{myproperty}}
				</div>
			|*/
		});

		//add some content
		template.append({ myproperty : "some value"});

		//append to document
		document.body.appendChild(template.get());

	
	}
);
