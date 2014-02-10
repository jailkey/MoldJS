MoldJS
======
JavaScript Structure and Pattern Framework 

##Installation

###Manual installation (bower/npm coming soon)
* Download Files
* Create directory and extract files
* Create Index.html and include following in the head:

```html
<script  src="Mold.js" type="text/javascript"  data-mold-main="Mold.Main"></script>
``` 

Now Mold.js try to load /Mold/Main.js. 
If you use the default repository, this file is defined as a "Mold-Modul" called "Seed".
The Seed will be executed after all dependencies are loaded.


##Building a Module (Seed)

###Module-structure
In Mold every Seed has his own directory. The directory/file-structure represents the object-structure in JavaScript.
A module with the dir/file structure /Mold/Misc/MySeed.js becomes in JavaScript to Mold.Misc.MySeed.
It works like package-managers in other programming enviroments.

###Create a Modulefile
A Seed file must have the same name like the Seed and you have to put it in the right place in the structur.
Every Seed have two required propertys, "name" the seed name, and dna, the seed pattern.

```javascript
Seed({
		//represents the file- and the object-structure 
		name : "Mold.Misc.MySeed",
		//defines how the Seed will be executed
		dna : "static" 
	},
	function(){
		//The code of the Seed, in case of dna "static" it can be every valid JavaScript code,
		//the main thing is that it is writen in a clousure.

		return {
			doSomething : function(){
				console.log("something")
			}
		}
	}
);
```

###Import other Seeds and describe dependencies
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

##Useing different repositories
In a realworld scenario it come in handy to use different repositories for the core and your application.
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
All dependecies in the external Seed will loaded from the external repository.
The path of the external repository can include another domain, cause Seeds will loaded via JSONP.


##Use different dna
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

Here is a short description of every type:

####dna
The dna with the name dna defines a new dna ;)
This is an extra chapter, so lets save it for later.

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
	You can use it for global configurations or to exchange data between objects.

*/
```

####class
The "class" dna defines a Seed as a class, it added options for extending another class, and for defining "pivate" and "public" propertys/methods.
A Seed with the dna "class" must instanced with the keyword new. So there can be more then one instance.

Example:
```javascript
Seed({
		name : "Mold.Misc.MySeed",
		dna : "class",
		//with the extend property in a Seed, with class dna, you can extend another Seed
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

	Now we can access the public methodes but not the private.

	myTest.publicMethod() outputs "calling a public method" on the console,

	myTest._myPrivateProperty throws an error cause you have no access to private propertys.

	myTest.callingAPrivate() logs "value of my private property" cause the method can access the private property

	In the code on the top, you see the extend property is extending the "Mold.Lib.Ajax" Seed.
	Now you can access every public propertys/methods from Mold.Lib.Ajax. 
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
);
```

####other dna
If you need other dna like controller, model, view, urlrouter etc. you can load it like other seeds.

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
		//this seed will executed as a controller
	}
);
```
You can find all DNA Seeds in Mold/DNA/

It's possible to write your own dna, an example will follow in a later chapter.


###useing controller
Controllers are one of the most important things in Mold, they are the connector between dom, views, models and classes 
and they act if special events will happen. Controllers are isomorphic, like the most Seeds you can use it in the Browser and node.js.

There are some ways to create a controller, the simplest way is to use the controller dna.

```javascript
Seed({
		name : "Mold.Misc.MySeed",
		dna : "controller",
		include : [
			"external->Mold.DNA.Controller",
			"Mold.Misc.View"
		]
	},
	function(){
		//this seed will executed as a controller

		//use register to delegate events from a Seed to the controller
		var view = this.register(new Mold.Misc.View());
		
		//To react with an event in a controller you can define the "actions" object:
		this.actions = {
			"@url.changed" : function(){
				//do something if the url changes 
			},
			"@click.view" : function(){
				//do somthing if a element is clicked in the view
			}
		}
	}
);
```

As you see there are some special controller properties and methods.
Most important are the register methode and the actions object.

###using the url router
To react on url changes you can use the "urlrouter" dna.
Mostly the main seed will be an urlrouter

```javascript
Seed({
		name : "Mold.Main",
		dna : "urlrouter",
		onhashchange : "update",
		include : [
			"external->Mold.DNA.UrlRouter"
		]
	},
	{
		//The router expects a collection of routes
		//Start with / if you will react on the path
		//If the value is "@ready->" and a seed is following, 
		//the router wait until the dom is loaded, after it loads and executes the seed
		"/" : "@read->Mold.Misc.MySeed",

		//if you start with a # the route acts if the hash changes.
		//Use @something to trigger a globale event, you can catch it in the controller
		"#somethig" : "@url.changed"
	}
);
```

There are much more options to use an urlrouter, you can define variables with * or : , 
on serverside you can react on the http request message with GET/POST/DELETE/PUT.

For more infos look at the API description. (coming soon ;))

p.s. On serversite use "sessionrouter" dna, cause a urlrouter is global an trigger the events for all users


###build a model
Models in Model are handeld like JSON Object, but they can additional fire events change and validation events and sync data with the backend. You can use it as a class or dna.

```javascript
Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Lib.Model",
			"external->Mold.Adapter.Rest"
		]
	},
	function(){

		//create a model
		var model = new Mold.Lib.Model({
			//define the model stucture
			properties : {
				list : [
					{ entry : "string" }
				],
				myproperty : "string"
			},
			//define how to sync the model
			adapter : new Mold.Adapter.Rest({ path : "my/rest/route/" })
		});

		//define some events
		model.data.on("property.change.myproperty", function(e){
			console.log("Myproperty has change!", "New value is:" + e.data.value);
		})

		//trigger the event 
		model.data.myproperty = "something";

		//use save() to save the data via the given adapter (in our case it sends a POST-request with models data);
		model.save();

		//if you want to use validation turn it on
		model.validation(true);

		//define an event
		model.data.on("validation.error", function(e){
			console.log("Validation Error at", e.data.name);
		});

		//triggers an error, cause the property validation is string, not number
		model.data.myproperty = 5;


	}
);
```
There are much more model options, but there is no documention for it (at the moment);


###create a template
To create a template use Mold.Lib.Template class or template dna, you can create templates from dom elements, strings, or special function syntax:



```javascript
Seed({
		name : "Mold.Main",
		dna : "action",
		include : [
			"external->Mold.Lib.Template"
		]
	},
	function(){

		//Create a Template with special function syntax
		var template = new Mold.Lib.Template(function(){
			/*|

				<div class="irgendwas">
					{{myproperty}}
				</div>
			|*/
		});

		//add some content
		template.append({ myproperty : "some value"});

		//append to document
		document.body.appendChild(template.get());

	
	}
);
```











##Deutsche Dokumentation
###[Einleitung](https://github.com/jailkey/MoldJS/wiki/MoldJS-Einleitung)


