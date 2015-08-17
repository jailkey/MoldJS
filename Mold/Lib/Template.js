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
						console.log("test")
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


		var _connect = function(model, subTree, properties, path, tree){
			if(Mold.isArray(properties)){
				var i = 0, len = properties.length;
				
			}else if(Mold.isObject(properties)){
				for(var prop in properties){
					if(subTree.children[prop]){
						model.on(path + "." + prop + ".changed", function(e){
							switch(e.data.type){
								case "splice":
									
									if(Mold.isArray(subTree.children[prop])){
										for(var i = 0; i < subTree.children[prop].length; i++){
											var newData = {};
											newData[prop] = e.data.object;
											subTree.setData(newData);
											
										}
									}
									break;
							}
							tree.dom.render();
						});
						_connect(model, subTree.children[prop], properties[prop], path + "." + prop, tree)
					}
				}
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
					//tree.dom.render();
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