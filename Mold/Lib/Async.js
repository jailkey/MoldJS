Seed({
		name : "Mold.Lib.Async",
		dna : "static",
		include : [
			"Mold.Lib.Promise"
		]
 	},
 	function(){

 		return {
 		/**
 		 * @method waterfall 
 		 * @description execute all given paramters in sequence
 		 * @param  {array / function} input 
 		 * @return {promise} returns a promise   
 		 */
 			waterfall : function(input){

 				var args = arguments;

 				return new Mold.Lib.Promise(function(fullfill, reject){

 					var results = [],
 						count = 0,
	 					result = false;

	 				if(!Mold.isArray(input)){
	 					input = [input];
	 				}
	 				if(args.length > 1){
	 					for(var i = 1; i < args.length; i++){
	 						if(!Mold.isArray(args[i])){
	 							input.push(args[i]);
	 						}else{
	 							input = input.concat(args[i]);
	 						}
	 					}
	 				}

	 				var len = input.length;

	 				var next = function(value){
	 					if(count + 1 >= len){
	 						fullfill(results);
	 						return;
	 					}
	 					count++;
	 					exec(value);
	 				}
	 				
	 				var exec = function(value){
	 					results.push(value);
	 					var selected = input[count];
	 					if(typeof selected === "function"){
	 						result = selected(next);
	 						if(result && result.then){
	 							
	 							result.then(function(res){
	 								next(res);
	 							}).fail(function(err){
	 								reject(err);
	 							});
	 						}
	 					}else{
	 						reject("Input must a function!");
	 						return; 
	 					}
	 				}

	 				exec(false);
	 			});
 			}
 		}
 	}
)