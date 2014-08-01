"use strict";
Seed({
		name : 'Mold.Tools.Debug.ComLog',
		dna : "action",
		include : [
			"Mold.Lib.Url"
		]
	},
	function(){

		var _createProzessor = function(prefix, showTime){
			Mold.addPreProcessor("comlog"+prefix, function(code){
				code = code.replace(/\/\/!(.*?)$/gm, function(match, contents){
					var timerCode = (showTime) ? "'TIME: ' + ( new Date().getTime() - Mold.cue.get('globals', 'execution-timer')), " : "";
					contents = contents.replace(/\$([a-zA-Z_.]*)/gm, function(match, variable){
						return "'," + variable + ",'";
					})
					return "console.log("+timerCode+"' INFO: ', '"+contents+"')";
				});
				/*
				code = code.replace(/\$([a-zA-Z_]*)/, function(match, contents, offset, s){
					return "'," + contents + "'";
				})*/
				return code;
			});
		}

		if(!Mold.isNodeJS){
			//window.location.search 
			var url = new Mold.Lib.Url();
			var parameter = url.parameter();
			console.log(parameter)
			if(parameter['debug']){
				if(parameter['info-comment']){
					console.log("comment logging activated");
					var options = parameter['info-comment'].split(",");
					var showTime = (options.indexOf('show-time') > -1) ? true : false;
					console.log("SHOW TIME", showTime, options)
					var seeds = parameter['seeds'];

					if(showTime){
						Mold.cue.add("globals", "execution-timer", new Date().getTime())
					}

					if(seeds){
						Mold.each(seeds.split(","), function(selectedSeeed){
							_createProzessor(selectedSeeed, showTime);
						});
						
					}else{
						_createProzessor('', showTime);
					}
				}
			}
		}else{
			Mold.addPreProcessor("comlog", function(code){
				//console.log(code)

				code = code.replace(/\/\/!(.*?)$/gm, function(match, contents, offset, s){
				//console.log("get", contents)
					return "console.log('INFO:', '"+contents+"')";
				});
				return code;
			});

		}

		
	}
)