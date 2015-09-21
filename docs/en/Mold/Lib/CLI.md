
#Mold.Lib.CLI
---------------------------------------

file: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/CLI.js  
dna: static


	




###Dependencies
--------------

* [Mold.Lib.Event](../../Mold/Lib/Event.md) 
* [Mold.Tools.CLIForm](../../Mold/Tools/CLIForm.md) 
* [Mold.Lib.Promise](../../Mold/Lib/Promise.md) 



   
###Methods
--------------

#####showError
	shows an errormessage  
Defined in row: 53   
Arguments: 

* __error__ (_string_) - a string with a message 


#####write
	show message  
Defined in row: 64   
Arguments: 

* __message__ (_string_) - [description] 


#####ok
	show ok message  
Defined in row: 74   
Arguments: 

* __message__ (_string_) - [description] 


#####read
	read standard in  
Defined in row: 84   
Arguments: 

* __callback__ (_function_) - will be executed if the user press Enter 


#####createForm
	*	[{		 *    	label : "some question?:",		 *     	input : {		 *      	name : 'path',		 *       	type : 'filesystem',		 *        	validate : 'required',		 *         	messages : {		 *          	error : "Is not valid!",		 *           	success : function(data){		 *           		if(data === 1){		 *           			return "yuhu one!"		 *           		}		 *           	}		 *          }		 *      }		 *   }]  
Defined in row: 122   
Arguments: 

* __fields__ (_array_) - an array with the field definition 


#####exit
	exits the cli  
Defined in row: 130   
Arguments: 



#####addCompleter
	adds a custome completer  
Defined in row: 202   
Arguments: 

* ____ (_string_) - name of the completer 
* __callback__ (_function_) - completer function 


#####executeCommand
	excute the specified command  
Defined in row: 359   
Arguments: 

* __command__ (_string_) - the command 
* __parameter__ (_object_) - command parameter 


#####addCommand
	adds a new CLI Command to Mold  
Defined in row: 393   
Arguments: 

* __[command]__ (_object_) - an object with the command 


   
###Properties
-------------

   
###Objects
------------


		
