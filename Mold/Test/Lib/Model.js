
Seed({
		name : "Mold.Test.Lib.Model",
		dna : "test"
	},
	function(Model){
		describe("Test Mold.Lib.Model", function(){

			var flag = false;
			var isMoldReady = false;
			var testModel = false;

			it("create model", function(){
				 testModel = new Model({
				 	properties : {
				 		"name" : "string|required",
				 		"vorname" : "string",

				 		"obj" : {
				 			"objitem" : "number",
				 			"subobject" : {
				 				"subitem" : "number|plz|requierd"
				 			}
				 		},
				 		"list" : [
				 			{ 
				 				"item" : "string",
				 				"sublist" : [
				 					{ 
				 						"sublistitem" : "number"
				 					}
				 				]
				 			}
				 		],
				 		"anotherlist" : [
				 			{
				 				"name" : "string"
				 			}
				 		]
				 	}
				 });
			});

			it("adds data to the model via update and change object properties", function(done){
				testModel.on("root.name.changed", function(e){
					console.log("e", e.data, testModel.data.name);
					done()
					//expect(e.data)
				})

				testModel.update({
					"name" : "test",
					"list" : [
						{
							"item" : "hier ein item"
						}
					]
				})

				testModel.data.name = "irgendwas";
			});

			it("adds data to the model via push", function(done){

				testModel.on("root.list.changed", function(e){
					console.log("array changed", e.data)
					expect(e.data.object.length).toBe(2);
					done();
				})

				testModel.data.list.push({
					"item" : "was anders"
				})

			})

			xit("First level property values", function(done){
			
				testModel.data.on("property.change.name", function(e){
					testModel.data.off("property.change.name");
					expect(e.data.value).toEqual("Hans");
					expect(e.data.name).toEqual("name");
					done()
				});

				testModel.data.name = "Hans";

			});

			xit("First level object added", function(done){
				
				testModel.data.obj.on("object.change", function(e){
					testModel.data.obj.off("object.change");
					expect(e.data.value.objitem).toEqual("objectitemvalue");
					expect(e.data.value.subobject.subitem).toEqual("subobjectitemvalue");
					expect(e.data.name).toEqual("obj");
					done()
				});

				testModel.data.obj = { 
					"objitem" : "objectitemvalue",
					"subobject" : {
		 				"subitem" : "subobjectitemvalue"
		 			}
				 }

				
			});

			xit("Test if Subobject fires events after adding", function(done){

				testModel.data.obj.subobject.on("property.change.subitem", function(e){
					testModel.data.obj.subobject.off("property.change.subitem");
					expect(e.data.value).toEqual("anewsubvalue");
					expect(e.data.name).toEqual("subitem");
					done();
				});

				testModel.data.obj.subobject.subitem = "anewsubvalue";

			});

			xit("Test if object fires events after adding subobject", function(done){
			
				testModel.data.obj.on("property.change.objitem", function(e){
					testModel.data.obj.off("property.change.objitem");
					expect(e.data.value).toEqual("newvalue");
					expect(e.data.name).toEqual("objitem");
					done();
				});
				testModel.data.obj.objitem = "newvalue";

			});

			xit("Adding a list element", function(done){
				
				testModel.data.list.on("list.item.add", function(e){
					testModel.data.obj.off("list.item.add");
					expect(e.data.index).toEqual(0);
					done()
				});

				testModel.data.list.push(
					{
		 				"item" : "itemvalu",
		 				"sublist" : [
		 					{ 
		 						"sublistitem" : "sublistvalue"
		 					}
		 				]
		 			}
	 			);



			});

			xit("Changing a list", function(done){
			
				testModel.data.list.on("list.item.change.0", function(e){
					testModel.data.list.off("list.item.change.0");
					expect(e.data.value.item).toEqual("anothervalue");
					done();
				});

				testModel.data.list[0] = {
	 				"item" : "anothervalue",
	 				"sublist" : [
	 					{ 
	 						"sublistitem" : "sublistvalue"
	 					},
	 					{
	 						"sublistitem" : "secondevalue"
	 					}
	 				]
	 			}

			});



			xit("Add a list in a list value", function(done){
			
				testModel.data.list[0].sublist.on("list.item.change.0", function(e){
					testModel.data.list[0].sublist.off("list.item.change.0");
					expect(e.data.value.sublistitem).toEqual("newsublisvalue");
					done()
				});

				testModel.data.list[0].sublist[0] =	{ 
					"sublistitem" : "newsublisvalue"
				}


			});


			xit("change objectvalue in a sublist", function(done){

				testModel.data.list[0].sublist[0].on("property.change.sublistitem", function(e){
					testModel.data.list[0].sublist[0].off("property.change.sublistitem");
					done()
				});
				

				testModel.data.list[0].sublist[0].sublistitem = 5;

			});


			xit("change an objectvalue in a list", function(done){
				flag = false;
					
				testModel.data.anotherlist.push({
					name : "Marie"
				});

				testModel.data.anotherlist.push({
					name : "Hans"
				})

				testModel.data.anotherlist.push({
					name : "Lena"
				})


				testModel.data.anotherlist[0] = {
					name : "Jan"
				}

				expect(testModel.data.anotherlist[0].name).toEqual("Jan");
				

				testModel.data.anotherlist[2] = {
					name : "Dieter"
				}

				expect(testModel.data.anotherlist[2].name).toEqual("Dieter");

				testModel.data.anotherlist.on("list.item.change.1", function(e){
					testModel.data.anotherlist.off("list.item.change.1");
					expect(e.data.value.name).toEqual("Peter");
					done();
				});

				testModel.data.anotherlist[1] = {
					name : "Peter"
				}
				
			})

			xit("test if validation error fires", function(done){
				testModel.validation(true);
				testModel.on("validation.error", function(e){
				 	done();
				});

				testModel.data.name = "";
			})

			 

		});
		

	}
);
	
