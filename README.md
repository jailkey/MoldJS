MoldJS
======
JavaScript Structure and Pattern Framework 

##Installation

###Manual installation (bower/npm coming soon)
* Download Files
* Create directory and extract files
* Create Index.html with and include following in the head:

```html
<script  src="Mold.js" type="text/javascript"  data-mold-main="Mold.Main"></script>
``` 

Now Mold.js try to load /Mold/Main.js. 
If you use the default repository, this file is defined as a "Mold-Modul" called "Seed".
The Seed will be executed after all dependencys are loaded and the dom is ready, cause the Seed dna is "action", of which more in the next chappter.



##Building a Module (Seed)

###Module-structure
In Mold every Seed has his own directory. The directory/file-structure represents the object-structure in JavaScript.
A module with the dir/file-structure /Mold/Misc/MySeed.js becomes in JavaScript to Mold.Misc.MySeed
It works like package-managers in other programming enviroments.

###Create a Modulefile
A Seed file must have the same name like the Seed and you have to put it in the right place in the structur.
Every see have two required propertys, "name" the seed name, and dna, the seed pattern.

```javascript
Seed({
		//represents the file- and the object-structure and the
		name : "Mold.Misc.MySeed",
		//defines how the Seed will be executed
		dna : "static" 
	},
	function(){
		//The code of the Seed, in case of dna "static" it can be every valid JavaScript code, the main thing is that it is writen in a clousure.

		return {
			doSomething : function(){
				console.log("something")
			}
		}
	}
);
```

###Import other Seeds and describe dependencys
Now we have created a Seed and we will use it in another, therefor we have the Seed-property "include".

```javascript
Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"Mold.Misc.MySeed"
		]
	},
	function(){
		//if all dependencies are loaded and dom is ready excute:
		Mold.Misc.MySeed.doSomething();
		//console output is "something"
	}
);
```
The "include" property is optional and can be a string or an array.

##Useing diffrent repositories
In a realworld scenario it come in handy to use diffrent repositories for the core and your application.
Mold provides an easy way to do that:

```html
<script 
	data-mold-main="Mold.Main"
	data-mold-repository=""
	data-mold-external-repository="http://yourdomain.com/externalrepro/"
	src="Mold.js" type="text/javascript"
></script>
```
After you add the path to the external repository, you can get external Seeds in the include property with the prefix "external->".

```javascript
Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Lib.Ajax"
		]
	},
	function(){
		var ajax =  new Mold.Lib.Ajax();
	}
);
```
All dependecies in external Seed will loaded from the external repository.
The path of the external repository can include another domain, cause Seeds will loaded via JSONP.


##Use diffrent dna
The dna of a Seed defines how the Seed will be executed, the dna can preparse code, inject dependecies, check the interface or excute special seed property.
Simply put, it defines a pattern.

###Build-in dna
There are six types of dna build in:
* dna
* static
* class
* singelton 
* data
* action

Here is a short description of ever type:

####dna
The dna with the name dna defines a new dna ;)
This is an extra chappter so lets save it for later.

####static
A Seed with a static dna will be executed, after all dependecies are loaded.
The result will inserted to the object chain (seed chain).

Example: 
```javascript
Seed({
		name : "Mold.Misc.MySeed",
		dna : "static"
	},
	function(){
		return {
			doSomething : function(){
				console.log("something")
			}
		}
	}
);‚

/*
	If we include this seed, we can access via Mold.Lib.MySeed 
	and excute the doSomthing method via Mold.Lib.MySeed.doSomthing().
	A Seed with the dna "static" exists only once, no matter how much Seeds include this Seed.
	You can use it for global configurations or, to change data between objects.

*/
```

####class
The "class" dna defines a Seed as class, it added options for extending another class, and for defining "pivate" and "public" propertys/methodes.
A Seed with the dna "class" must instanced with the keyword new. So there can be more the one instance.

Example:
```javascript
Seed({
		name : "Mold.Misc.MySeed",
		dna : "class",
		//with the extend property in a Seed with class dna you can extend another Seed
		extend : "external->Mold.Lib.Ajax"
	},
	function(){

		//defines a private property;
		var _myPrivateProperty = "value of my private property"; 

		this.publics = {
			publicMethod : function(){
				console.log("calling a public method");
			},
			callingAPrivate : function(){
				console.log(_myPrivateProperty);
			},
			getFile : function(){
				//Calling a method from the extended class
				this.send("url/to/my/file", false, { method : "GET"});
			}
		}
	}
);


/*
	After we include this example we can create a new instance with:
	
	var myTest = new Mold.Misc.MySeed();

	Now we ca access the public Methodes but not the private

	myTest.publicMethod() outputs "calling a public method" on the console,

	myTest._myPrivateProperty throws an error cause you have no access to private propertys

	myTest.callingAPrivate() logs "value of my private property" cause the method can access the private property

	At the code in the top you see the extend property is extending the "Mold.Lib.Ajax" Seed.
	Now you can use every public propertys/methods from Mold.Lib.Ajax. 
	All this propertys/methodes are in the "this" scope, so in the example we can call a the send method from the Ajax class.

*/

```


####singelton
Dna of the type singelton extend the class dna.
You can used it like a class, but there is only one instance.

Example
```javascript
Seed({
		name : "Mold.Misc.MySeed",
		dna : "singelton"
	},
	function(){

		var _value = "";

		this.publics = {
			set : function(value){
				_value = value;
			},
			get : function(){
				return _value;
			}
		}
	}
);

/*
	create instances:

	var instanceOne = new Mold.Misc.MySeed();
	var instanceTwo = new Mold.Misc.MySeed();

	now intanceOne and intanceTwo are the same;
	if you set one of them you can get the value from the other:

	instanceOne.set("some value");
	instanceTwo.get() it returns "some value";
*/
```

####data
The "data" dna saves data in the structure, it expects data in JSON format.

Example
```javascript
Seed({
		name : "Mold.Misc.MySeed",
		dna : "data"
	},
	{	
		dataProperty : "mydatavalue"
	}
);

/*
	after loading you can call:

	Mold.Misc.MySeed.dataProperty

	and you get "mydatavalue"
*/
```

####action
If you give the "action" dna to a Seed, the Seed will executed after all dependecies are loaded.
In simple apps you can use it for the main Seed as glue code.

Example
```javascript
Seed({
		name : "Mold.Main",
		dna : "action"
	},
	function(){
		console.log("this message will be logged after this Seed is loaded.");
	}
}
);
```

####other dna
If you need other dna, like controller, model, view, urlrouter etc. you can load it like other seeds.

Example
```javascript
Seed({
		name : "Mold.Misc.MySeed",
		dna : "controller",
		include : [
			"external->Mold.DNA.Controller"
		]
	},
	function(){
		//this seed will handeld like a controller
	}
}
);
```



##Deutsche Dokumentation
###[Einleitung](https://github.com/jailkey/MoldJS/wiki/MoldJS-Einleitung)


