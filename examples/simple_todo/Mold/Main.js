Seed(
	{ 
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Lib.Template",
			"external->Mold.Lib.Model"
		]
	},
	function(){

		var template = new Mold.Lib.Template(function(){
			/*|
				<ul class="todo-list">
					{{#list}}
						<li>
							{{entry}}
							<a href="#" mold-event="click:@delete.entry">delete</a>
						</li>
					{{/list}}
				</ul>
				<input name="entry" value="" type="text" mold-data="listdata">
				{{#error}}
					<br>{{.}}<br>
				{{/error}}
				<br>
				<a href="#" mold-event="click:@add.entry">add</a><br>
				<a href="#" mold-event="click:@delete.all">delete All</a>
			|*/
		});

		var model = new Mold.Lib.Model({
			properties :{
				list : [
					{ entry : "string" }
				],
				error : "string"
			}
		});

		

		template.bind(model);

		template
			.on("add.entry", function(e){
				if(e.data.listdata && e.data.listdata.entry !== ""){
					model.data.list.push({ entry : e.data.listdata.entry })
					model.data.error = false;
				}else{
					model.data.error = "The field is empty!"
				}
			})
			.on("delete.entry", function(e){
				model.data.list.splice(e.data.index, 1);
			})
			.on("delete.all", function(e){
				model.data.list.remove();
			})

		document
			.querySelector(".template-target")
			.appendChild(template.get());




	}
);