
#Mold.Lib.CLI
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/CLI.js  
__dna__: static  


	





__colors and symboles you could use to format your cli output__


##Dependencies
--------------

* [Mold.Lib.Event](../../Mold/Lib/Event.md) 
* [Mold.Tools.CLIForm](../../Mold/Tools/CLIForm.md) 
* [Mold.Lib.Promise](../../Mold/Lib/Promise.md) 



   
##Methods
	
 

###showError



__shows an errormessage__  
Defined in row: 53  

__Arguments:__  
 * __error__ (_string_) - a string with a message  
returns: 




###write



__show message__  
Defined in row: 64  

__Arguments:__  
 * __message__ (_string_) - [description]  
returns: 




###ok



__show ok message__  
Defined in row: 74  

__Arguments:__  
 * __message__ (_string_) - [description]  
returns: 




###read



__read standard in__  
Defined in row: 84  

__Arguments:__  
 * __callback__ (_function_) - will be executed if the user press Enter  
returns: 




###createForm



__*	[{		 *    	label : "some question?:",		 *     	input : {		 *      	name : 'path',		 *       	type : 'filesystem',		 *        	validate : 'required',		 *         	messages : {		 *          	error : "Is not valid!",		 *           	success : function(data){		 *           		if(data === 1){		 *           			return "yuhu one!"		 *           		}		 *           	}		 *          }		 *      }		 *   }]__  
Defined in row: 122  

__Arguments:__  
 * __fields__ (_array_) - an array with the field definition  
returns: 




###exit



__exits the cli__  
Defined in row: 130  

  

returns: 




###addCompleter



__adds a custome completer__  
Defined in row: 202  

__Arguments:__  
 * ____ (_string_) - name of the completer   * __callback__ (_function_) - completer function  





###executeCommand



__excute the specified command__  
Defined in row: 356  

__Arguments:__  
 * __command__ (_string_) - the command   * __parameter__ (_object_) - command parameter  





###addCommand



__adds a new CLI Command to Mold__  
Defined in row: 390  

__Arguments:__  
 * __[command]__ (_object_) - an object with the command  



__Example:__  
**

```
{				command : 'name of the command',				parameter : {					'-name' : {						'description' : 'description value',					}				},				execute : function(parameter, cli){									}			}

```  



 


 



		
