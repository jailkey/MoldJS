
#Mold.Lib.Model
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/Model.js  
__dna__: class  

__version__: 0.0.4  
	

__test__: [Mold.Test.Lib.Model](../../Mold/Test/Lib/Model.md) 






##Dependencies
--------------

* [Mold.Lib.Event](../../Mold/Lib/Event.md) 
* [Mold.Lib.ArrayObserver](../../Mold/Lib/ArrayObserver.md) 
* [Mold.Lib.ObjectObserver](../../Mold/Lib/ObjectObserver.md) 
* [Mold.Lib.Validation](../../Mold/Lib/Validation.md) 
* [Mold.Lib.Promise](../../Mold/Lib/Promise.md) 


##Events
--------------






   
##Methods
	
 

###_validateValue



__validate model propertys__  
Defined in row: 39  

__Arguments:__  
 
* __value__ (_string|number_) - value to validate   
* __validation__ (_string_) - name of the validation method  
returns: 




###get



__returns the model data by a given path__  
Defined in row: 172  

__Arguments:__  
 
* __an__ (_string_) - object path  
returns: 




###set



__set the model data by a given path__  
Defined in row: 194  

__Arguments:__  
 
* __path__ (_string_) - the object path   
* __data__ (_mixed_) - the data  





###validation



__enables the model validation__  
Defined in row: 218  

__Arguments:__  
 
* __state__ (_boolean_) - a boolean value with true enables the validation / false disable it  





###getProperties



__returns the model properties:__  
Defined in row: 226  

  

returns: 




###save



__saves the model data to the specified adapter__  
Defined in row: 235  

  

returns: 




###load



__loads data by the specified resourceID__  
Defined in row: 260  

__Arguments:__  
 
* __id__ (_number|string_) - the resource id  
returns: 




###remove



__removes model from the resource__  
Defined in row: 275  

  

returns: 




###connect



__connects a adapter to the model__  
Defined in row: 285  

__Arguments:__  
 
* __adapter__ (_object_) -   





###json



__returns a JSON string with the current model data__  
Defined in row: 303  

  

returns: 




 


 

##Objects
		


####data
Defined in row: 212  
Parameter: 

returns: 


		
