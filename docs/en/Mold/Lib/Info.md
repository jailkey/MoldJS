
#Mold.Lib.Info
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/Info.js  
__dna__: static  


	






##Dependencies
--------------




   
##Methods
	
 

###isSupported



__Test if the Browser has native suppport for the given property/methode__  
Defined in row: 111  

__Arguments:__  
 * __name__ (_string_) - Expects the method-/propertyname  
returns: 




###addFeatureTest



__Test if the Browser has native suppport for the given feature__  
Defined in row: 124  

__Arguments:__  
 * __name__ (_string_) - Expects the method-/propertyname  
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



###isValidHTML5Element



__Test an element is an valid HTML5 element__  
Defined in row: 134  

__Arguments:__  
 * __name__ (_string_) - Expects the element name  
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



 


 



		
