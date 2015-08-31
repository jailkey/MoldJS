Seed({
		name : "Mold.Test.Lib.Template",
		dna : "test",
		include : [
			{ Color : "->Mold.Lib.Color" },
			{ Model : "->Mold.Lib.Model" }
		]
	},
	function(Template){

		timeout(5000);

		describe("Test Mold.Lib.Template", function(){
			var template, test = now(), dataModel;

			it("create new template from multilinestring", function(go){

				template = new Template(function(){/*|
					<h1 class="topic">Übersxhrift</h1>
					<ul class="values" mold-name="mylist">
						{{#block}}
							<li style="background:{{color}}">{{i}} - {{value}}</li>
						{{/block}}

						{{^block}}
							<li>Keine Daten</li>
						{{/block}}
					</ul> 
					<a mold-event="click:@add.entry">Add Entry</a>
				|*/});

				template.tree.then(function(tree){
					template.appendTo(document.body);
					console.log(tree)
					go();
				})
			});

			xit("add test data to template", function(done){
				var test = now();
				var data = { block : [] };
				
				for(var i = 0; i < 1000; i++){
					data.block.push({
						i : i,
						value : Math.random(),
						color : Color.randomColor()
					})
				}


				console.log("time", now() - test);
				window.setTimeout(done, 800)
			})


			xit("add and remove plain template data", function(){
				it("add some data to template", function(done){
					var test = now();
					var data = { block : [] };
					
					for(var i = 0; i < 100; i++){
						data.block.push({
							i : i,
							value : Math.random(),
							color : Color.randomColor()
						})
					}

					template.setData(data)
					window.setTimeout(done, 800)
				})

				it("add more data to template", function(done){
					var test = now();
					var data = { block : [] };
					
					for(var i = 0; i < 10; i++){
						data.block.push({
							i : i,
							value : "NEU",
							color : Color.randomColor()
						})
					}
					template.setData(data)
					window.setTimeout(done, 800)
				})

				it("delete data", function(done){
					template.setData(false)
					window.setTimeout(done, 800)
				})

				it("add more data to template", function(done){
					var data = { block : [] };
					for(var i = 0; i < 10; i++){
						data.block.push({
							i : i,
							value : "NEU",
							color : Color.randomColor()
						})
					}
					template.setData(data)
					window.setTimeout(done, 800)
				})

				it("delete data", function(done){
					template.setData(false)
					window.setTimeout(done, 800)
				});

				it("add more data to template", function(done){
					var data = { block : [] };
					for(var i = 0; i < 10; i++){
						data.block.push({
							i : i,
							value : "NEU",
							color : Color.randomColor()
						})
					}
					template.setData(data)
					window.setTimeout(done, 800)
				})
			});

	//model data
			it("bind model and add and remove data", function(){

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
							done();
						}
					}

					template.on("renderd", testRendert)

					for(var i = 0; i < 10; i++){
						dataModel.data.block[i].color = Color.randomColor();
						dataModel.data.block[i].value = "Neu Inhalte";
					}

					
				})

				it("remove model data", function(done){

					var testRendert = function(e){
						if(e.data.tree.dom.children.block[0].children.length === 0){
							template.off("renderd", testRendert)
							done();
						}
					}
					
					template.on("renderd", testRendert)

					dataModel.data.block.splice(0, 30);
				
				});

				it("add model data again", function(done){

					var testRendert = function(e){
						if(e.data.tree.dom.children.block[0].children.length === 5){
							template.off("renderd", testRendert)
							done();
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

		});
	}
);