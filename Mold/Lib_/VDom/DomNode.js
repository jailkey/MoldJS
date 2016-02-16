Seed({
		type : "static",
		include : [
			"Mold.Lib.VDom.ProtoNode"
		]
	},
	function(){

		return function DomNode(config){
			//!include seed=Mold.Lib.VDom.ProtoNode
			
			this.type = DOM_NODE;
			this.attributes = config.attributes || {};
			this.domPointer = false; 
			this.renderDom = this.vdom;
			this.stopDirective = true;
			this.moldModel = {
				model : null,
				path : null
			}

			this.onSetData = function(data, bind){

				//set children to false if no data is given
				for(var name in this.children){
					if(Mold.isArray(this.children[name])){
						var len = this.children[name].length, i = 0;
						for(; i < len; i++){
							var selected = this.children[name][i];
							if(selected.type === BLOCK_NODE){
								//if type is a blocknode add parent data
								if(data){
									selected.setData(data, bind);
								}else{
									selected.setData(false, bind);
								}
							}else{
								if(selected.hasParentValue && data[selected.parentName] &&  data[selected.parentName][selected.childName]){
									selected.setData(data[selected.parentName][selected.childName], bind);
								}else if(data[name]){
									selected.setData(data[name], bind);	
								}else{
									selected.setData("", bind);	
								}
								
								
							}
						}
					}else{
	
						if(this.children[name].type === BLOCK_NODE){
							//if type is a blocknode add parent data
							if(data){
								this.children[name].setData(data, bind);
							}else{
								this.children[name].setData(false, bind);
							}
						}else{
							var selected = this.children[name];
							if(selected.hasParentValue && data[selected.parentName] &&  data[selected.parentName][selected.childName]){
								selected.setData(data[selected.parentName][selected.childName], bind);
							}else if(data[name]){
								this.children[name].setData(data[name], bind);
							}else{
								this.children[name].setData("", bind);
							}
						}
						
					}
				}
				
			}

			this.clone = function(){

				var newNode =  new DomNode({
					name : this.name,
					data : this.data,
					services : this.services
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
				var created = false;
				if(!this.domPointer){
					this.domPointer = _doc.createElement(this.name);
					this.domPointer.moldTemplate = this.services.template;
					this.domPointer.moldModel = this.moldModel;
					this.domPointer.templatePointer = this;
					created = true;
				}

				var i = 0, len = this.renderDom.length;
				for(; i < len; i++){
					this.renderDom[i].parentElement = this.domPointer;
					this.domPointer.appendChild(this.renderDom[i].render());
				}

				for(var name in this.attributes){
					var attrValue = this.attributes[name].render();
					this.domPointer.setAttribute(name, attrValue);
				}
				this.domPointer.stopDirective = this.stopDirective;
				if(created){
					Mold.Lib.Observer.publish('element.created', { element : this.domPointer });
				}
				return this.domPointer;
			}

			this.reRender = function(){
				var i = 0, len = this.renderDom.length;
				for(; i < len; i++){
					 this.renderDom[i].reRender();
				}
			}

			this.renderString = function(){
				var output = '<' + this.name;

				for(var name in this.attributes){
					var attrValue = this.attributes[name].renderString();
					output += ' ' + name + '="' + attrValue + '"';
				}

				output += '>';
				
				var i = 0, len = this.renderDom.length;
				for(; i < len; i++){
					output += this.renderDom[i].renderString();
				}

				output += '</' + this.name + '>';

				return output;
			}

		}
	
	}
	
)