"use strict";
//!info transpiled
/**
 * @module Mold.Core.VM
 * @description runs a new Mold instance in a sandbox 
 */
Seed({
		type : "module",
	},
	function(modul){
		var instanceCount = 1; 

		var MoldVM = function(conf){
			conf = conf || {};
			this.sandbox = {
				global : { 
					global : {},
					vmInstance : instanceCount 
				},
				console : console,

			}
			
			instanceCount++;

			Mold.copyGlobalProperties(this.sandbox);

			this.moldPath = conf.moldPath || 'Mold.js',
			this.confPath = conf.configPath || '',
			this.confName = conf.configName || 'mold.json'

			this.sandbox.process.argv = [
				'config-path',  this.confPath,
				'config-name', this.confName,
				'use-one-config', true
			];

			this.vm = require('vm');
			this.fs = require('fs');
			this.context = new this.vm.createContext(this.sandbox);

			//load core
			var moldJsPath = (Mold.Core.Config.search('config-path')) ? Mold.Core.Config.search('config-path') + this.moldPath :  this.moldPath;
			var data = this.fs.readFileSync(moldJsPath);
			var moldScript = new this.vm.Script(data);
  			moldScript.runInContext(this.context, { filename : "Mold.Core.VM" });
  			this.Mold = this.sandbox.global.Mold;
		}

		MoldVM.prototype = {
			setConf : function(conf){
				this.Mold.Core.Config.overwrite(conf);
			}

		}

		modul.exports = MoldVM;
	}
)