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
					<html>
						<body>
							<ul>
								{{#list}}
									<li><a href="/data/{{_id}}"> {{+}}. {{_id}} {{vorname}} {{nachname}} </a></li>
								{{/list}}
							</ul>
						</body>
					</html>
				|*/}, { disableSanitizer : true } );


			})

			it("add data to instace", function(){
				template.append({
					list : [
						{ 
							vorname : "hans",
							nachname : "peter"
						},
						{ 
							vorname : "dieter",
							nachname : "schmitt"
						}
					]
				});
			});

			
			it("add data to instance", function(){
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


			it("bind model and append data", function(){
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

			it("append more data to model", function(){
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


			it("append much more data to model", function(){
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


		it("append much much more data to model", function(){
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