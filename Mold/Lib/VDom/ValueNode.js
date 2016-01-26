Seed({
		name : "Mold.Lib.VDom.ValueNode",
		dna : "static",
		include : [
			"Mold.Lib.VDom.ProtoNode"
		]
	},
	function(){

		return function ValueNode(config){
			//°include Mold.Lib.VDom.ProtoNode
			
			this.type = VALUE_NODE;
			this.domPointer = false;
			this.isPointer = config.isPointer || false;
			this.hasParentValue = config.hasParentValue || false;
			this.hasIndexValue = config.hasIndexValue || false;
			this.filter = config.filter || false;
			this.parentName = false;
			this.childName = false;
			this.hasBinding = config.binding || false;
			this.id = Mold.getId();

			var that = this;

			var _findParentBlock = function(node){
				while(node.type !== BLOCK_NODE && node.type !== ROOT_NODE){
				
					node = node.parent;
				}
				
				return node;
			}

			var newPath = [];
			this.afterAddedToParent = function(){
				var namePath = this.name;
				if(!this.isPointer && ~this.name.indexOf(".")){
					
					var parts = namePath.split(".");
					var registerNode = false;
					

					for(var i = 0; i < parts.length; i++){
						if(parts[i] === "$parent"){
							registerNode = registerNode.parent || this.parent;
							registerNode = _findParentBlock(registerNode);

						}else{
							newPath.push(parts[i])
						}
					}

					this.hasParentValue = true;
					this.parentName = newPath[0];
					if(registerNode){
						registerNode.registerForSetData(this);
					}
				}
			}

			if(!this.isPointer && ~this.name.indexOf("+")){
				this.hasIndexValue = true;
			}

			this.onSetData = function(data){

				if(this.hasParentValue){
					for(var i = 1; i < newPath.length; i++){
						if(data[newPath[i]]){
							data = data[newPath[i]];
						}
					}
					this.data = data;
				}
				
				if(Mold.isObject(data)){
					this.data = data[this.name]
				}

				if(data === false || !Mold.is(data)){
					this.data = "";
				}

				for(var filterName in this.filter){
					var filter = Mold.Lib.Filter.get(filterName);
					if(filter){
						this.data = filter(this.data, this.filter[filterName]);
					}
				}

			}

			this.clone = function(){
				var newNode =  new ValueNode({
					name : this.name,
					data : this.data,
					isString : this.isString,
					services : this.services,
					filter : Mold.mixin({}, this.filter),
					binding : this.hasBinding
				});
				return newNode;
			}

			this.render = function(){

				if(!this.domPointer){
					this.domPointer = _doc.createTextNode(this.data);
				}else{
					this.domPointer.nodeValue = (this.data === false) ? "" : this.data;
				}

				return this.domPointer;
			}

			this.reRender = function(){
				this.domPointer.nodeValue = (this.data === false) ? "" : this.data;
				if(this.parent.type === ATTRIBUTE_NODE){
					this.parent.renderAttribute();
				}
			}

			this.renderString = function(){
				var output = this.data;
				
				if(output === false || output === null){
					output = "";
				}
				return output;
			}

			this.setDataAndRender = function(data){
				this.setData(data);
				
				if(this.isString){
					if(this.parent.type === ATTRIBUTE_NODE){
						this.parent.renderAttribute();
					}else{
						this.parent.render();
					}
				}else{
					this.render();
					this.domPointer.nodeValue = (this.data === false) ? "" : this.data;
				}
			

			}
		}
	}
)