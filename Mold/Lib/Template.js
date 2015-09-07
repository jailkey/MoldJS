Seed({
		name : "Mold.Lib.Template",
		dna : "class",
		test : "Mold.Test.Lib.Template",
		include : [
			{ Builder : "Mold.Lib.VDom.Builder" },
			{ Ajax : "Mold.Lib.Ajax" },
			{ MultiLineString :  "Mold.Lib.MultiLineString" },
			{ Path : "Mold.Lib.Path" },
			{ Promise : "Mold.Lib.Promise" },
			{ Event : "Mold.Lib.Event" }
			
		],
		
		browserInclude : [
			//load template components
			"Mold.Lib.VDom.Builder",
			[	
				".VDom.Components.MoldEvent",
				".VDom.Components.MoldCaptureForms" 
			]
		]
	},
	function(markup, config){
		
		config = config || {};

		var ajax = new Ajax();
		var _tree = false;
		var _that = this;
		var _parseAsString= config.parseAsString || false;
		var undefined;

		Mold.mixin(this, new Event(this));

		//load the 
		var _template = new Promise(function(resolve, reject){
			var data = markup;
			if(typeof markup === "function"){
				data = MultiLineString(markup)
				resolve(data);
				return;
			}

			if(Path.is(markup)){
				ajax
					.get(markup)
					.then(function(data){
						resolve(data);
					})
					.fail(function(error){
						reject(error);
					});
			}else{
				resolve(data);
			}
		});
		
		var _templateTree = new Promise(function(resolve, reject){
			_template.then(function(data){

				_tree = new Builder(data, { template : _that });

				resolve(_tree);
				_that.trigger("ready");
			})
		});

		/**
		 * @method  _connector
		 * @private
		 * @description collection of methods to bind a model to the template
		 * @type {Object}
		 */
		var _connector = {
			renderTimer : false,
			reRender : function(tree){
				clearTimeout(_connector.renderTimer);
				_connector.renderTimer = setTimeout(function(){
					if(!_parseAsString){
						tree.reRender();
					}else{
						tree.renderString();
					}
					_that.trigger("renderd", { tree : _tree });
				}, 2);

			},
			updateChildren : function(children, data, tree){
				if(Mold.isObject(children)){
					for(var childName in children){
						_connector.updateChild(children[childName], data[childName], tree, childName)
					}
				}else{
					throw new Error("only object implemented in _connector.updateChildren")
				}
			},
			updateChild : function(child, data, tree, name){
				
				//if blocknode
				if(child.type === 2){
					var blockData = {};
					blockData[name] = (data[name] === undefined) ? data : data[name];
					child.setData(blockData);
				}else{
					child.setData(data);
				}
				_connector.reRender(tree);
				
			},
			watchObjectProp : function(model, subTree, properties, path, tree, name){

				model.off(path + ".changed");
				model.on(path + ".changed", function(e){

					switch(e.data.type){
						case "update":
							//if subtree is an array update all childnodes
							if(Mold.isArray(subTree)){
								var i = 0, len = subTree.length;
								for(; i < len; i++){
									_connector.updateChild(subTree[i], e.data.object, tree, name);
									_connect(model, subTree[i], properties, path, tree);
								}
							}else if(subTree.children && subTree.children[name]){
								_connector.updateChild(subTree, e.data.object, tree, name);
							}else if(subTree.name === name){
								_connector.updateChild(subTree, e.data.object, tree, name);
							}
							break;
						case "splice":
							if(!e.data.addedCount && e.data.removed.length){
								if(Mold.isArray(subTree)){
									for(var i = 0; i < subTree.length; i++){
										subTree[i].removeListItems(e.data.index, e.data.removed.length);
									}
								}else{
									subTree.removeListItems(e.data.index, e.data.removed.length);
								}
								
							}

							if(e.data.addedCount){
								var i = e.data.index, len = e.data.index + e.data.addedCount;
								for(; i < len; i++){
									if(Mold.isArray(subTree)){
										for(var y = 0; y < subTree.length; y++){
											subTree[y].changeListItem(i, e.data.object[i]);
										}
									}else{
										subTree.changeListItem(i, e.data.object[i]);
									}
								}
								
							}
							_connector.reRender(tree);
							
							
							break;
						default:
							throw new Error("type " + e.data.type + " for watchObjectProp is not implemented!");
					}

				});
			},
			watchArray : function(model, subTree, properties, path, tree){
				model.off(path + ".changed");
				model.on(path + ".changed", function(e){
					switch(e.data.type){
						case "update":
							if(Mold.isObject(e.data.object)){
								_connector.updateChildren(subTree, e.data.object, tree)
							}else{
								throw new Error("e.data.object is no Object, not Implemented");
							}
							break;
						case "splice":
							
							break;
						default:
							throw new Error("method " + e.data.type + " for watchArray is not implemented!");
					}
				});
			},
			parseArray : function(model, subTree, properties, path, tree){
				var i = 0, len = subTree.children.length;
				for(; i < len; i++){
					var newPath = path + "." + i;
					_connector.watchArray(model, subTree.children[i], properties[0], newPath, tree)
					_connect(model, subTree.children[i], properties[0], newPath, tree)
				}
			},
			parseObject : function(model, subTree, properties, path, tree){
				for(var prop in properties){
				
					var newPath = path + "." + prop;

					if(subTree.children){
						if(subTree.children[prop]){
							_connector.watchObjectProp(model, subTree.children[prop], properties[prop], newPath, tree, prop)
						}
					}else{

						_connector.watchObjectProp(model, subTree[prop], properties[prop], newPath, tree, prop)
						//throw new Error("subTree children is not defined, in _connector.parseObject!");
					}
				}
			}
		}
		
		
		var _connect = function(model, subTree, properties, path, tree){

			if(Mold.isArray(properties)){
				_connector.parseArray(model, subTree, properties, path, tree);
			}else if(Mold.isObject(properties)){
				_connector.parseObject(model, subTree, properties, path, tree);
			}
		}

		var _forms = {};

		Mold.mixin(_forms, new Event(_forms));

		_forms.setValue = function(name, value){
			this[name] = value;
			this.trigger(name + ".changed", value);
		}



		this.publics = {
			snatch : function(){

			},
			forms : _forms,
			connect : function(model){
				_templateTree.then(function(tree){
					_connect(model, tree.dom, model.getProperties(), "data", tree);
					setTimeout(function(){
						model.triggerUpdate();
					}, 50)
					
				});
			},
			setData : function(data){
				_templateTree.then(function(tree){
					tree.dom.setData(data);
					if(!_parseAsString){
						tree.render();
					}else{
						tree.renderString();
					}
					_that.trigger("renderd", { tree : _tree });
				});
			},
			appendTo : function(element){
				_templateTree.then(function(tree){
					element.appendChild(tree.render())
					_that.trigger("renderd", { tree : _tree });
				})
			},
			getString : function(data){
				return new Promise(function(resolve, reject){
					_templateTree.then(function(tree){
						if(data){
							tree.dom.setData(data);
						}
						resolve(tree.renderString());
						_that.trigger("renderd", { tree : _tree });
					})
				});
			},
			get : _templateTree,
			tree : _templateTree
		}
	}
)