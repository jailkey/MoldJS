Seed({
		name : "Mold.Lib.VDom.ValueNode",
		dna : "static"
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
			this.id = Mold.getId();

			var that = this;

			if(!this.isPointer && ~this.name.indexOf(".")){
				this.hasParentValue = true;
				this.parentName = config.name.split(".")[0];
				this.childName = config.name.split(".")[1];
			}

			if(!this.isPointer && ~this.name.indexOf("+")){
				this.hasIndexValue = true;
			}

			this.onSetData = function(data){
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
					services : this.services
				});
				return newNode;
			}

			this.render = function(){

				if(!this.domPointer){
					this.domPointer = _doc.createTextNode(this.data);
				}else{
					this.domPointer.nodeValue = this.data;
				}

				return this.domPointer;
			}

			this.reRender = function(){
				this.domPointer.nodeValue = this.data;
				if(this.parent.type === ATTRIBUTE_NODE){
					this.parent.renderAttribute();
				}
			}

			this.renderString = function(){
				return this.data;
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
					this.domPointer.nodeValue = this.data;
				}
			

			}
		}
	}
)