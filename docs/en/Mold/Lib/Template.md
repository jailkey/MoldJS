
#Mold.Lib.Template
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/Template.js  
__dna__: class  
__author__: Jan Kaufmann <jan@moldjs.de>  
__version__: 0.3.0  
	

__test__: [Mold.Test.Lib.Template](../../Mold/Test/Lib/Template.md) 





__creates a template__


##Dependencies
--------------

* [Mold.Lib.VDom.Builder](../../Mold/Lib/VDom/Builder.md) 
* [Mold.Lib.Ajax](../../Mold/Lib/Ajax.md) 
* [Mold.Lib.MultiLineString](../../Mold/Lib/MultiLineString.md) 
* [Mold.Lib.Path](../../Mold/Lib/Path.md) 
* [Mold.Lib.Promise](../../Mold/Lib/Promise.md) 
* [Mold.Lib.Event](../../Mold/Lib/Event.md) 


##Example
--------------
*examples/simple_todo/Mold/Main.js*

```

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


```



   
##Methods
	
 

###_connector
__collection of methods to bind a model to the template__  
Defined in row: 81  

  






###connect
__connects a model to the template__  
Defined in row: 252  

__Arguments:__  
* __model__ (_mold.lib.model_) -   



__Example:__  
*Mold/Test/Lib/Template.js*

```

it("adds a model and some data", function(){

	
	modelTwo = new Mold.Lib.Model({
		block : [ 
			{
				subblock : [
					{
						background : "string",
						subitem : "string"
					}
				]
			}
		],
		list : []
	});

	templateTwo.connect(modelTwo);


	modelTwo.data.block.push({
		subblock : [
			{ background : Color.randomColor(), subitem : "one"},
			{ background : Color.randomColor(), subitem : "two"},
			{ background : Color.randomColor(), subitem : "three"},
		]
	})
})


```  



###setData
__set the template data__  
Defined in row: 270  

__Arguments:__  
* __data__ (_object_) - expects the object data  
returns: 


__Example:__  
*Mold/Test/Lib/Template.js*

```

templateFour.setData({
	list : [
		{ content :  "red" },
		{ content :  "noch eint test" },
		{ content :  "wieder ein test" }
	]
})


```  



###appendTo
__appends the template to an element and render the template__  
Defined in row: 294  

__Arguments:__  
* __element__ (_element_) - the element where the template has to be appended  
returns: 


__Example:__  
*Mold/Test/Lib/Template.js*

```

template.tree.then(function(tree){
	if(!Mold.isNodeJS){
		
		template.appendTo(document.body)
		
	}else{
		var doc = new Doc();
		template.appendTo(doc.get())
	}
	go();
})


```  



###getString
__set data to the template and renders the template__  
Defined in row: 311  

__Arguments:__  
* __data__ (_object_) - the data has to set  
returns: 




 


 

##Objects
		


####forms
Defined in row: 244  
Parameter: 

returns: 


		
