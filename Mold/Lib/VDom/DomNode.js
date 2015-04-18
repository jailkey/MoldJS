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
			this.data = config.protoDom.nodeValue;

			this.setData = function(data){
				for(var name in _that.children){
					_that.children[name].setData(data);
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
					
				return newNode;
			}

			this.render = function(){
				var output = this.protoDom;
		
				Mold.each(_that.children, function(child){

					if(!child.render){
						console.log("childrender", child)
					}else{
						output.appendChild(child.render());
					}
				});
				

				return output;
			}
		}
	}
)