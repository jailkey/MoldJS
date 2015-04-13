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
			console.log("%c" + _tabsByLevel(level) + "ERROR: " + value, "color: #ff0000; font-weight: bold;");
			if(value.stack){
				console.log("%c" + _tabsByLevel(level) + "ERROR: " + value.stack, "color: #ff0000; font-weight: bold;");
			}
		}

		var _success = function(value, level){
			console.log("%c" + _tabsByLevel(level) +  " " + value, "color: #00bb00; font-weight: bold;");
		}

		var _getInfo = function(entry, output){
			if(!output){
				var output = {
					hasErrors : false,
					errorCount : 0,
					successCount : 0,
					time : 0,
					tests : 0
				}
			}
			output.tests++;
			output.time += entry.executionTime;
			if(entry.error){
				output.hasError = true;
				output.errorCount++;
			}else{
				output.successCount++;
			}
			if(entry.children.length){
				Mold.each(entry.children, function(subentry){
					output = _getInfo(subentry, output);
				});
			}
			return output;
		}

		var _iterateResult = function(result, level){
			Mold.each(result.children, function(child){
				
				var info = _getInfo(child);
				var time = " - " + Math.round(info.time) + "ms";
				if(child.description){
					message = child.description + " (" + info.successCount + "/" + info.errorCount  + ")" + time;
				}else{
					message = child.type +  " (" + info.successCount + "/" + info.errorCount + ")"+ time;
				}

				if(info.hasError){
					_error(message, level);
				}else{
					_success(message, level)
				}

				if(child.success){
					//_success("Test successfully!", level + 1);
				}else if(child.error){
					_error(child.error, level + 1);
				}
				if(info.hasError){
				
					if(child.children.length){
						_iterateResult(child, level + 1);
					}
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