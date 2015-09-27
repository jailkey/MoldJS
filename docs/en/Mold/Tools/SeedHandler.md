
#Mold.Tools.SeedHandler
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Tools/SeedHandler.js  
__dna__: class  


	





__creates a seed in the current dire__


##Dependencies
--------------

* [Mold.Tools.SeedParser](../../Mold/Tools/SeedParser.md) 
* [Mold.Lib.Promise](../../Mold/Lib/Promise.md) 
* [Mold.Lib.Event](../../Mold/Lib/Event.md) 
* [Mold.Lib.MultiLineString](../../Mold/Lib/MultiLineString.md) 



   
##Methods
	
 

###info



__returns infos about the given seed__  
Defined in row: 202  

__Arguments:__  
 * __path__ (_string_) - path to the seed / seed code   * __fromCode__ (_boolean_) - if true, path will parsed as code string  
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



###infos



__returns infos about a seed and it dependencies__  
Defined in row: 223  

__Arguments:__  
 * __path__ (_string_) - the path to the seed.   * __seed__ (_string_) - name of the seed  
returns: 




 


 



		
