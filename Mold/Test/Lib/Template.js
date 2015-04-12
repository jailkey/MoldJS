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

			
			it("add data to instace", function(){
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


			it("append model to template", function(){
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
				
				model.update([
					{ 
						vorname : "wilfried",
						nachname : "testman"
					},
					{ 
						vorname : "soso",
						nachname : "wasauchimmer"
					}
				]);


			})
		})		
	}
)