
#Mold.Lib.Template
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/Template.js  
__dna__: class  
__author__: Jan Kaufmann <jan@moldjs.de>  
__version__: 0.3.0  
	

__test__: [Mold.Test.Lib.Template](../../Mold/Test/Lib/Template.md) 



	creates a template


###Dependencies
--------------

* [Mold.Lib.VDom.Builder](../../Mold/Lib/VDom/Builder.md) 
* [Mold.Lib.Ajax](../../Mold/Lib/Ajax.md) 
* [Mold.Lib.MultiLineString](../../Mold/Lib/MultiLineString.md) 
* [Mold.Lib.Path](../../Mold/Lib/Path.md) 
* [Mold.Lib.Promise](../../Mold/Lib/Promise.md) 
* [Mold.Lib.Event](../../Mold/Lib/Event.md) 


###Example
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



   
###Methods
--------------

#####_connector
	collection of methods to bind a model to the template  
Defined in row: 81   
Arguments: 




#####setData
	set the template data  
Defined in row: 258   
Arguments: 

* __data__ (_object_) - expects the object data 



   
###Properties
-------------

 

###Objects
------------


		
