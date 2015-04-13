
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


			it("First level property values", function(done){
			
				testModel.data.on("property.change.name", function(e){
					testModel.data.off("property.change.name");
					expect(e.data.value).toEqual("Hans");
					expect(e.data.name).toEqual("name");
					done()
				});

				testModel.data.name = "Hans";

			});

			it("First level object added", function(done){
				
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

			it("Test if Subobject fires events after adding", function(done){

				testModel.data.obj.subobject.on("property.change.subitem", function(e){
					testModel.data.obj.subobject.off("property.change.subitem");
					expect(e.data.value).toEqual("anewsubvalue");
					expect(e.data.name).toEqual("subitem");
					done();
				});

				testModel.data.obj.subobject.subitem = "anewsubvalue";

			});

			it("Test if object fires events after adding subobject", function(done){
			
				testModel.data.obj.on("property.change.objitem", function(e){
					testModel.data.obj.off("property.change.objitem");
					expect(e.data.value).toEqual("newvalue");
					expect(e.data.name).toEqual("objitem");
					done();
				});
				testModel.data.obj.objitem = "newvalue";

			});

			it("Adding a list element", function(done){
				
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

			it("Changing a list", function(done){
			
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



			it("Add a list in a list value", function(done){
			
				testModel.data.list[0].sublist.on("list.item.change.0", function(e){
					testModel.data.list[0].sublist.off("list.item.change.0");
					expect(e.data.value.sublistitem).toEqual("newsublisvalue");
					done()
				});

				testModel.data.list[0].sublist[0] =	{ 
					"sublistitem" : "newsublisvalue"
				}


			});


			it("change objectvalue in a sublist", function(done){

				testModel.data.list[0].sublist[0].on("property.change.sublistitem", function(e){
					testModel.data.list[0].sublist[0].off("property.change.sublistitem");
					done()
				});
				

				testModel.data.list[0].sublist[0].sublistitem = 5;

			});


			it("change an objectvalue in a list", function(done){
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

			it("test if validation error fires", function(done){
				testModel.validation(true);
				testModel.on("validation.error", function(e){
				 	done();
				});

				testModel.data.name = "";
			})

			 

		});
		

	}
);
	
