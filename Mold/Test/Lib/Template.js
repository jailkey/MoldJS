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

				template.addDataSync(data)
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

					template.addData(data)
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
					template.addData(data)
					window.setTimeout(done, 800)
				})

				it("delete data", function(done){
					template.addData(false)
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
					template.addData(data)
					window.setTimeout(done, 800)
				})

				it("delete data", function(done){
					template.addData(false)
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
					template.addData(data)
					window.setTimeout(done, 800)
				})
			});
	
			it("bind model and add and remove data", function(){

				it("add model to template", function(done){
					dataModel = new Model({
						properties : {
							block : [
								{ 
									i : "number",
									value : "string",
									color : "string"
								}
							]
						}
					});
					
					console.log(dataModel.data)
					//template.connect(dataModel);
					window.setTimeout(done, 100)
				})

				xit("add data to model", function(done){

					for(var i = 0; i < 10; i++){
						dataModel.data.block.push({
							i : "a" + i + 2,
							value : "NEU",
							color : Color.randomColor()
						})
					}


					window.setTimeout(done, 800)
				});

				xit("change model data with splice", function(done){
					var test = now();
					var data = [];
					for(var i = 0; i < 10; i++){
						data.push({
							i : "c" + i ,
							value : "noch später",
							color : Color.randomColor()
						})
					}
					dataModel.data.block.splice(0, 0, data);
					
					template.addDataSync(dataModel.data)
					console.log("time  ", now() - test);
					window.setTimeout(done, 800)
				});


				xit("change property values", function(){
					var test = now();
					dataModel.data.block.each(function(data){
						data.color = Color.randomColor();
					});
					console.log("->", now() - test)
				})

				xit("remove model data", function(done){
					var test = now()
					for(var i = 0; i < 5; i++){
						dataModel.data.block.shift();
					}
				
					window.setTimeout(done, 800)
				});

				xit("add model data again", function(done){
					
					for(var i = 0; i < 5; i++){
						dataModel.data.block.push({
							i : "a" + i + 2,
							value : "NEU",
							color : Color.randomColor()
						})
					}
					window.setTimeout(done, 800)
				});


				



				xit("change model data with splice", function(done){
					var test = now();
					var data = [];
					for(var i = 0; i < 20; i++){
						data.push({
							i : "D" + i ,
							value : "sehr viel später",
							color : Color.randomColor()
						})
					}
					dataModel.data.block.splice(0, 20, data);
					console.log("time", now() - test);
					window.setTimeout(done, 800)
				});

				xit("remove all model data", function(done){
					var test = now();
					
					dataModel.data.block.splice(0, 5030)
					console.log("time", now() - test);
					window.setTimeout(done, 800)
				});

				xit("and add more data", function(done){
					var test = now();
					var data = [];
					for(var i = 0; i < 30; i++){
						data.push({
							i : "f" + i ,
							value : "nochmal daten",
							color : Color.randomColor()
						})
					}
					dataModel.data.block.splice(0, 0, data);
					console.log("time", now() - test);
					window.setTimeout(done, 800)
				});


				xit("remove all model data", function(done){
					var test = now();
					
					dataModel.data.block.splice(0, 30)
					console.log("time", now() - test);
					window.setTimeout(done, 800)
				});


				xit("and add more data", function(done){
					var test = now();
					var data = [];
					for(var i = 0; i < 30; i++){
						data.push({
							i : "x" + i ,
							value : "nochmal daten",
							color : Color.randomColor()
						})
					}
					dataModel.data.block.splice(0,30, data);
					console.log("time", now() - test);
					window.setTimeout(done, 800)
				});
			});

		});
	}
);