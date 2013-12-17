Seed ({
		name : "Mold.Component.SlideShowParts.View",
		dna : "view",
		include : [
			"external->Mold.DNA.View",
			"external->Mold.Lib.Template"
		]
	},
	function(){

		this.template = this.register(new Mold.Lib.Template(function(){
			/*|
				<div class="slide-show">
				{{#slidevalues}}
					{{value|html}}
				{{/slidevalues}}
				</div>
				<a href="#" mold-event="click:@slide.left">nach Links</a>
				<a href="#" mold-event="click:@slide.right">nach Rechts</a>
			|*/
		}));


		this.template.snatch({
			"@slide.left" : function(e){
				console.log("slide left", e);
			}
		})


	}
)
