Seed(
	{ 
		name : "Mold.Test",
		dna : "controller",
		include : [
			"external->Mold.DNA.Controller",
			"external->Mold.Lib.Template",
			"external->Mold.Lib.Color",
			"Mold.TestModel"
		]
	},
	function(){
		var color = Mold.Lib.Color;
		var template = new Mold.Lib.Template(function(){
			/*|				
				as{{hans}}{{peter}}<div class="test">{{vorname}}</div>
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
				{{#nachname}}
					IN NACHNAME
					<br>

					2. {{.}}
					{{./name}}	
					<div class="irgendwas">
						childinhalte
						{{#was}}
								NOCHWAS
						{{/was}}
					</div>

					<br>
				{{/nachname}}
				<br>
				{{^nachname}}
					3. Kein Nachname! 
					{{this.list.test}}
				{{/nachname}}
				
				{{nachname}}

				
				<a href="#" mold-event="click:@addSomething">Hier noch ein Link</a>

				<input name="test" mold-data="query" value="" type="text" />

				<textarea name="testarea" mold-data="query"></textarea>
				<ul>
				{{#adress}}
				<li>
					<div class="test">{{number}}</div>
					<div class="test">{{plz}}</div>

					{{#nocheineliste}}
						<div>
							{{valuelu}}
						</div>
					{{/nocheineliste}}
					sasdasd

					INHALT IN ADRESSE
					
					{{testzwei}}
				</li>
				{{/adress}}
				</ul>
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
			{ text : "irgendwas", background : "#555888" }
		);

		var elementCount = 10;

//		model.data.list[0].background = "#888111";

		
	//	window.setTimeout(function(){
		/*
			t_start = new Date().getTime();		
			for(var i = 0; i < elementCount; i++){	
				tree.childs[0].list.add();
				tree.childs[0].list.childs[i].background.setValue("#efefef")
			}
			t_end = new Date().getTime();
			var endTime = (t_end - t_start);
			console.log("executed in:", endTime, "per Line", endTime / elementCount);
*/
	//	}, 1000);
/*
			window.setTimeout(function(){
				t_start = new Date().getTime();		
				for(var i = 0; i < elementCount; i++){	
					tree.childs[0].adress.childs[i].number.setValue("------------------");
				}
				t_end = new Date().getTime();
				var endTime = (t_end - t_start);
				console.log("executed in:", endTime, "per Line", endTime / elementCount);
			}, 3000)
		
		
			var newModel = model.data.list.slice(5, 7);
			console.log("neModel", newModel)
*/
		window.setTimeout(function(){

			t_start = new Date().getTime();
			for(var i = 0; i < elementCount; i++){
				
				model.data.adress.push(
					{ number : i + ".", plz : "irgendwas"}
				)
			}
			t_end = new Date().getTime();
		
			console.log("executed in:", (t_end - t_start));
			
		}, 50);	

/*

		window.setTimeout(function(){
			t_start = new Date().getTime();
			var parentElement = document.createElement("div");
			for(var i = 0; i < elementCount; i++){
				var element = document.createElement("div");
				element.innerHTML = i+".";
				element.style.backgroundColor = "#"+Math.floor(Math.random()*16777215).toString(16);
				element.style.fontSize =  Math.floor(Math.random()*30) +"px";
				parentElement.appendChild(element)
			}

			document.querySelector(".template-target").appendChild(parentElement);
			t_end = new Date().getTime();
			console.log("executed in:", (t_end - t_start));
		}, 3000);
		*/
	
		/*
		t_start = new Date().getTime();

		model.data.list.splice(300, 500,
			{ test : "INSERTED", background : '#'+Math.floor(Math.random()*16777215).toString(16), size : "40px" },
			{ test : "INSERTED", background : '#'+Math.floor(Math.random()*16777215).toString(16), size : "40px" }
		);

		t_end = new Date().getTime();
		console.log("executed in:", (t_end - t_start));
		*/
		/*
		window.setTimeout(function(){
			t_start = new Date().getTime();
			model.data.list.reverse()

			t_end = new Date().getTime();
			console.log("executed in:", (t_end - t_start));
			//model.data.list[0] = { "test" : "last", "background" : "#ff00ee" };
		}, 2000);
		*/
		console.log("model->", model)

		//console.log("template->", )
		



		window.model = model;

		
/*
		

		userModel.on("change", function(e){
			template.append(e.data.data);
		});


		userModel.data.name = "Hanswurdst";

		userModel.data.vorname = "vorname";
	
		userModel.data.list.push({ "test" : "irgendwas" })
		
*/

	//	window.model = userModel;

		this.actions = {
			"@setname" : function(e){
				//userModel.data.name = e.data.urlparameter.name;
				//userModel.data.vorname = e.data.urlparameter.vorname;
				//console.log("setname", e)
			}

		}
	}
);