Seed(
	{ 
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Lib.Template",
			"external->Mold.Lib.Model"
		]
	},
	function(){
	
		var template = new Mold.Lib.Template(function(){
			/*|
				<div>
					{{#linklist}}
						<a href="{{link}}">{{linktext}}</a>
					{{/linklist}}
				</div>
			|*/
		})

		var model = new Mold.Lib.Model({
			properties : {
				linklist : [
					{ 
						link : "string",
						linktext : "string"
					}
				]
			}
		})



		//
		template.bind(model);
		model.data.linklist.push({
			link : "http://www.meinlink.de",
			linktext : "Link 1",
		})

		model.data.linklist.push({
			link : "http://www.meinlink.de",
			linktext : "Link 2",
		})

		console.log(template.get().innerHTML);

		model.data.linklist.push({
			link : "http://www.meinlink.de",
			linktext : "more Links",
		})

		model.data.linklist.push({
			link : "http://www.meinlink.de",
			linktext : "Link 3",
		});

		console.log(template.get().innerHTML);

		//console.log(template.tree());
	}
);