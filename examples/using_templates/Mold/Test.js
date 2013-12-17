Seed(
	{ 
		name : "Mold.Test",
		dna : "controller",
		include : [
			"external->Mold.DNA.Controller",
			"external->Mold.Lib.Template",
			"external->Mold.Lib.Color",
			"external->Mold.Lib.DomScope",
			"external->Mold.Lib.TemplateDirective",
			"Mold.TestView",
			"Mold.TestModel"
		]
	},
	function(){
		console.log("init")
		var color = Mold.Lib.Color;

		Mold.Lib.TemplateDirective.add({
			at : "element",
			name : "x-special",
			seed : "Mold.TestView",
			replace : true,
			collect : [
				{
					element : "img",
					name : "image",
					childs : [
						{ attribute : "src" },
						{ attribute : "title" }
					]
				},
				{
					attribute : "attr"
				}
			],
			action : function(){
				console.log("do action")
			}
		});


		var template = new Mold.Lib.Template(function(){
			/*|				
				as{{hans}}{{peter}}<div class="test">{{vorname}}</div>
				<input name="q" value="" mold-data="search" mold-event="keyup:@search">
				<ul>
				{{#list}}
					<li class="test" style="background-color:{{background}};{{#color}}color:{{.}};{{/color}}{{^color}}color:#00ff00;{{/color}}font-size:{{size}}">
						{{text}}
					
					</li>
				{{/list}}
				</ul>
				{{#name}}
					<div class="test">{{.}}</div>
					{{#nachname}}
						1. {{nachname}}	
					{{/nachname}}
				{{/name}}
				<br>
			
				<ul>
				{{#adress|search:number,plz|max:5}}
				<li>
					{{number}}<br>
					{{plz}}<br>

					{{#nocheineliste}}
						<div>
							{{valuelu}}
						</div>
					{{/nocheineliste}}
					sasdasd

					INHALT IN ADRESSE
					
					{{testzwei}}</li>
				{{/adress}}
				</ul>

				<x-special attr="irgenwas">
					<img src="/bildpfad" title="Ein Titel">
					<img src="/bildpfad" title="Ein anderes Bild">
				</x-special>

				<x-panel>
					<x-tab title="irgendwas">
						Inner HTML 
						<div class="lalal">		
							xontentS
						</div>
					<x-tab>
				</x-panel>
			|*/
		});



	

		template.snatch({
			"@addSomething" : function(data){
				console.log(data)
				return false;
			}
		});



		var content = template.get();
		console.log(content);


		document.querySelector(".template-target").appendChild(content)
		
		window.tree = template.tree();

		var model = new Mold.TestModel();

		//model.data.name = "Hans"

		//model.data.nachname = "TEST"

		var t_start, t_end;
		template.bind(model);
		
		model.data.list.push(
			{ text : "irgendwas", background : "#555888", number : Math.round(Math.random()*5) }
		);




		template.on("search", function(e){
			console.log("dosearch")
		//	template.bind(model);
		})


		template.once("viewmodel.change", function (e){
			template.applyFilter(template.tree().childs[0].adress);
		});


		var elementCount = 10;

		window.setTimeout(function(){

			t_start = new Date().getTime();
			for(var i = 0; i < elementCount; i++){

				
				model.data.adress.push(
					{ number : i + ".", plz : Math.round(Math.random()*5) }
				)
			}
			t_end = new Date().getTime();
		
			console.log("executed in:", (t_end - t_start));
			
		}, 50);	


		



		window.model = model;

		


		//var newScope = new Mold.Lib.DomScope(document);

		
		//console.log("scope", newScope)


		this.actions = {
			"@setname" : function(e){
				//userModel.data.name = e.data.urlparameter.name;
				//userModel.data.vorname = e.data.urlparameter.vorname;
				//console.log("setname", e)
			}

		}
	}
);