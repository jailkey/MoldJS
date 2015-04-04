Seed(
	{ 
		name : "Mold.Main",
		dna : "component",
		include : [
			"->Mold.DNA.Component",
			"->Mold.Lib.Template",
			"->Mold.Lib.Model",
			"->Mold.Lib.Color",
			"->Mold.Adapter.LocalStore"
		],
		directives : [
			{
				at : "element",
				name : "x-todo"
			}
		]
	},
	function(node, element, collection, component){


		//create template
		var template = new Mold.Lib.Template(function(){
			/*|
				<ul class="todo-list">
					{{#list}}
						<li style="color:{{color}};">
							{{+}}. {{entry}}
							<a href="#" mold-event="click:@delete.entry" index="{{+}}" value="{{entry}}">delete</a>
						</li>
					{{/list}}
				</ul>
				<input name="entry" value="" type="text" mold-data="listdata">
				{{#error}}
					<p class="error">{{.}}</p>
				{{/error}}
				<br>
				<div class="actions">
					<a href="#" mold-event="click:@add.entry">add</a>
					<a href="#" mold-event="click:@delete.all">delete all</a>
				</div>
			|*/
		});

		//create model for data
		var model = new Mold.Lib.Model({
			properties : {
				list : [
					{ 
						entry : "string",
						color : "string"
					}
				]
			},
			adapter : new Mold.Adapter.LocalStore()
		});

		var error = new Mold.Lib.Model({
			properties : {
				error : "string"
			}
		})

		//bind model on template
		template.bind(model);

		//bind error model
		template.bind(error);

		model.load("my-todo");

		//register template and model at the controller
		this.register(template);

		//append template to element
		element.append(template.get());

		//handle events
		this.actions = {
			"@add.entry" : function(e){
				if(e.data.listdata && e.data.listdata.entry !== ""){
					model.data.list.push({ 
						entry : e.data.listdata.entry,
						color : Mold.Lib.Color.randomColor()
					})
					error.data.error = false;
					model.save();
				}else{
					error.data.error = "The field is empty!"
				}
			},
			"@delete.entry" : function(e){
				console.log(e.data.element.index);
				model.data.list.splice(e.data.element.getAttribute('index'), 1);
				model.save();
			},
			"@delete.all" : function(e){
				model.data.list.remove();
				model.save();
			}	
		}
	}
);