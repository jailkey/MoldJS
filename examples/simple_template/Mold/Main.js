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
				{{#list}}
				<div class="irgendwas">
					{{myproperty}}
				</div>
				{{/list}}
			|*/
		});

		//add some content
		template.append({
			list : [
				{ myproperty : "some value"},
				{ myproperty : "some wasad asd"},
				{ myproperty : "somessssss"}
			]
		});

		console.log(" template.",  template.tree())
		console.log("html", template.get().innerHTML)

		//append to document
		//document.body.appendChild(template.get());

	
	}
);
