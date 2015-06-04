Seed({
		name : "Mold.Lib.VDom.ProtoNode",
		dna : "data",
		include : [
			"Mold.Lib.VDom.VDoc"
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
		this.state = STATE_NEW;
		this.isString = config.isString || false;

		this.vdom = _vDom;
		
		this.renderDom = false;

		this.afterAddChild = function(child){

		}
	
		this.addNode = function(child, addAttribute){
			
			if(!addAttribute){
				_vDom.push(child);
			}
			
			child.parent = _that;

			if(
				child.type === BLOCK_NODE 
				|| child.type === VALUE_NODE
				|| child.type === NEGATIVE_BLOCK_NODE
			){
			

				//if current node is not a block-node add child to next block-node
				if(this.type !== BLOCK_NODE){
					this.children[child.name] = child;
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
								parentBlock.children[index][child.name] = child;
							}else{
								parentBlock.children[child.name] = child;
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

		}

		this.setData = function(data){
			_oldData = this.data;
			if(typeof this.data === "string" && this.data === data){
				this.state = STATE_NO_CHANGES;
			}else if(this.state === STATE_NO_CHANGES){
				this.state = STATE_UPDATE;
			}
			this.data = data;
			this.onSetData(data);
		}
		
	
	}
)