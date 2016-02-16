"use strict";
//!info transpiled
/**
 * @module Mold.Core.Command
 * @description static object provides methods to create CLI commands
 */
Seed({
		type : "static",
		include : [
			{ Promise : "Mold.Core.Promise" },
			{ File : "Mold.Core.File" }
		]
	},
	function(){

		var _commands = {};
		var _cache = {};

		return {
			get : function(name){
				return _commands[name]
			},
			validate : function(cmd){
				if(!cmd.name){
					throw new Error("Command needs a name!");
				}
				if(!cmd.code){
					throw new Error("Command needs a method! [" + cmd.name + "]");
				}
				if(!cmd.description){
					throw new Error("Command needs a description! [" + cmd.name + "]");
				}

				return true;
			},
			register : function(cmd){
				this.validate(cmd);

				if(_commands[cmd.name]){
					throw new Mold.Errors.CommandError("Command '" + cmd.name + "' already exists!")
				}

				_commands[cmd.name] = cmd;

				return this;
			},
			getAliasOrigin : function(cmd, parameterName){
				return cmd.parameter[parameterName] || null;
			},

			findAliasParameter : function(cmd, parameter){
				var undefined;
				for(var param in parameter){
					if(cmd.parameter[param].alias){
						var aliasName = cmd.parameter[param].alias;
						var originalData = Mold.clone(parameter[param]);
						delete parameter[param];
						var extended = cmd.parameter[aliasName];
						for(var prop in extended){
							originalData = (originalData === undefined) ? {} : originalData;
							if(!originalData[prop]){
								originalData[prop] = extended[prop];
							}
						}
						parameter[aliasName] = originalData;
						delete parameter[aliasName]["alias"];
					}
				}
				return parameter;
			},

			getParameterInfo : function(cmd, paramName){
				return cmd.parameter[paramName] || null;
			},
			extendParameterInfo : function(cmd, parameter){
				for(var param in parameter){
					var info = this.getParameterInfo(cmd, param);

					if(info){
						for(var prop in info){
							/*
							if(typeof parameter[param] !== 'object'){
								parameter[param] = {
									value : parameter[param]
								}
							}*/
							parameter[param][prop] = info[prop];
						}
					}
				}
				return parameter;
			},
			initFileParams : function(cmd, parameter, data){
				var files = [];
				return new Promise(function(resolve, reject){
					for(var param in parameter){
						if(parameter[param].type === 'source' && !parameter[param].alias){
							var path = parameter[param].value;
				
							if(parameter[param].extendpath && !path.endsWith(parameter[param].extendpath)){
								path += parameter[param].extendpath;
							}

							var file = new File(path);
							var loader = file.load();
							files.push(loader);
							loader.then(function(){
									var format = parameter[param].format;
									return function(fileData){
										if(format && format === "json"){
											fileData = JSON.parse(fileData);
										}
										parameter.source = parameter.source || [];
										parameter.source.push({
											file : path,
											data : fileData
										});
									}
								}())
								.catch(reject)
						}
					}
					
					new Promise().all(files).then(function(){
						resolve(parameter);
					}).catch(reject);
				})
			},
			setValue : function(parameter){
				for(param in parameter){
					parameter[param] = {
						value : parameter[param]
					}
				}
				return parameter;
			},
			checkRequired : function(cmd, parameter){
				for(var param in cmd.parameter){
					if(cmd.parameter[param].required && !parameter[param]){
						throw new Error("Command '" + cmd.name + "' requires parameter '" + param + "'!")
					}
				}
			},
			parameterExists : function(cmd, name){
				return (cmd.parameter[name]) ? true : false;
			},
			getInvalidParameter : function(cmd, parameter){
				for(var param in parameter){
					if(!this.parameterExists(cmd, param)){
						return param;
					}
				}
				return null;
			},
			execute : function(name, parameter, data){
				if(!_commands[name]){
					throw new Error("Command '" + name + "' not found!");
				}

				var cmd = this.get(name);
				var invalid = this.getInvalidParameter(cmd, parameter);

				if(invalid){
					throw new Mold.Errors.CommandError("Parameter '" + invalid + "' is not a valid parameter!", name)
				}
				
				parameter = this.setValue(parameter);
				parameter = this.findAliasParameter(cmd, parameter);
				parameter = this.extendParameterInfo(cmd, parameter);

				var that = this;
				return new Promise(function(resolve, reject){
					that.initFileParams(cmd, parameter, data)
						.then(function(parameter){

							that.checkRequired(cmd, parameter);
							try {
								cmd.code({ parameter : parameter, name : name }).then(function(result){
									resolve(result);
								}).catch(reject)
							}catch (e){
								reject(e);
							}
						})
						.catch(reject)
				})
			}
		}
	}
)