describe("Test Mold.Lib.Model", function(){

	var flag = false;
	var isMoldReady = false;
	var testModel = false;

	describe("Load and create Model", function(){
		it("Load Seed", function(){

			Mold.ready(function(){
				isMoldReady = true;
			})

			waitsFor(function() {
				return isMoldReady;
			}, "Molde is ready", 750);

			var loader = Mold.load({ name : "external->Mold.Lib.Model" });

			loader.bind(function(){
				flag = true;
			})

			waitsFor(function() {
				return flag;
			}, "Seed succsessfully loaded", 750);

		});

		it("create Seed", function(){
			 testModel = new Mold.Lib.Model({
			 	properties : {
			 		"name" : "string|notempty",
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
			 		]
			 	}
			 });
			 /*
			 testModel.validation(true);
			 testModel.on("validation.error", function(e){
			 	console.log("-----validation error", e)
			 })*/
		});
	});

	describe("add Value and listen to events", function(){

		it("First level property values", function(){
			flag = false;
			testModel.data.on("property.change.name", function(e){
				expect(e.data.value).toEqual("Hans");
				expect(e.data.name).toEqual("name");
				flag = true;
			});

			testModel.data.name = "Hans";

			waitsFor(function() {
				testModel.data.off("property.change.name");
				return flag;
			}, "Seed succsessfully loaded", 750);
		});

		it("First level object added", function(){
			flag = false;
			testModel.data.obj.on("object.change", function(e){
				console.log("Change", e.data)
				expect(e.data.value.objitem).toEqual("objectitemvalue");
				expect(e.data.value.subobject.subitem).toEqual("subobjectitemvalue");
				expect(e.data.name).toEqual("obj");
				flag = true;
			});

			testModel.data.obj = { 
				"objitem" : "objectitemvalue",
				"subobject" : {
	 				"subitem" : "subobjectitemvalue"
	 			}
			 }

			 waitsFor(function() {
				testModel.data.off("property.change.name");
				return flag;
			}, "Event object.change fired", 750);
			
		});

		it("Test if Subobject fires events after adding", function(){
			flag = false;

			testModel.data.obj.subobject.on("property.change.subitem", function(e){
				console.log("test->property change subitem", e.data);
				expect(e.data.value).toEqual("anewsubvalue");
				expect(e.data.name).toEqual("subitem");
				flag = true;
			});

			testModel.data.obj.subobject.subitem = "anewsubvalue";

			waitsFor(function() {
				testModel.data.obj.subobject.off("property.change.subitem");
				return flag;
			}, "Event property.change.subitem fired", 750);
		});

		it("Test if object fires events after adding subobject", function(){
			flag = false;
			testModel.data.obj.on("property.change.objitem", function(e){
				console.log("property change subitem", e.data)
				expect(e.data.value).toEqual("newvalue");
				expect(e.data.name).toEqual("objitem");
				flag = true;
			});
			testModel.data.obj.objitem = "newvalue";

			waitsFor(function() {
				testModel.data.obj.off("property.change.objitem");
				return flag;
			}, "Event property.change.objitem fired", 750);

		});

		it("Adding a list element", function(){
			flag = false;
			testModel.data.list.on("list.item.add", function(e){
				expect(e.data.index).toEqual(0);
				flag = true;
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

 			waitsFor(function() {
				testModel.data.obj.off("list.item.add");
				return flag;
			}, "Event list.item.add fired", 750);


		});

		it("Changing a list", function(){
			flag = false;
			testModel.data.list.on("list.item.change.0", function(e){
				expect(e.data.value.item).toEqual("anothervalue");
				flag = true;
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

 			waitsFor(function() {
				testModel.data.obj.off("list.item.change.0");
				return flag;
			}, "Event list.item.change.0 fired", 750);

		});

		it("Add a list in a list value", function(){
			flag = false;
			testModel.data.list[0].sublist.on("list.item.change.0", function(e){
				expect(e.data.value.sublistitem).toEqual("newsublisvalue");
				flag = true;
			});

			testModel.data.list[0].sublist[0] =	{ 
				"sublistitem" : "newsublisvalue"
			}

			waitsFor(function() {
				testModel.data.list[0].sublist.off("list.item.change.0");
				
				return flag;
			}, "Event list.item.change.0 fired", 750);

		});


		it("Change Objectvalue in a Sublist", function(){
			testModel.data.list[0].sublist[0].on("property.change.sublistitem", function(e){
				console.log("property.change.sublistitem", e.data)
			});
			
			testModel.data.list[0].sublist[0].on("validation.error", function(e){
				return e.data.oldValue;
			});

			testModel.data.list[0].sublist[0].sublistitem = 5;

			console.log("model", testModel)

		});


		it("Change a list in an object", function(){
			


		});




	});

});