
#Mold
---------------------------------------

file: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold.js  
dna: 


	




###Dependencies
--------------




   
###Methods
--------------

#####getDependencies
	returns all Depencies from a seed header in a list  
Defined in row: 478   
Arguments: no

* __header__ (_object_) - a seed header with an include property 


#####trim
	Mold  
Defined in row: 529   
Arguments: 

* __phrase__ (_string_) - string with leading and ending whitespaces 


#####each
	iterates through an List (Object, Array)  
Defined in row: 564   
Arguments: 

* __collection__ (_object_) - the list 
* __iterator__ (_function_) - a callback function 
* __context__ (_object_) - optional context Object 


#####eachShift
	iterates through an array and remove the selected item until the array is empty  
Defined in row: 610   
Arguments: 

* __collection__ (_array_) - the array 
* __callback__ (_function_) - method will called on each entry, given paramter is the entry value 


#####find
	find a specified value in an array  
Defined in row: 633   
Arguments: 

* __collection__ (_object_) - the list 
* __iterator__ (_function_) - a callback function 
* __context__ (_object_) - context Object 


#####some
	iterates through an array until the specified callback returns false  
Defined in row: 654   
Arguments: 

* __collection__ (_object_) - the list 
* __iterator__ (_function_) - a callback function 
* __context__ (_object_) - context Object 


#####reject
	compares all values in an array  
Defined in row: 693   
Arguments: 

* __collection__ (_array_) - an array to compare 
* __iterator__ (_function_) - callback that wich is executet on every entry 


#####keys
	returns an Array with the key of an object  
Defined in row: 768   
Arguments: 

* __collection__ (_object_) - Expects an object 


#####contains
	checks if a list contains a value  
Defined in row: 793   
Arguments: 

* __list__ (_array/object/sting_) -  
* __needel__ (_stirng_) -  


#####is
	test if a variable is defined  
Defined in row: 812   
Arguments: 

* __value__ (_mixed_) -  


#####isArray
	checks if the give value is an array  
Defined in row: 866   
Arguments: 

* __collection__ (_object_) - the value 


#####isObject
	checks if the give value is an object  
Defined in row: 884   
Arguments: 

* __collection__ (_object_) - the value 


#####isNodeList
	checks if the give value is a NodeListe  
Defined in row: 899   
Arguments: 

* __collection__ (_object_) - the value 


#####ready
	Fires if the dom is ready  
Defined in row: 947   
Arguments: 

* __callback__ (_readycallback_) - Expected a callback, fires if the dom and Mold.js is ready 


#####addDNA
	Add a DNA pattern to Mold.js  
Defined in row: 971   
Arguments: 

* __dna__ (_object_) - Expected an object of type DNA 


#####getDNA
	Returns a DNA pattern from the specified name  
Defined in row: 984   
Arguments: 

* __Expected__ (_dnaname_) - the name of the pattern 


#####add
	Adds a value to an specified cue  
Defined in row: 1014   
Arguments: 

* __type__ (_string_) - Expects the name of the cue 
* __name__ (_string_) - Expects the name of the entry 
* __value__ (_mixing_) - Expects the value 


#####remove
	Removes an entry from the specified cue  
Defined in row: 1026   
Arguments: 

* __type__ (_string_) - Expects the name of the cue 
* __name__ (_string_) - Expects the name of the entry 


#####get
	Returns a specified cue value  
Defined in row: 1037   
Arguments: 

* __type__ (_string_) - Expects the name of the cue 
* __name__ (_string_) - Expects the name of the entry 


#####getType
	Returns a specified cue object  
Defined in row: 1047   
Arguments: 

* __type__ (_string_) - Expects the name of the cue 


#####removeType
	Deletes a specified cue  
Defined in row: 1057   
Arguments: 

* __name__ (_string_) - Expects the name of the entry, to be deleted 


#####log
	Logs an entry  
Defined in row: 1069   
Arguments: 

* __type__ (_string_) - Expects the entry type of the logmessage. Predefined values are "Error", "Info" and "Debug", but you can define your own, if necessary. 
* __message__ (_string|object_) - Expects the message that will be logged, when the type is "Error" the parameter expects an object with the property "code". This property contains the errorcode. 


#####onlog
	Fires if a Message wil be logged  
Defined in row: 1089   
Arguments: 

* __callback__ (_onlogcallback_) - Expects a callback to be fired if a message will be logged 


#####getScope
	returns an object with the current scope  
Defined in row: 1098   
Arguments: 



#####addLoadingProperty
	Tells Mold.js which properties of a Seed are "loading properties". These properties include a reference to other seeds. This method will be used to build new DNA.  
Defined in row: 1150   
Arguments: 

* __propertyName__ (_string_) - The name of the property to be added. 


#####getLoadingproperties
	Returns a list of all "loading properties"  
Defined in row: 1158   
Arguments: 



#####getSeed
	Returns a seed specified by name  
Defined in row: 1171   
Arguments: 

* __name__ (_string_) - Expects the name of the seed (seed chain) 


#####getSeedChainName
	Returns the seed chain from the seed object without the root object  
Defined in row: 1189   
Arguments: 

* __seed__ (_object_) - Expects a seed object 


#####getTargetName
	Returns the name of the root object of a Seed  
Defined in row: 1198   
Arguments: 

* __seed__ (_object_) - Expects a seed object 


#####createChain
	Creats a seed object chain in Mold.js scope. If an object allready exists it will not overwritten. For nonexistent objects an empty namespace will created.  
Defined in row: 1207   
Arguments: 

* __targets__ (_string_) - Expects an String with the seed chain 


#####checkSeedCue
	Checks the seedcue for new entrys. If a new entry was found it will be added to Mold.js  
Defined in row: 1215   
Arguments: 



#####addSeed
	Adds a Seed to Mold.js  
Defined in row: 1265   
Arguments: 

* __seed__ (_object_) - Expects a seed object 


#####loadScript
	Loads a specified Script  
Defined in row: 1470   
Arguments: 

* __path__ (_string_) - Expects the scriptpath 
* __success__ (_loadscriptsuccsess_) - Expects a callback to be executed when the script is successfully loaded 
* __error__ (_loadscripterror_) - Expects a callback to be executed if there is a loading error 


#####loadScriptSuccsess

	returns all Depencies from a seed header in a list  
Defined in row: 1542   
Arguments: 



#####loadScriptError
	Creats a seed object chain in Mold.js scope, if an object allready exists it will not be overwritten. For not existing object an empty namespace will created.  
Defined in row: 1547   
Arguments: 



#####addLoadingRule
	adds a rule to control the loading process  
Defined in row: 1555   
Arguments: 

* __name__ (_string_) - Expects the name of the rule 
* __a__ (_function_) - function with a control statement 


#####load
	Load the specified Seed  
Defined in row: 1583   
Arguments: 

* __seed__ (_object_) - Expects a seed object 


#####addMethod
	Add a method to Mold.js, methodes with equal names will overwriten  
Defined in row: 1656   
Arguments: 

* __name__ (_string_) - Expects the method name 
* __method__ (_function_) - Expects a function with the method code 


#####importSeeds
	Import Seeds from array of objects to target seed  
Defined in row: 1668   
Arguments: 

* __target__ (_function_) - the target seed 
* __method__ (_array_) - an array of objects 


#####injectBefore
	Injects code at the beginning of a Functionobject;  
Defined in row: 1688   
Arguments: 

* __func__ (_function_) - Expects a function object 
* __code__ (_string_) - Expects code to be injected 


#####extend
	Inherited methods from a superclass to a class  
Defined in row: 1718   
Arguments: 

* __superClass__ (_class_) - Expected the superclass 
* __subClass__ (_class_) - Expeted a Class 


#####mixin
	Adds Methods from one Object to another  
Defined in row: 1755   
Arguments: 

* __target__ (_object_) - Expects the target object 
* __origin__ (_object_) - Expects the origin object 
* __selected__ (_array_) - Expects an array with the property- and methodenames that will be copied, the parameter is optional, if it is not given, all methodes an parametes will be copied 


#####getId
	returns a uinque ID  
Defined in row: 1781   
Arguments: 



#####callWithDynamicArguments
	Wraps a constructor and call it with dynamic arguments;  
Defined in row: 1794   
Arguments: 

* __constructor__ (_function_) - Expects the target constructor 
* __arguments__ (_array_) - Expects an array with the arguments 


#####wrap
	Wraps a Class with a second constructor, so you can execute methods in the scope of the targetclass  
Defined in row: 1808   
Arguments: 

* __targetClass__ (_class_) - Expects the class will be wraped 
* __wrappingMethode__ (_function_) - Expects the method that will be executed, as parameter the scope of the instance will transfered 


   
###Properties
-------------

#####isNodeJS
	Contains true if Mold.js runs on the Server under Nods.js, otherwith it contains false  
Defined in row: 939  


#####startime
	inculdes the time, when Mold is constructed, you can use it to measure Molds loadingtime  
Defined in row: 958  


   
###Objects
------------

#####cue
Defined in row: 1005  
Parameter: 

returns: 


		
