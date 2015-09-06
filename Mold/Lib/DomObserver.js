Seed({
		name : "Mold.Lib.DomObserver",
		dna : "static",
		include : [
			"Mold.Lib.Info",
			"Mold.Lib.Event",
			"Mold.Lib.Element"
		]
	},
	function(){

		var _that = this,
			_watchList = []
			_insertedElements = [],
			_triggerConf = {
				disableSaveTrigger : true
			};

		Mold.mixin(this, new Mold.Lib.Event(this));

		var _filterNodeTyps = function(nodes, type){
			return Mold.filter(nodes, function(value){
				if(value.nodeType === type){
					return true;
				}
				return false;
			});
		}

		var _createElementObserver = function(element, config){
			
			config = config || {};
			
			config.insert = config.insert || false;
			config.remove = config.remove || false;
			config.attributes = config.attributes ||  false;


			var subtree = config.subtree || false,
				childList = config.childList || false;
				characterData = config.characterData || false;

			if(Mold.Lib.Info.isSupported("mutationObserver")){

				var observer = new MutationObserver(function(mutations){
					//console.log("mutations", mutations)
					Mold.each(mutations, function(mutation){
						if(config.attributes){
							if(mutation.type === "attributes"){
								_that.trigger("dom.changed", { mutation : mutation, element : element}, _triggerConf);
								_that.trigger("attribute.changed", { mutation : mutation, element : element}, _triggerConf);
								element.trigger("attribute.changed", {mutation : mutation, element : element}, _triggerConf);
							}
						}
						if(config.insert){
							mutation.addedNodes = _filterNodeTyps(mutation.addedNodes, 1);
							if(mutation.type === "childList" && mutation.addedNodes.length){
								if(mutation.nodeType === 1){
									_that.trigger("dom.changed", { mutation : mutation, element : element}, _triggerConf);
									_that.trigger("element.inserted", { mutation : mutation, element : element}, _triggerConf);
									element.trigger("element.inserted", {mutation : mutation, element : element}, _triggerConf);
								}
							}
						}
						if(config.remove){
							mutation.addedNodes = _filterNodeTyps(mutation.removedNodes, 1);
							if(mutation.type === "childList" && mutation.removedNodes.length){
								_that.trigger("dom.changed", { mutation : mutation, element : element}, _triggerConf);
								_that.trigger("element.removed", { mutation : mutation, element : element}, _triggerConf);
								element.trigger("element.removed", {mutation : mutation, element : element}, _triggerConf);
							}
						}
						
					});
				});
				
				observer.observe(element, { attributes: config.attributes, childList: childList, characterData: characterData, subtree: subtree })
				
			}else{
				//throw "Your Browser does not support MutationObserver!"
				
				element.on("DOMAttrModified", function(e){
			
					var mutation = {
						target : e.target,
						attributeName : e.attrName,
						type : "attributes",
						oldValue : e.prevValue,
						addedNodes : [],
						removedNodes : [],
					}
					_that.trigger("dom.changed", { mutation : mutation, element : element}, _triggerConf);
					_that.trigger("attribute.changed", { mutation : mutation, element : element}, _triggerConf);
					element.trigger("attribute.changed", {mutation : mutation, element : element}, _triggerConf);
					

				});
				element.on("DOMNodeInserted", function(e){
					if(e.target.nodeType === 1){
						var mutation = {
							target : e.target,
							attributeName : e.attrName,
							type : "childList",
							oldValue : e.prevValue,
							addedNodes : [],
							removedNodes : [],
						}

						mutation.addedNodes.push(e.explicitOriginalTarget);
						_that.trigger("dom.changed", { mutation : mutation, element : element}, _triggerConf);
						_that.trigger("element.inserted", { mutation : mutation, element : element}, _triggerConf);
						element.trigger("element.inserted", {mutation : mutation, element : element}, _triggerConf);
					}
				});

				element.on("DOMNodeRemoved", function(e){
					var mutation = {
						target : e.target,
						attributeName : e.attrName,
						type : "childList",
						oldValue : e.prevValue,
						addedNodes : [],
						removedNodes : [],
					}

					mutation.removedNodes.push(e.explicitOriginalTarget);
					_that.trigger("dom.changed", { mutation : mutation, element : element}, _triggerConf);
					_that.trigger("element.removed", { mutation : mutation, element : element}, _triggerConf);
					element.trigger("element.removed", {mutation : mutation, element : element}, _triggerConf);
				});

				/*childlist*/
				var mutation = {
					target : element,
					attributeName : '',
					type : "childList",
					oldValue : null
				}
			}
			return element;
		}
		
		var _isInWatchList = function(element){
			return !!Mold.find(_watchList, function(selected){
				if(selected === element){
					return true;
				}
				return false;
			})
		}


		return {
			observe : function(element, config){
				if(!_isInWatchList(element)){
					_watchList.push(element);
					element = new Mold.Lib.Element(element);
					element = _createElementObserver(element, config);
				}
				return element;
			},
			observeAttributes : function(element){
				return this.observe(element, {
					childList: false, 
					characterData : false, 
					subtree : false,
					attributes : true
				})
			},
			observeInserts : function(element){
				return this.observe(element, {
					childList: true, 
					characterData : false, 
					subtree : true,
					insert : true
				});
			},
			observeInserts : function(element){
				return this.observe(element, {
					childList: true, 
					characterData : false, 
					subtree : true,
					remove : true
				});
			}
		}
	}
)