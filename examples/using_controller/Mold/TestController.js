Seed(
	{
		name : 'Mold.TestController',
		dna : 'controller',
		include : [
			'->Mold.DNA.Controller',
			'->Mold.Lib.Template'
		]
	},
	function(){

		var view = new Mold.Lib.Template(function(){/*|
			<a class="button" mold-event="click:@dosomething">Button</a>
		|*/})

		document.body.appendChild(view.get());

		this.register(view);

		this.actions = {
			"@dosomething" : function(){
				console.log("button clicked")
			}
		}
	}
)