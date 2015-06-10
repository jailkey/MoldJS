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
				//set to children false if no data is given

				for(var name in this.children){
					if(Mold.isArray(this.children[name])){
						var len = this.children[name].length, i = 0;
						for(; i < len; i++){
							if(this.children[name][i].type === BLOCK_NODE){
								//if type is a blocknode add parent data
								if(data){
									this.children[name][i].setData(data);
								}else{
									this.children[name][i].setData(false);
								}
							}else{
								if(data[name]){
									this.children[name][i].setData(data[name]);	
								}else{
									this.children[name][i].setData("");	
								}
								
							}
						}
					}else{
	
						if(this.children[name].type === BLOCK_NODE){
							//if type is a blocknode add parent data
							if(data){
								this.children[name].setData(data);
							}else{
								this.children[name].setData(false);
							}
						}else{
							if(data[name]){
								this.children[name].setData(data[name]);
							}else{
								this.children[name].setData("");
							}
						}
						
					}
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