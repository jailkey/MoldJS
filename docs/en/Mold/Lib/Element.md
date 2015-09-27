
#Mold.Lib.Element
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/Element.js  
__dna__: class  
__author__: Jan Kaufmann  

	





__add a method to the element__


##Dependencies
--------------

* [Mold.Lib.Event](../../Mold/Lib/Event.md) 
* [Mold.Lib.Promise](../../Mold/Lib/Promise.md) 
* [Mold.Lib.Info](../../Mold/Lib/Info.md) 
* [Mold.Lib.Observer](../../Mold/Lib/Observer.md) 
* [Mold.Lib.Sanitize](../../Mold/Lib/Sanitize.md) 



   
##Methods
	
 

###addClass



__adds a css class to an element__  
Defined in row: 309  

__Arguments:__  
 * __className__ (_string_) - name of the class  
returns: 




###removeClass



__removes a css class from an element__  
Defined in row: 323  

__Arguments:__  
 * __className__ (_string_) - name of the class  
returns: 




###hasClass



__check if the element has a given css class__  
Defined in row: 335  

__Arguments:__  
 * ____ (_string_) - className - the classname  
returns: 




###addText



__adds a css class to an element__  
Defined in row: 347  

  






###attr



__get or set an attribute value of an element__  
Defined in row: 359  

__Arguments:__  
 * __attr__ (_string_) - name of the attribute   * __value__ (_string_) - if value is given the attribute will set if not the attribute value will returned  
returns: 




###removeAttrValue



__removes a value from an attribute__  
Defined in row: 381  

__Arguments:__  
 * __attribute__ (_string_) -    * __value__ (_string_) -   
returns: 




###addAttrValue



__adds a value to an attribute__  
Defined in row: 396  

__Arguments:__  
 * __attribute__ (_string_) -    * __value__ (_string_) -   
returns: 




###containsAttrValue



__checks if an attributes contains the specified value string__  
Defined in row: 409  

__Arguments:__  
 * __attribute__ (_string_) -    * __value__ (_string_) -   
returns: 




###hasAttrValue



__check if an attribute has the specified value checks full words__  
Defined in row: 421  

__Arguments:__  
 * ____ (_object_) - attribute   * ____ (_string_) - value  
returns: 




###append



__appends an element as child element__  
Defined in row: 495  

__Arguments:__  
 * __childElement__ (_node_) - the element that has to be appened   * __name__ (_string_) - is name is given element gets a pointer to the child, so the child can be accessed per element.pointername  
returns: 




###after



__inserts a node after the element__  
Defined in row: 510  

__Arguments:__  
 * __sibiling__ (_node_) - the node that has to be inserted  
returns: 




###before



__inserts a node before the element__  
Defined in row: 525  

__Arguments:__  
 * __sibiling__ (_node_) - the node that has to be inserted  
returns: 




###val



__get / set the value of an element__  
Defined in row: 536  

__Arguments:__  
 * __value__ (_string_) - if given the value will be set  
returns: 




###html



__set / get the inner html value of the element__  
Defined in row: 636  

__Arguments:__  
 * __value__ (_string_) - the html value that has to be set if not given the html will returned   * __xml__ (_boolean_) - if true the return value is a valid xml  
returns: 




###outer



__set / get the outer html value of the element__  
Defined in row: 660  

__Arguments:__  
 * __value__ (_string_) - the html value that has to be set if not given the html will returned   * __xml__ (_boolean_) - if true the return value is a valid xml  
returns: 




###remove



__remove the element from dom__  
Defined in row: 677  

  






###scrolls



__get the scoll position of an element__  
Defined in row: 686  

  

returns: 




###getSelector



__generates an unique css selector for the element__  
Defined in row: 699  

  

returns: 




###css



__set / get the style of an element__  
Defined in row: 755  

__Arguments:__  
 * __property__ (_mixed_) - can be a string if only one property is effected, or if property has to be returned, if more then one property will be set it has to be an object.   * __value__ (_string_) - if set and 'property' is not an object the value will be set  
returns: 




###sizes



__returns in object with the sizes of the element__  
Defined in row: 862  

  

returns: 




###position



__gets the position of an element__  
Defined in row: 933  

  

returns: 




###animate



__animates an element__  
Defined in row: 970  

__Arguments:__  
 * __properties__ (_object_) - an object with properties and the target value   * __duration__ (_number_) - the animation duration in seconds default is on second   * __easing__ (_string_) - the animation easing default is ease-in-out   * __delay__ (_number_) - the delay of the animation default is nothing   * __iteration__ (_number/string_) - number of iterations not available on transitions   * __fillmode__ (_string_) - the fillemode not available on transitions  
returns: 




 


 



		
