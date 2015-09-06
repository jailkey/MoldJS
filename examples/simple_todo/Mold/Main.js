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
							<a href="#" mold-event="click:@delete.entry:{{+}}">delete</a>
						</li>
					{{/list}}
				</ul>
				<input name="entry" type="text" value="">
				{{#error}}
					<p class="error">{{error}}</p>
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
			list : [
				{ 
					entry : "string",
					color : "string"
				}
			],
			error : "string"
		});

		model.connect(new Mold.Adapter.LocalStore());

		//connect model on template
		template.connect(model);

		//load template list if it is in local storage
		model.load("my-todo");
		
		//register template at the controller
		this.register(template);

		//append template to element
		template.appendTo(element);

		//handle events
		this.actions = {
			"@add.entry" : function(e){

				if(template.forms.entry){
					model.data.list.push({ 
						entry : template.forms.entry,
						color : Mold.Lib.Color.randomColor()
					})
					
					model.data.error = false;
					model.save();
				}else{
					model.data.error = "The field is empty!"
				}
			},
			"@delete.entry" : function(e){
				model.data.list.splice(e.data.data, 1);
				e.data.elementEvent.preventDefault()
				model.save();
			},
			"@delete.all" : function(e){
				model.data.list.splice(0, model.data.list.length);
				model.save();
			}
		}
	}
);