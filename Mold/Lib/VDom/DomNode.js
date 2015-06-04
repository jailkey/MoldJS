Seed({
		name : "Mold.Lib.VDom.DomNode",
		dna : "static",
	},
	function(){

		return function DomNode(config){
			//°include Mold.Lib.VDom.ProtoNode
			
			this.type = DOM_NODE;
			this.attributes = config.attributes || {};
			this.domPointer = false; 
			this.renderDom = this.vdom;

			this.onSetData = function(data){
				for(var name in data){
					this.children[name].setData(data[name]);
				}
			}

			this.clone = function(){

				var newNode =  new DomNode({
					name : this.name,
					data : this.data
				});
				
				var i = 0, len = this.vdom.length;
				
				for(; i < len; i++){
					var cloneNode = this.vdom[i].clone();
					newNode.addNode(cloneNode)
				}

				for(var name in this.attributes){
					var cloneNode = this.attributes[name].clone();
					newNode.addAttribute(cloneNode);
					
				}
				
				return newNode;
			}

			this.renderAttribute = function(name){
				var attr = this.attributes[name];
				if(attr){
					var attrValue = attr.render();
					this.domPointer.setAttribute(name, attrValue);
				}
			}

			this.render = function(){
				
				if(!this.domPointer){
					this.domPointer = _doc.createElement(this.name);
				}

				var i = 0, len = this.renderDom.length;
				for(; i < len; i++){
					this.domPointer.appendChild(this.renderDom[i].render());
				}

				for(var name in this.attributes){
					var attrValue = this.attributes[name].render();
					this.domPointer.setAttribute(name, attrValue);
				}

				return this.domPointer;
			}

		}
	
	}
	
)