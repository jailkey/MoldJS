Seed({
		name : "Mold.Test.Lib.Template",
		dna : "test",
		include : [
			{ Color : "Mold.Lib.Color" },
			{ Model : "Mold.Lib.Model" },
			{ Doc : "Mold.Lib.Document" }
		]
	},
	function(Template){

		timeout(5000);

		describe("Test Mold.Lib.Template", function(){
			var template, templateTwo, test = now(), dataModel;

			xit("create new template from multilinestring", function(go){

				template = new Template(function(){/*|
					<h1 class="topic">Überschrift</h1>
					<ul class="values" mold-name="mylist">
						{{#block}}
							<li style="background:{{color}}" export="list">{{i}} - {{value}}</li>
						{{/block}}

						{{^block}}
							<li>Keine Daten</li>
						{{/block}}
					</ul> 
					<a mold-event="click:@add.entry">Add Entry</a>
				|*/});

				//#appendTo
				template.tree.then(function(tree){
					if(!Mold.isNodeJS){
						
						template.appendTo(document.body)
						
					}else{
						var doc = new Doc();
						template.appendTo(doc.get())
					}
					go();
				})
				///#appendTo

			});

	//model data
			xit("bind model and add and remove data", function(){

				it("add model to template", function(){
					dataModel = new Model({
						block : [
							{ 
								i : "number",
								value : "string",
								color : "string"
							}
						]
					});
					
				})

				it("add model data with push", function(done){
					var test = now();
					var data = [];
					for(var i = 0; i < 10; i++){
						data.push({
							i : "c" + i ,
							value : "start",
							color : Color.randomColor()
						})
					}
				
					dataModel.data.block.push.apply(dataModel.data.block, data);
					template.connect(dataModel);
					
					var testRendert = function(e){
						var tree = e.data.tree;
						if(tree.dom.children.block[0].children.length === 10){
							template.off("renderd", testRendert)
							done();
						}
					}
					template.on("renderd", testRendert)
				});


				it("change property values", function(done){
					var testRendert = function(e){
						if(e.data.tree.dom.children.block[0].children[0].value.data === "Neu Inhalte"){
							template.off("renderd", testRendert)
							done()
						}
					}

					template.on("renderd", testRendert)

					for(var i = 0; i < 10; i++){
						dataModel.data.block[i].color = Color.randomColor();
						dataModel.data.block[i].value = "Neu Inhalte";
					}
					
				})

				it("remove model data", function(done){
					console.log("remove")
					var testRendert = function(e){
						if(e.data.tree.dom.children.block[0].children.length === 0){
							template.off("renderd", testRendert)
							//done()
						}
					}
					
					template.on("renderd", testRendert)

					dataModel.data.block.splice(0, 30);
					setTimeout(function(){
						done();
					}, 1000)
				});

				it("add model data again", function(done){
					
					var testRendert = function(e){
						if(e.data.tree.dom.children.block[0].children.length === 5){
							template.off("renderd", testRendert)
							
						}
					}
					
					template.on("renderd", testRendert)
					
					for(var i = 0; i < 5; i++){
						dataModel.data.block.push({
							i : "a" + i + 2,
							value : "NEU",
							color : Color.randomColor()
						})
					}
					setTimeout(function(){
						done();
					}, 1000)
				});



				it("change model data with splice", function(done){

					var testRendert = function(e){
						if(e.data.tree.dom.children.block[0].children.length === 25){
							template.off("renderd", testRendert)
							done();
						}
					}
					
					template.on("renderd", testRendert)

					var data = [];
					for(var i = 0; i < 20; i++){
						data.push({
							i : "D" + i ,
							value : "sehr viel später",
							color : Color.randomColor()
						})
					}
					
					dataModel.data.block.splice.apply(dataModel.data.block, [5, 0].concat(data));
					
				});

				it("remove all model data", function(done){

					var testRendert = function(e){
						if(e.data.tree.dom.children.block[0].children.length === 0){
							template.off("renderd", testRendert)
							done();
						}
					}
					
					template.on("renderd", testRendert)
					
					dataModel.data.block.splice(0, 5030)
					
				});

			});

			xit("tests another configuration", function(){
				var templateTwoTree = false, modelTwo = false;

				it("create new template with nested blocks", function(go){

					templateTwo = new Template(function(){/*|
						<h1 class="topic">Überschrift</h1>
						<ul class="values mold-name="mylist">
							{{#block}}
								<li>
									{{#subblock}}
										test
										<div style="background:{{background}}"> {{subitem}} </div>
									{{/subblock}}
									{{^subblock}}
										subblock is not defined!
									{{/subblock}}
								</li>
							{{/block}}

							{{^block}}
								<li>Keine Daten</li>
							{{/block}}

							{{#block|exists}}
								Exists
							{{/block}}

							{{#list}}
								<li>{{.}}</li>
							{{/list}}
						</ul> 
					|*/});

					templateTwo.tree.then(function(tree){
						templateTwoTree = tree;
						if(!Mold.isNodeJS){
							templateTwo.appendTo(document.body)
						}else{
							var doc = new Doc();
							templateTwo.appendTo(doc.get())
						}
						go();
					})
				});

				it("add data with subblock ", function(done){
					
					var data = {
						block : []
					}

					for(var i = 0; i < 3; i++){
						var subdata = []
						for(var y = 0; y < 3; y++){
							if(i !== 1){
								subdata.push({
									subitem : (y === 2) ? "last" : Math.random(),
									background : Color.randomColor()
								});

							}else{
								subdata = false;
							}
						}
						data.block.push({
							subblock : subdata
						})
					}
			
					templateTwo.setData(data);

					templateTwo.on("renderd", function(e){
						if(templateTwoTree.dom.children.block[0].children.length === 3){
							expect(templateTwoTree.dom.children.block[0].children[2].subblock[0].children[2].subitem.data).toBe("last")
							done();
						}
					})
				})

				it("removes the data", function(){
					templateTwo.setData(false);
				})

				//#connect
				it("adds a model and some data", function(){

					modelTwo = new Mold.Lib.Model({
						block : [ 
							{
								subblock : [
									{
										background : "string",
										subitem : "string"
									}
								]
							}
						],
						list : []
					});

					templateTwo.connect(modelTwo);

					modelTwo.data.block.push({
						subblock : [
							{ background : Color.randomColor(), subitem : "one"},
							{ background : Color.randomColor(), subitem : "two"},
							{ background : Color.randomColor(), subitem : "three"},
						]
					})

					templateTwo.on("renderd", function(e){
						if(templateTwoTree.dom.children.block[0].children.length === 3){

						}
					})
				})
				///#connect

				it("removes the data from model", function(){
					modelTwo.data.block = [];
				})

				it("read some", function(){
					modelTwo.data.block.push({
						subblock : [
							{
								background : Color.randomColor(),
								subitem: "test"
							}
						]
					});
				});

				xit("add data to the list ", function(){
					modelTwo.data.list.push("SOME DATA")
					modelTwo.data.list.push("MORE DATA")
				});
			});


			xit("tests a template with nested propertys with the same name and without html", function(){
				var templateTwoTree = false, modelTwo = false;
				it("create a really big new template", function(){

					templateTwoTree = new Template(function(){/*|
							#{{name}}
							---------------------------------------

							file: {{url}}  
							dna: {{dna}}
					
							{{#author}}author: {{author}}{{/author}}
							{{#version}}version: {{version}}{{/version}}
							{{#description}}
								{{description}}
							{{/description}}
							
							###Dependencies
							{{#include}}
							* [{{name}}]({{path}}.md) {{/include}}
							

							{{#example}}
							###Example
							--------------
							*{{path}}*

							```
							{{code}}
							```
							
							{{/example}}
							
							###Methods
							{{#methods}}
							#####{{name}}
								{{description}}  
							Defined in row: {{line}}   
							{{#parameter|exists}}Arguments: {{/parameter}}
							{{#parameter}}
							* __{{name}}__ (_{{type}}_) - {{description}} {{/parameter}}
							{{#return}}returns: {{return}}{{/return}}

							{{#example}}
								hier example und so
								{{path}}
							{{/example}}

							{{/methods}}

							###Properties
							{{#properties}}
							#####{{name}}
								{{description}}  
							Defined in row: {{line}}  
							{{#return}}returns: {{return}}{{/return}}
							{{/properties}}
					
							###Objects
							{{#objects}}
							#####{{name}}
							Defined in row: {{line}}  
							Parameter: {{^parameter}}no{{/parameter}}
							{{#parameter}}
							* __{{paraname}}__ (_{{type}}_) - description: {{description}}
							{{/parameter}}
							returns: {{return}}
							{{/objects}}
					|*/}, { renderAsString : true});

					
				});

				it("add data", function(go){
					var data = {
						"name": "Mold.Lib.Template",
						"url": "/Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/Template.js",
						"parts": [],
						"properties": [],

						"methods": [
							{
								"parameter": [],
								"private": true,
								"public": false,
								"property": false,
								"object": false,
								"method": true,
								"module": false,
								"name": "_connector",
								"description": "collection of methods to bind a model to the template",
								"type": "{Object}",
								"example" : {
									"path" : "irgedwas",
									"name" : "lalal"
								},
								"line": 74
							},
							{
								"name": "setData",
								"description": "set the template data",
								"parameter": [
									{
										"name": "data",
										"type": "object",
										"description": "expects the object data"
									}
								],
								"private": false,
								"public": false,
								"property": false,
								"object": false,
								"method": true,
								"module": false,
								
								"line": 251
							}
						],
						"objects": [],
						"dna": "class",
						"test": "Mold.Test.Lib.Template",
						"include": [
							{
								"name": "Mold.Lib.VDom.Builder",
								"path": "../../Mold/Lib/VDom/Builder"
							},
							{
								"name": "Mold.Lib.Ajax",
								"path": "../../Mold/Lib/Ajax"
							},
							{
								"name": "Mold.Lib.MultiLineString",
								"path": "../../Mold/Lib/MultiLineString"
							},
							{
								"name": "Mold.Lib.Path",
								"path": "../../Mold/Lib/Path"
							},
							{
								"name": "Mold.Lib.Promise",
								"path": "../../Mold/Lib/Promise"
							},
							{
								"name": "Mold.Lib.Event",
								"path": "../../Mold/Lib/Event"
							}
						],
						"browserInclude": [
							"Mold.Lib.VDom.Builder",
							[
								".VDom.Components.MoldEvent",
								".VDom.Components.MoldCaptureForms"
							]
						],
						"example": 
						   { path: 'examples/simple_todo/Mold/Main.js',
						     code: '\nvar template = new Mold.Lib.Template(function(){\n\t/*|\n\t\t<ul class="todo-list">\n\t\t\t{{#list}}\n\t\t\t\t<li style="color:{{color}};">\n\t\t\t\t\t{{+}}. {{entry}}\n\t\t\t\t\t<a href="#" mold-event="click:@delete.entry:{{+}}">delete</a>\n\t\t\t\t</li>\n\t\t\t{{/list}}\n\t\t</ul>\n\t\t<input name="entry" type="text" value="">\n\t\t{{#error}}\n\t\t\t<p class="error">{{error}}</p>\n\t\t{{/error}}\n\t\t<br>\n\t\t<div class="actions">\n\t\t\t<a href="#" mold-event="click:@add.entry">add</a>\n\t\t\t<a href="#" mold-event="click:@delete.all">delete all</a>\n\t\t</div>\n\t|*/\n});\n\n' },
						

					}
					templateTwoTree.on("renderd", function(e){
						console.log("e", e.data.tree)
					})

					templateTwoTree.getString(data).then(function(data){
						console.log("data", data)
						go()
					})
				});
			});
			

			xit("tests special template block filter", function(){
				var templateFour = false;
				it("create a new template with filter", function(){

					templateFour = new Template(function(){/*|
						
						
						
						
						{{#list|if(this.length === 3)|exists}}
							if youhu lalal
						{{/list}}
						
						{{#list|exists}}
							<br>Liste existiert!
						{{/list}}


						{{#list}}
							<div>
								{{content}}

								{{#content|case:red}}
									RED GEFUNDEN
								{{/content}}

								
							</div>
						{{/list}}

							
					|*/});

					templateFour.tree.then(function(tree){
						if(!Mold.isNodeJS){
							templateFour.appendTo(document.body)
						}
					})
				})

				it("add data to template", function(){

					templateFour.on("renderd", function(e){
						console.log("e", e)
					})
					//#setData
					templateFour.setData({
						list : [
							{ content :  "red" },
							{ content :  "noch eint test" },
							{ content :  "wieder ein test" }
						]
					})
					///#setData
				})
			})

			xit("tests two way model binding with array", function(){
				var template = false, model = false;

				it("create new template add a model with a list ", function(done){

					template = new Template(function(){/*|

						{{#test}}
							<div>{{model}}</div>
							<input type="text" mold-bind="model" value="">
						{{/test}}

						
					|*/});


					if(!Mold.isNodeJS){
						template.appendTo(document.body)
					}
				

					model = new Mold.Lib.Model({
						test : [
							{ model : "string" }
						]
					});

					template.tree.then(function(tree){
						template.connect(model);
					})

					template.on("renderd", function(e){
						//console.log("e", e.data.tree.dom.children.test.children[0].model.data)
						if(e.data.tree.dom.children.test.children[0].model.data){
							expect(e.data.tree.dom.children.test.children[0].model.data).toBe("test")
							done();
						}
					})
				
					model.data.test = [
						{ model : "test" }
					];

				})
			})

			it("tests two way model binding with object", function(){
				var template = false, model = false;

				it("create new template add a model with a object ", function(done){

					template = new Template(function(){/*|

						{{#test}}
							<div>{{model}}</div>
							<input type="text" mold-bind="model" value="">
						{{/test}}
							
						{{anders}}


						<input type="text" mold-bind="anders" value="">
						
					|*/});


					if(!Mold.isNodeJS){
						template.appendTo(document.body)
					}
				

					model = new Mold.Lib.Model({
						test : {
							model : "string"
						},
						anders : "string"
					});

					template.tree.then(function(tree){
						template.connect(model);
					})

					template.on("renderd", function(e){
						console.log("R->", e.data.tree.dom)
						/*if(e.data.tree.dom.children.test.children.model.data){
							expect(e.data.tree.dom.children.test.children.model.data).toBe("test")
							done();
						}*/
					})
				
					model.data.test = {
						model : "noch ein test"
					}

					model.data.anders = "test"
					

				})
			})


			xit("tests diffrent form bindings", function(){
				var template = false, model = false;

				//#binding
				it("create new template with bindings and add a model to it ", function(done){

					template = new Template(function(){/*|

						{{radio}}

						<input type="radio" name="r" mold-bind="radio" value="1">
						<input type="radio" name="r" mold-bind="radio" value="2">
						<br>
						{{checkbox}}
						<input type="checkbox" mold-bind="checkbox" value="true" false-value="notrue">
						<br>
						{{selectbox}}
						<select mold-bind="selectbox" mold-select="items.id as value items.val as label">
							<option value="test1">label1</option>
							<option value="test2">label2</option>
						</select>
						<br>
						{{range}}
						<input mold-bind="range" type="range" min="1" max="100" value="0">

						
					|*/});


					if(!Mold.isNodeJS){
						template.appendTo(document.body)
					}
				

					model = new Mold.Lib.Model({
						radio : "string",
						checkbox : "string",
						selectbox : "string",
						range : "string"
					});

					template.connect(model);
					
					model.data.radio = 1;
					model.data.checkbox = "true";
					model.data.selectbox = "test2";
					model.data.range = 20;
					

				})
				///#binding
			})


		});
	}
);