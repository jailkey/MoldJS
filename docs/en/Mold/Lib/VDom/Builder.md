
#Mold.Lib.VDom.Builder
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/VDom/Builder.js  
__dna__: class  
__author__: Jan Kaufmann <jan@moldjs.de>  

	

__test__: [Mold.Test.Lib.VDom.Builder](../../../Mold/Test/Lib/VDom/Builder.md) 





__build a vdom from a content-template string__


##Dependencies
--------------

* [Mold.Lib.Dom](../../../Mold/Lib/Dom.md) 
* [Mold.Tools.Dev.CodeInclude](../../../Mold/Tools/Dev/CodeInclude.md) 
* [Mold.Lib.VDom.ProtoNode](../../../Mold/Lib/VDom/ProtoNode.md) 
* [Mold.Lib.VDom.DomNode](../../../Mold/Lib/VDom/DomNode.md) 
* [Mold.Lib.VDom.BlockNode](../../../Mold/Lib/VDom/BlockNode.md) 
* [Mold.Lib.VDom.ValueNode](../../../Mold/Lib/VDom/ValueNode.md) 
* [Mold.Lib.VDom.TextNode](../../../Mold/Lib/VDom/TextNode.md) 
* [Mold.Lib.VDom.AttributeNode](../../../Mold/Lib/VDom/AttributeNode.md) 
* [Mold.Lib.VDom.RootNode](../../../Mold/Lib/VDom/RootNode.md) 
* [Mold.Lib.VDom.VDoc](../../../Mold/Lib/VDom/VDoc.md) 


##Example
--------------
**

```
Mold/Test/Lib/VDom/Builder#build

```



   
##Methods
	
 

###render



__trigger the renderservice__  
Defined in row: 211  

  

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



###reRender



__reRenders the vdom, recreat dom elements only if needed__  
Defined in row: 218  

  






###renderString



__renders the vdom as a string__  
Defined in row: 227  

  

returns: 




 


 



		
