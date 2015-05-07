Seed({
		name : "Mold.Lib.VDom.DomNode",
		dna : "static",
	},
	function(){

		return function DomNode (config){
				var _that = this;

				this.name = config.name;
				this.nodeType = 6;
				this.tagName = config.protoDom.tagName || "#text";
				this.protoDom = config.protoDom;
				this.children = config.children || {};
				this.attributes = config.attributes || {};
				this.data = config.protoDom.nodeValue;

				this.setData = function(data){
					for(var name in _that.children){
						_that.children[name].setData(data);
					}
					for(var name in _that.attributes){
						_that.attributes[name].setData(data);
					}
				}

				this.clone = function(){

					var newNode =  new Mold.Lib.VDom.DomNode({
						name : _that.name,
						tagName : _that.tagName,
						protoDom : _that.protoDom.cloneNode()
					});

					for(var name in _that.children){
						var child = _that.children[name];
						newNode.children[child.name] = child.clone();
					}

					for(var name in _that.attributes){
						var child = _that.attributes[name];
						newNode.attributes[name] = child.clone();
						newNode.attributes[child.name].parent = newNode;
						newNode.attributes[child.name].pointer = newNode.protoDom.getAttributeNode(child.attributeName);
					}
						
					return newNode;
				}

				this.render = function(){
					var output = this.protoDom;
					for(var childName in _that.children){
						var child = _that.children[childName];

						if(!child.render){
							console.log("child render is not defined", child)
						}else{
							output.appendChild(child.render());
						}
					};

					for(var name in _that.attributes){
						_that.attributes[name].render();
					}
					

					return output;
				}

				this.update = function(){
					var output = this.protoDom;
			
					for(var childName in _that.children){
						var child = _that.children[childName];
						
						child.update();
						
					};

					for(var name in _that.attributes){
						_that.attributes[name].update();
					}
					

					
				}
			}
	}
)