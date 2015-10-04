
#Mold.Lib.ArrayObserver
---------------------------------------

__file__: /Applications/XAMPP/xamppfiles/htdocs/Mold Git Checkout/MoldJS/Mold/Lib/ArrayObserver.js  
__dna__: class  

__version__: 0.0.1  
	

__test__: [Mold.Test.Lib.ArrayObserver](../../Mold/Test/Lib/ArrayObserver.md) 





__class creates an observer used for ansynchronously observing changes to an array__


##Dependencies
--------------

* [Mold.Lib.Info](../../Mold/Lib/Info.md) 
* [Mold.Lib.Event](../../Mold/Lib/Event.md) 


##Events
--------------



* ____   



##Example
--------------
*Mold/Test/Lib/ArrayObserver.js*

```

it("create test array", function(){
	testArray = [
		"one",
		"two",
		"three",
		"four",
		"five"
	]

	observer = new ArrayObserver(testArray)
})

it("observe push", function(done){
	test = function(data){
		expect(data.type).toBe("splice");
		expect(data.addedCount).toBe(1);
		expect(data.index).toBe(5);
		expect(data.object.length).toBe(6);
		expect(data.object[5]).toBe("six");
		expect(data.removed.length).toBe(0);
		observer.unobserve(test);
		done();
	}

	observer.observe(test)

	testArray.push("six");
});


```



   
##Methods
	
 

###observe



__start observing the array__  
Defined in row: 151  

__Arguments:__  
 
* __callback__ (_function_) - a callback wich will be executed when the array changed  
returns: 




###unobserve



__end observing the array__  
Defined in row: 165  

__Arguments:__  
 
* __callback__ (_function_) - the callback that h  
returns: 




 


 



		
