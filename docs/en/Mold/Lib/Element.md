
#Mold.Lib.Element
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/Element.js  
__dna__: class  
__author__: Jan Kaufmann  

	





	add a method to the element


###Dependencies
--------------

* [Mold.Lib.Event](../../Mold/Lib/Event.md) 
* [Mold.Lib.Promise](../../Mold/Lib/Promise.md) 
* [Mold.Lib.Info](../../Mold/Lib/Info.md) 
* [Mold.Lib.Observer](../../Mold/Lib/Observer.md) 
* [Mold.Lib.Sanitize](../../Mold/Lib/Sanitize.md) 



   
###Methods
--------------
 

#####addClass
	adds a css class to an element  
Defined in row: 309   


* __className__ (_string_) - name of the class 



#####removeClass
	removes a css class from an element  
Defined in row: 323   


* __className__ (_string_) - name of the class 



#####hasClass
	check if the element has a given css class  
Defined in row: 335   


* ____ (_string_) - className - the classname 



#####addText
	adds a css class to an element  
Defined in row: 347   





#####attr
	get or set an attribute value of an element  
Defined in row: 359   


* __attr__ (_string_) - name of the attribute 
* __value__ (_string_) - if value is given the attribute will set if not the attribute value will returned 



#####removeAttrValue
	removes a value from an attribute  
Defined in row: 381   


* __attribute__ (_string_) -  
* __value__ (_string_) -  



#####addAttrValue
	adds a value to an attribute  
Defined in row: 396   


* __attribute__ (_string_) -  
* __value__ (_string_) -  



#####containsAttrValue
	checks if an attributes contains the specified value string  
Defined in row: 409   


* __attribute__ (_string_) -  
* __value__ (_string_) -  



#####hasAttrValue
	check if an attribute has the specified value checks full words  
Defined in row: 421   


* ____ (_object_) - attribute 
* ____ (_string_) - value 



#####append
	appends an element as child element  
Defined in row: 495   


* __childElement__ (_node_) - the element that has to be appened 
* __name__ (_string_) - is name is given element gets a pointer to the child, so the child can be accessed per element.pointername 



#####after
	inserts a node after the element  
Defined in row: 510   


* __sibiling__ (_node_) - the node that has to be inserted 



#####before
	inserts a node before the element  
Defined in row: 525   


* __sibiling__ (_node_) - the node that has to be inserted 



#####val
	get / set the value of an element  
Defined in row: 536   


* __value__ (_string_) - if given the value will be set 



#####html
	set / get the inner html value of the element  
Defined in row: 563   


* __value__ (_string_) - the html value that has to be set if not given the html will returned 
* __xml__ (_boolean_) - if true the return value is a valid xml 



#####outer
	set / get the outer html value of the element  
Defined in row: 587   


* __value__ (_string_) - the html value that has to be set if not given the html will returned 
* __xml__ (_boolean_) - if true the return value is a valid xml 



#####remove
	remove the element from dom  
Defined in row: 604   





#####scrolls
	get the scoll position of an element  
Defined in row: 613   





#####getSelector
	generates an unique css selector for the element  
Defined in row: 626   





#####css
	set / get the style of an element  
Defined in row: 682   


* __property__ (_mixed_) - can be a string if only one property is effected, or if property has to be returned, if more then one property will be set it has to be an object. 
* __value__ (_string_) - if set and 'property' is not an object the value will be set 



#####sizes
	returns in object with the sizes of the element  
Defined in row: 789   





#####position
	gets the position of an element  
Defined in row: 860   





#####animate
	animates an element  
Defined in row: 897   


* __properties__ (_object_) - an object with properties and the target value 
* __duration__ (_number_) - the animation duration in seconds default is on second 
* __easing__ (_string_) - the animation easing default is ease-in-out 
* __delay__ (_number_) - the delay of the animation default is nothing 
* __iteration__ (_number/string_) - number of iterations not available on transitions 
* __fillmode__ (_string_) - the fillemode not available on transitions 



 
  
###Properties
-------------


 

###Objects
------------



		
