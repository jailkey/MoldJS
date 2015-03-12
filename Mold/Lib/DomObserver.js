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
			_watchList = [];

		Mold.mixin(this, new Mold.Lib.Event(this));

		var _createMutation = function(element, type){

		}

		var _createElementObserver = function(element){
			if(Mold.Lib.Info.isSupported("mutationObserver")){
				var observer = new MutationObserver(function(mutations){
					Mold.each(mutations, function(mutation){
						_that.trigger("element.changed", { mutation : mutation, element : element});
						element.trigger("element.changed", {mutation : mutation, element : element});
					});
				});
				observer.observe(element, { attributes: true, childList: true, characterData: true })
				
			}else{
				//throw "Your Browser does not support MutationObserver!"
				
				element.on("DOMAttrModified", function(e){
					var mutation = {
						target : element,
						attributeName : e.attrName,
						type : "attributes",
						oldValue : e.prevValue,
						addedNodes : [],
						removedNodes : [],
					}

					element.trigger("element.changed", {mutation : mutation, element : element});

				});
				element.on("DOMNodeInserted", function(e){
					var mutation = {
						target : element,
						attributeName : e.attrName,
						type : "childList",
						oldValue : e.prevValue,
						addedNodes : [],
						removedNodes : [],
					}

					mutation.addedNodes.push(e.explicitOriginalTarget);
					element.trigger("element.changed", {mutation : mutation, element : element});
				});

				element.on("DOMNodeRemoved", function(e){
					var mutation = {
						target : element,
						attributeName : e.attrName,
						type : "childList",
						oldValue : e.prevValue,
						addedNodes : [],
						removedNodes : [],
					}

					mutation.removedNodes.push(e.explicitOriginalTarget);
					element.trigger("element.changed", {mutation : mutation, element : element});
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
			observeElement : function(element){
				if(!_isInWatchList(element)){
					_watchList.push(element);
					element = new Mold.Lib.Element(element);
					element = _createElementObserver(element);
				}
				return element;
			}
		}
	}
)