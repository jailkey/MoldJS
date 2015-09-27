
#Mold.Tools.Doc.MarkDownReporter
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Tools/Doc/MarkDownReporter.js  
__dna__: class  


	






##Dependencies
--------------

* [Mold.Lib.Template](../../../Mold/Lib/Template.md) 



   
##Methods
	
 

###report



__returns a markdown document genereated by the given data__  
Defined in row: 117  

__Arguments:__  
 * __data__ (_object_) -   
returns: 


__Example:__  
*Mold/Test/Lib/VDom/Builder.js*

```

it("create vdom with negative block", function(){
	secondResult = new Builder('{{#block}}<div> show if data is set</div>{{/block}} - {{^block}} show if data is not set {{/block}}');
	expect(secondResult.dom.children.block[1].isNegative).toBe(true);
});

it("add some blockdata", function(){
	var data = {
		block : "show"
	}
	secondResult.dom.setData(data);
	expect(secondResult.dom.children.block[0].renderDom.length).toBe(1);
	expect(secondResult.dom.children.block[1].renderDom.length).toBe(0);
});

it("render block", function(){

	var insert = secondResult.dom.render();
	
	expect(insert.getElementsByTagName("div").length).toBe(1);
});


```  



 


 



		
