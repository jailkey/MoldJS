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
		]
	},
	function(markup, config){

		var ajax = new Ajax();
		var _tree = false;
		var undefined;

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
				_tree = new Builder(data);
				resolve(_tree);
			})
		});


		var _connector = {
			renderTimer : false,
			reRender : function(tree){
				clearTimeout(_connector.renderTimer);
				_connector.renderTimer = setTimeout(function(){
					tree.dom.render();
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
					blockData[name] = data;
					//console.log("set data", name, data)
					child.setData(blockData);
				}else{
					child.setData(data);
				}
				_connector.reRender(tree);
				
			},
			watchObjectProp : function(model, subTree, properties, path, tree, name){
				model.on(path + ".changed", function(e){
					switch(e.data.type){
						case "update":
						case "splice":
							//console.log("property changed", path + ".changed", properties, subTree)
							//if subtree is an array update all childnodes
							//console.log("SPLCIE", e.data)
							if(Mold.isArray(subTree)){
								var i = 0, len = subTree.length;
								for(; i < len; i++){
									_connector.updateChild(subTree[i], e.data.object, tree, name);
									//if(e.data.type)
									_connect(model, subTree[i], properties, path, tree);
								}
							}else if(subTree.children && subTree.children[name]){
								_connector.updateChild(subTree, e.data.object, tree, name);
							}
							break;
						default:
							throw new Error("type " + e.data.type + " for watchObjectProp is not implemented!");
					}

				});
			},
			watchArray : function(model, subTree, properties, path, tree){
				model.on(path + ".changed", function(e){
					switch(e.data.type){
						case "update":
							if(Mold.isObject(e.data.object)){
								_connector.updateChildren(subTree, e.data.object, tree)
							}else{
								throw new Error("e.data.object is no Object, not Implemented");
							}
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
					//console.log("watch", newPath)

					_connector.watchArray(model, subTree.children[i], properties[0], newPath, tree)
					_connect(model, subTree.children[i], properties[0], newPath, tree)
				}
			},
			parseObject : function(model, subTree, properties, path, tree){
				for(var prop in properties){
					//_connector.watchObject
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

		

		this.publics = {
			refresh : function(){

			},
			snatch : function(){

			},
			connect : function(model){
				_templateTree.then(function(tree){
					_connect(model, tree.dom, model.getProperties(), "data", tree);
					window.setTimeout(function(){
						model.triggerUpdate();
					}, 50)
					
				});
			},
			unbind : function(){

			},
			addData : function(data){
				_templateTree.then(function(tree){
					tree.dom.setData(data);
					tree.dom.render();
				});
			},
			addDataSync : function(data){
				_tree.dom.setData(data);
				_tree.dom.render();
			},
			appendTo : function(element){
				_templateTree.then(function(tree){

					element.appendChild(tree.dom.render())
				})
				
			},
			get : _templateTree,
			tree : _templateTree
		}
	}
)