
#Mold
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold.js  
__dna__:   
__author__: Jan Kaufmann <jan@moldjs.de>  
__version__: 0.0.28;  *  
	





__This callback is displayed as part of the Requester class.__


##Dependencies
--------------




   
##Methods
	
 

###getDependencies



__returns all Depencies from a seed header in a list__  
Defined in row: 491  

__Arguments:__  
 * __header__ (_object_) - a seed header with an include property  
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



###trim



__Mold__  
Defined in row: 542  

__Arguments:__  
 * __phrase__ (_string_) - string with leading and ending whitespaces  
returns: 




###each



__iterates through an List (Object, Array)__  
Defined in row: 577  

__Arguments:__  
 * __collection__ (_object_) - the list   * __iterator__ (_function_) - a callback function   * __context__ (_object_) - optional context Object  
returns: 




###eachShift



__iterates through an array and remove the selected item until the array is empty__  
Defined in row: 623  

__Arguments:__  
 * __collection__ (_array_) - the array   * __callback__ (_function_) - method will called on each entry, given paramter is the entry value  





###find



__find a specified value in an array__  
Defined in row: 646  

__Arguments:__  
 * __collection__ (_object_) - the list   * __iterator__ (_function_) - a callback function   * __context__ (_object_) - context Object  
returns: 




###some



__iterates through an array until the specified callback returns false__  
Defined in row: 667  

__Arguments:__  
 * __collection__ (_object_) - the list   * __iterator__ (_function_) - a callback function   * __context__ (_object_) - context Object  
returns: 




###reject



__compares all values in an array__  
Defined in row: 706  

__Arguments:__  
 * __collection__ (_array_) - an array to compare   * __iterator__ (_function_) - callback that wich is executet on every entry  
returns: 




###keys



__returns an Array with the key of an object__  
Defined in row: 781  

__Arguments:__  
 * __collection__ (_object_) - Expects an object  
returns: 




###contains



__checks if a list contains a value__  
Defined in row: 806  

__Arguments:__  
 * __list__ (_array/object/sting_) -    * __needel__ (_stirng_) -   
returns: 




###is



__test if a variable is defined__  
Defined in row: 825  

__Arguments:__  
 * __value__ (_mixed_) -   
returns: 




###isArray



__checks if the give value is an array__  
Defined in row: 879  

__Arguments:__  
 * __collection__ (_object_) - the value  
returns: 




###isObject



__checks if the give value is an object__  
Defined in row: 897  

__Arguments:__  
 * __collection__ (_object_) - the value  
returns: 




###isNodeList



__checks if the give value is a NodeListe__  
Defined in row: 912  

__Arguments:__  
 * __collection__ (_object_) - the value  
returns: 




###ready



__Fires if the dom is ready__  
Defined in row: 960  

__Arguments:__  
 * __callback__ (_readycallback_) - Expected a callback, fires if the dom and Mold.js is ready  





###addDNA



__Add a DNA pattern to Mold.js__  
Defined in row: 984  

__Arguments:__  
 * __dna__ (_object_) - Expected an object of type DNA  





###getDNA



__Returns a DNA pattern from the specified name__  
Defined in row: 997  

__Arguments:__  
 * __Expected__ (_dnaname_) - the name of the pattern  
returns: 




###add



__Adds a value to an specified cue__  
Defined in row: 1027  

__Arguments:__  
 * __type__ (_string_) - Expects the name of the cue   * __name__ (_string_) - Expects the name of the entry   * __value__ (_mixing_) - Expects the value  





###remove



__Removes an entry from the specified cue__  
Defined in row: 1039  

__Arguments:__  
 * __type__ (_string_) - Expects the name of the cue   * __name__ (_string_) - Expects the name of the entry  





###get



__Returns a specified cue value__  
Defined in row: 1050  

__Arguments:__  
 * __type__ (_string_) - Expects the name of the cue   * __name__ (_string_) - Expects the name of the entry  
returns: 




###getType



__Returns a specified cue object__  
Defined in row: 1060  

__Arguments:__  
 * __type__ (_string_) - Expects the name of the cue  
returns: 




###removeType



__Deletes a specified cue__  
Defined in row: 1070  

__Arguments:__  
 * __name__ (_string_) - Expects the name of the entry, to be deleted  





###log



__Logs an entry__  
Defined in row: 1082  

__Arguments:__  
 * __type__ (_string_) - Expects the entry type of the logmessage. Predefined values are "Error", "Info" and "Debug", but you can define your own, if necessary.   * __message__ (_string|object_) - Expects the message that will be logged, when the type is "Error" the parameter expects an object with the property "code". This property contains the errorcode.  





###onlog



__Fires if a Message wil be logged__  
Defined in row: 1102  

__Arguments:__  
 * __callback__ (_onlogcallback_) - Expects a callback to be fired if a message will be logged  





###getScope



__returns an object with the current scope__  
Defined in row: 1111  

  

returns: 




###addLoadingProperty



__Tells Mold.js which properties of a Seed are "loading properties". These properties include a reference to other seeds. This method will be used to build new DNA.__  
Defined in row: 1163  

__Arguments:__  
 * __propertyName__ (_string_) - The name of the property to be added.  





###getLoadingproperties



__Returns a list of all "loading properties"__  
Defined in row: 1171  

  

returns: 




###getSeed



__Returns a seed specified by name__  
Defined in row: 1184  

__Arguments:__  
 * __name__ (_string_) - Expects the name of the seed (seed chain)  
returns: 




###getSeedChainName



__Returns the seed chain from the seed object without the root object__  
Defined in row: 1202  

__Arguments:__  
 * __seed__ (_object_) - Expects a seed object  
returns: 




###getTargetName



__Returns the name of the root object of a Seed__  
Defined in row: 1211  

__Arguments:__  
 * __seed__ (_object_) - Expects a seed object  
returns: 




###createChain



__Creats a seed object chain in Mold.js scope. If an object allready exists it will not overwritten. For nonexistent objects an empty namespace will created.__  
Defined in row: 1220  

__Arguments:__  
 * __targets__ (_string_) - Expects an String with the seed chain  
returns: 




###checkSeedCue



__Checks the seedcue for new entrys. If a new entry was found it will be added to Mold.js__  
Defined in row: 1228  

  






###addSeed



__Adds a Seed to Mold.js__  
Defined in row: 1278  

__Arguments:__  
 * __seed__ (_object_) - Expects a seed object  





###loadScript



__Loads a specified Script__  
Defined in row: 1499  

__Arguments:__  
 * __path__ (_string_) - Expects the scriptpath   * __success__ (_loadscriptsuccsess_) - Expects a callback to be executed when the script is successfully loaded   * __error__ (_loadscripterror_) - Expects a callback to be executed if there is a loading error  





###loadScriptSuccsess




__returns all Depencies from a seed header in a list__  
Defined in row: 1572  

  






###loadScriptError



__Creats a seed object chain in Mold.js scope, if an object allready exists it will not be overwritten. For not existing object an empty namespace will created.__  
Defined in row: 1577  

  






###addLoadingRule



__adds a rule to control the loading process__  
Defined in row: 1585  

__Arguments:__  
 * __name__ (_string_) - Expects the name of the rule   * __a__ (_function_) - function with a control statement  





###checkLoadedConf



__checks if a config ist loaded__  
Defined in row: 1614  

__Arguments:__  
 * __conf__ (_object_) - the configuration  
returns: 




###load



__Load the specified Seed__  
Defined in row: 1635  

__Arguments:__  
 * __seed__ (_object_) - Expects a seed object  
returns: 




###addMethod



__Add a method to Mold.js, methodes with equal names will overwriten__  
Defined in row: 1716  

__Arguments:__  
 * __name__ (_string_) - Expects the method name   * __method__ (_function_) - Expects a function with the method code  





###importSeeds



__Import Seeds from array of objects to target seed__  
Defined in row: 1728  

__Arguments:__  
 * __target__ (_function_) - the target seed   * __method__ (_array_) - an array of objects  





###injectBefore



__Injects code at the beginning of a Functionobject;__  
Defined in row: 1748  

__Arguments:__  
 * __func__ (_function_) - Expects a function object   * __code__ (_string_) - Expects code to be injected  





###extend



__Inherited methods from a superclass to a class__  
Defined in row: 1778  

__Arguments:__  
 * __superClass__ (_class_) - Expected the superclass   * __subClass__ (_class_) - Expeted a Class  
returns: 




###mixin



__Adds Methods from one Object to another__  
Defined in row: 1815  

__Arguments:__  
 * __target__ (_object_) - Expects the target object   * __origin__ (_object_) - Expects the origin object   * __selected__ (_array_) - Expects an array with the property- and methodenames that will be copied, the parameter is optional, if it is not given, all methodes an parametes will be copied  
returns: 




###copy



__copys an array or an object__  
Defined in row: 1842  

__Arguments:__  
 * __target__ (_mixed_) - the array or object to copy  
returns: 




###getId



__returns a uinque ID__  
Defined in row: 1868  

  

returns: 




###callWithDynamicArguments



__Wraps a constructor and call it with dynamic arguments;__  
Defined in row: 1881  

__Arguments:__  
 * __constructor__ (_function_) - Expects the target constructor   * __arguments__ (_array_) - Expects an array with the arguments  
returns: 




###wrap



__Wraps a Class with a second constructor, so you can execute methods in the scope of the targetclass__  
Defined in row: 1895  

__Arguments:__  
 * __targetClass__ (_class_) - Expects the class will be wraped   * __wrappingMethode__ (_function_) - Expects the method that will be executed, as parameter the scope of the instance will transfered  
returns: 




 
  
##Properties



####isNodeJS
	Contains true if Mold.js runs on the Server under Nods.js, otherwith it contains false  
Defined in row: 952  
returns: 

####startime
	inculdes the time, when Mold is constructed, you can use it to measure Molds loadingtime  
Defined in row: 971  


 

##Objects
		


####cue
Defined in row: 1018  
Parameter: 

returns: 


		
