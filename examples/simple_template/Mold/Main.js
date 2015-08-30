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

		console.log(template)
		//add some content
		
		template.setData({
			list : [
				{ myproperty : "One"},
				{ myproperty : "Two"},
				{ myproperty : "Three"}
			]
		});

		//append to document
		template.appendTo(document.body);

		
	
	}
);
