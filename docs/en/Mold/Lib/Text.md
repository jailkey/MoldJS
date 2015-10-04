
#Mold.Lib.Text
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/Text.js  
__dna__: class  


	






##Dependencies
--------------

* [Mold.Lib.Event](../../Mold/Lib/Event.md) 
* [Mold.Lib.Element](../../Mold/Lib/Element.md) 
* [Mold.Lib.Info](../../Mold/Lib/Info.md) 
* [Mold.Lib.TextFinder](../../Mold/Lib/TextFinder.md) 


##Events
--------------






   
##Methods
	
 

###_getSelection



__get the current selection__  
Defined in row: 24  

  

returns: 




###_getFirstRelevantNode



__retruns the next childNode with the given nodeType__  
Defined in row: 38  

__Arguments:__  
 
* __node__ (_object_) - target node   
* __nodeType__ (_number_) - requested node type  
returns: 


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

	templateTwo.on("renderd", function(e){
		if(templateTwoTree.dom.children.block[0].children.length === 3){

		}
	})
})


```  



###_setSelection



__set a selection from a range object__  
Defined in row: 84  

__Arguments:__  
 
* __range__ (_object_) - expects a range object  
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



###selection



__get / set a text selection__  
Defined in row: 317  

__Arguments:__  
 
* __range__ (_mixed_) - range ident object or range ident string, if not set method returns the current selection  
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



###find



__prepand the template to an element and render the template__  
Defined in row: 346  

__Arguments:__  
 
* __range__ (_mixed_) - object or string  
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



 


 



		
