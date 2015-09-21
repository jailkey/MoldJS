Seed({
		name : "Mold.Lib.VDom.ProtoNode",
		dna : "data",
		include : [
			"Mold.Lib.VDom.VDoc",
			"Mold.Lib.Filter",
			"Mold.Lib.Observer"
		]
	},
	function(){

		var STATE_RENDER = "render";
		var STATE_NEW = "new";
		var STATE_REMOVE = "remove";
		var STATE_NO_CHANGES = "no changes";
		var STATE_UPDATE = "update";


		var VALUE_NODE = 1;
		var BLOCK_NODE = 2;
		var NEGATIVE_BLOCK_NODE = 3;
		var DOM_NODE = 5;
		var TEXT_NODE = 6;
		var ATTRIBUTE_NODE = 6;
		var STRING_NODE = 8;
		var ROOT_NODE = 9;

		var _doc = Mold.Lib.VDom.VDoc;
		
		if(!config.name){
			throw new Error("Name must be specified!")
		}

		var _vDom = config.vdom || [];
		var _that = this;
		var _oldData = false;


		this.children = this.children || {};
		this.data = config.data || false;
		this.name = config.name;
		this.type = STRING_NODE;
		this.parent = false;
		this.parentElement = false;
		this.state = STATE_NEW;
		this.isString = config.isString || false;
		this.hasBinding = false;
		this._id = Mold.getId();
		this.services = config.services || false;
		this.template = config.template || false;

		this.vdom = _vDom;
		this.protoChild = {};
		
		this.renderDom = false;

		this.afterAddChild = function(child){

		}
	
		this.addNode = function(child, addAttribute){
			
			if(!addAttribute){
				this.vdom.push(child);
			}
			
			child.parent = _that;
			child.services = this.services;

			if(
				child.type === BLOCK_NODE 
				|| child.type === VALUE_NODE
				|| child.type === NEGATIVE_BLOCK_NODE
			){
			

				//if current node is not a block-node add child to next block-node
				if(this.type !== BLOCK_NODE){
					if(this.children[child.name]){
						//if there are two nodes with the same name create an array
						this.children[child.name] = [this.children[child.name]]
						this.children[child.name].push(child); 
					}else{
						this.children[child.name] = child;
					}
					var parentBlock = this.parent;
					if(parentBlock){
						while(parentBlock.type !== BLOCK_NODE && parentBlock.parent){
							parentBlock = parentBlock.parent;
						}

						if(parentBlock){
							if(parentBlock.type === BLOCK_NODE){
								var index = (parentBlock.children.length) ? parentBlock.children.length -1 : 0;
								if(!parentBlock.children[index]){
									parentBlock.children[index] = {};
								}
								parentBlock.children[index][child.name] = this.children[child.name];
							}else{
								parentBlock.children[child.name] = this.children[child.name];
							}
						}
					}
				}else{
					var index = (this.children.length) ? this.children.length  -1 : 0;
					if(!this.children[index]){
						this.children[index] = {};
					}
					this.children[index][child.name] = child;
				}
			}

			this.afterAddChild(child);
			
		}

		this.addAttribute = function(child){
			this.attributes[child.name] = child;
			this.addNode(child, true);
		}


		this.get = function(){
			return _domPointer;
		}	


		this.onSetData = function(data){

			//set children to false if no data is given
			for(var name in this.children){

				if(Mold.isArray(this.children[name])){

					var len = this.children[name].length, i = 0;
					for(; i < len; i++){
						var selected = this.children[name][i];

						if(selected.type === BLOCK_NODE){
							//if type is a blocknode add parent data
							if(data){
								selected.setData(data);
							}else{
								selected.setData(false);
							}
						}else{
							if(selected.hasParentValue && data[selected.parentName] &&  data[selected.parentName][selected.childName]){
								selected.setData(data[selected.parentName][selected.childName]);
							}else if(data[name]){
								selected.setData(data[name]);	
							}else{
								selected.setData("");	
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

						var selected = this.children[name];
						if(selected.hasParentValue && data[selected.parentName] &&  data[selected.parentName][selected.childName]){
							selected.setData(data[selected.parentName][selected.childName]);
						}else if(data[name]){
							this.children[name].setData(data[name]);
						}else{
							this.children[name].setData("");
						}
					}
					
				}
			}
		}

		this.renderParentDom = function(){
			var parent = this.parent;
			var isDom = false;
			while(parent){
				isDom = (parent.type === 5) ? true : false;
				if(isDom) {
					break;
				}
				parent = parent.parent;
			}
			parent.render()
		}

		this.setNodeData = function(nodeName, data, bind){
			if(this.children[nodeName]){
				if(Mold.isArray(this.children[nodeName])){
					var i = 0, len = this.children[nodeName].length;
					for(; i < len; i++){
						this.children[nodeName][i].setData(data, bind)
					}
				}else{
					this.children[nodeName].setData(data, bind)
				}
			}
		}


		this.setData = function(data){
			
			if(typeof this.data === "string" && this.data === data){
				this.state = STATE_NO_CHANGES;
			}else if(this.state === STATE_NO_CHANGES){
				this.state = STATE_UPDATE;
			}
			
			this.data = data;
			this.onSetData(data);
			
		}


		this.renderString = function(){
			throw new Error("renderString ist not implemented!")
		}

		this.reRender = function(){
			throw new Error("reRender ist not implemented!")
		}
		
	}
)