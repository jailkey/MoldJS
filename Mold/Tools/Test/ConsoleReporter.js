Seed({
		name : "Mold.Tools.Test.ConsoleReporter",
		dna : "class"
	},
	function(){

		var _tabsByLevel = function(level){
			var output = "";
			for(var i = 0; i < level; i++){
				output += "  ";
			}
			return output; 
		}

		var _info = function(value, level){
			console.info(_tabsByLevel(level)  + "INFO: " + value);
		}

		var _error = function(value, level){
			console.log("%c" + _tabsByLevel(level) + "ERROR: " + value, "color: #ff0000");
		}

		var _success = function(value, level){
			console.log("%c" + _tabsByLevel(level) +  "SUCCESS: " + value, "color: #00ff00");
		}

		var _iterateResult = function(result, level){
			Mold.each(result.children, function(child){
				if(child.description){
					_info(child.description, level);
				}else{
					_info(child.type, level)
				}
				if(child.success){
					_success("Test successfully!", level + 1);
				}else if(child.error){
					_error(child.error, level + 1);
				}

				if(child.children.length){
					_iterateResult(child, level + 1);
				}
				
			});
		}

		this.publics = {
			addResult : function(result){
				_iterateResult(result, 0);
			}
		}
	}
)