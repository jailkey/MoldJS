Seed({
		name : "Mold.Test.Lib.Template",
		dna : "test",
		include : [
			"Mold.Lib.Model"
		]
	},
	function(Template){
		describe("Test Mold.Lib.Template", function(){
			var template, model;

			it("create instace", function(){

				template = new Mold.Lib.Template(function(){/*|
					
					<ul>
						{{#list}}
							<li><a href="/data/{{_id}}"> {{+}}. {{_id}} {{vorname}} {{nachname}} </a></li>
						{{/list}}
					</ul>
				
				|*/}, { disableSanitizer : true } );

				
			})



			it("add data to instace", function(){
				var data = [];
				for(var i = 0; i < 1000; i++){
					data.push({
						vorname : "v + "+ Math.random(),
						nachname : "n " + Math.random()
					});
				}
				
				template.append({
					list : data
				});

				document.body.appendChild(template.get())
			});

			
			xit("add data to instance", function(){
				template.append({
					list : [
						{ 
							vorname : "wilfried",
							nachname : "testman"
						},
						{ 
							vorname : "super",
							nachname : "mann"
						}
					]
				})

				
			})


			xit("bind model and append data", function(){
				model = new Mold.Lib.Model({
					properties : {
						list : [
							{
								vorname : "string",
								nachname : "string",

							}
						],
					},
					list : true
				})

				template.bind(model);
				
				model.update({
					list : [
						{ 
							vorname : "wilfried",
							nachname : "testman"
						},
						{ 
							vorname : "soso",
							nachname : "wasauchimmer"
						}
					]
				});

			})

			xit("append more data to model", function(){
				model.update({
					list : [
						{ 
							vorname : "Gerd",
							nachname : "Trude"
						},
						{ 
							vorname : "Frank",
							nachname : "Schein"
						}
					]
				});
			})


			xit("append much more data to model", function(){
				model.update({
					list : [
						{ 
							vorname : "Friedrich",
							nachname : "Whilhelm"
						},
						{ 
							vorname : "Karsten",
							nachname : "Schneider"
						}
					]
				});
			})


			xit("append much much more data to model", function(){
				model.update({
					list : [
						{ 
							vorname : "Friedrich",
							nachname : "Whilhelm"
						},
						{ 
							vorname : "Karsten",
							nachname : "Schneider"
						}
					]
				});
			})
		})		
	}
)